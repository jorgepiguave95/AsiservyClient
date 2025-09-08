import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Users, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import type { CustomerResponseDto } from '@/interfaces/customer/customer.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import { useClients } from '@/services/customer/customer.query';

// Configurar fuentes para pdfMake - usando configuración más robusta
if (typeof window !== 'undefined') {
  import('pdfmake/build/vfs_fonts').then((vfs) => {
    // @ts-expect-error - pdfmake vfs configuration
    pdfMake.vfs = vfs.default.pdfMake.vfs;
  });
}

export default function CustomerReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: clientes, isLoading, isError } = useClients();

  const generatePDFReport = async () => {
    if (!clientes || clientes.length === 0) {
      toast.error('No hay datos de clientes para generar el reporte', { position: 'top-right' });
      return;
    }

    setIsGenerating(true);

    try {
      const totalClientes = clientes.length;
      const clientesActivos = clientes.filter(
        (cliente: CustomerResponseDto) => cliente.estaActivo,
      ).length;
      const clientesInactivos = totalClientes - clientesActivos;

      const tableBody = [
        [
          { text: 'Nombre', style: 'tableHeader' },
          { text: 'Apellido', style: 'tableHeader' },
          { text: 'Email', style: 'tableHeader' },
          { text: 'Teléfono', style: 'tableHeader' },
          { text: 'Estado', style: 'tableHeader' },
        ],
        ...clientes.map((cliente: CustomerResponseDto) => [
          cliente.firstName || '-',
          cliente.lastName || '-',
          cliente.email || '-',
          cliente.phone || '-',
          cliente.estaActivo ? 'Activo' : 'Inactivo',
        ]),
      ];

      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          text: 'REPORTE DE CLIENTES',
          style: 'header',
          alignment: 'center',
          margin: [0, 20, 0, 20],
        },
        footer: function (currentPage: number, pageCount: number) {
          return {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            style: 'footer',
          };
        },
        content: [
          // Título principal
          {
            text: 'Reporte de Gestión de Clientes',
            style: 'title',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },

          // Fecha de generación
          {
            text: `Fecha de generación: ${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            style: 'subtitle',
            alignment: 'center',
            margin: [0, 0, 0, 30],
          },

          // Resumen estadístico
          {
            text: 'Resumen Estadístico',
            style: 'sectionHeader',
            margin: [0, 0, 0, 15],
          },
          {
            columns: [
              {
                width: '33%',
                text: [
                  { text: 'Total de Clientes\n', style: 'statLabel' },
                  { text: totalClientes.toString(), style: 'statNumber' },
                ],
                alignment: 'center',
              },
              {
                width: '33%',
                text: [
                  { text: 'Clientes Activos\n', style: 'statLabel' },
                  { text: clientesActivos.toString(), style: 'statNumberGreen' },
                ],
                alignment: 'center',
              },
              {
                width: '34%',
                text: [
                  { text: 'Clientes Inactivos\n', style: 'statLabel' },
                  { text: clientesInactivos.toString(), style: 'statNumberRed' },
                ],
                alignment: 'center',
              },
            ],
            margin: [0, 0, 0, 30],
          },

          // Tabla de clientes
          {
            text: 'Lista Detallada de Clientes',
            style: 'sectionHeader',
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 1,
              widths: ['20%', '20%', '25%', '20%', '15%'],
              body: tableBody,
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#3B82F6' : rowIndex % 2 === 0 ? '#F8FAFC' : null;
              },
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#1E40AF',
          },
          title: {
            fontSize: 24,
            bold: true,
            color: '#1E40AF',
          },
          subtitle: {
            fontSize: 12,
            italics: true,
            color: '#64748B',
          },
          sectionHeader: {
            fontSize: 16,
            bold: true,
            color: '#1E40AF',
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'white',
            fillColor: '#3B82F6',
          },
          statLabel: {
            fontSize: 10,
            color: '#64748B',
          },
          statNumber: {
            fontSize: 20,
            bold: true,
            color: '#1E40AF',
          },
          statNumberGreen: {
            fontSize: 20,
            bold: true,
            color: '#059669',
          },
          statNumberRed: {
            fontSize: 20,
            bold: true,
            color: '#DC2626',
          },
          footer: {
            fontSize: 10,
            color: '#64748B',
          },
        },
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.download(`reporte-clientes-${new Date().toISOString().split('T')[0]}.pdf`);

      toast.success('Reporte PDF generado exitosamente', { position: 'top-right' });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      toast.error('Error al generar el reporte PDF', { position: 'top-right' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando datos para el reporte...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error al cargar los datos del reporte</div>
        </div>
      </div>
    );
  }

  const totalClientes = clientes?.length || 0;
  const clientesActivos =
    clientes?.filter((cliente: CustomerResponseDto) => cliente.estaActivo).length || 0;
  const clientesInactivos = totalClientes - clientesActivos;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950 dark:text-white">Reportes de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Genera reportes en PDF con la información de tus clientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalClientes}</div>
            <p className="text-xs text-gray-600">Clientes registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{clientesActivos}</div>
            <p className="text-xs text-gray-600">
              {totalClientes > 0
                ? `${((clientesActivos / totalClientes) * 100).toFixed(1)}%`
                : '0%'}{' '}
              del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Inactivos</CardTitle>
            <UserX className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{clientesInactivos}</div>
            <p className="text-xs text-gray-600">
              {totalClientes > 0
                ? `${((clientesInactivos / totalClientes) * 100).toFixed(1)}%`
                : '0%'}{' '}
              del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generate Report Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <h1>Generar Reporte PDF</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Genera un reporte completo en PDF con todos los datos de tus clientes, incluyendo
            estadísticas y lista detallada.
          </p>

          <div className="flex items-center gap-4">
            <Button
              onClick={generatePDFReport}
              disabled={isGenerating || totalClientes === 0}
              className="flex items-center gap-2"
              variant="info"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generando...' : 'Descargar'}
            </Button>

            {totalClientes === 0 && (
              <p className="text-sm text-amber-600">No hay clientes para generar el reporte</p>
            )}
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>• El reporte incluye estadísticas generales</p>
            <p>• Lista detallada de todos los clientes</p>
            <p>• Información de estado (activo/inactivo)</p>
            <p>• Fecha y hora de generación</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
