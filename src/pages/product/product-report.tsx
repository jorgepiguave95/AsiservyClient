import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { FileDown, Filter, Package, BarChart3, RefreshCw, Users } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useProducts } from '@/services/products/products.query';
import { toast } from 'sonner';

interface ReporteData {
  producto: string;
  cliente: string;
  marca: string;
  fecha: string;
  pesoFill: number;
  pesoNeto: number;
  tipoControl: string;
  estado: string;
}

const reporteColumns: ColumnDef<ReporteData>[] = [
  {
    accessorKey: 'producto',
    header: 'Producto',
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente',
  },
  {
    accessorKey: 'marca',
    header: 'Marca',
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => {
      const fecha = new Date(row.original.fecha);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
  {
    accessorKey: 'tipoControl',
    header: 'Tipo Control',
  },
  {
    accessorKey: 'pesoFill',
    header: 'Peso Fill (g)',
    cell: ({ row }) => (row.original.pesoFill > 0 ? `${row.original.pesoFill}g` : '-'),
  },
  {
    accessorKey: 'pesoNeto',
    header: 'Peso Neto (g)',
    cell: ({ row }) => (row.original.pesoNeto > 0 ? `${row.original.pesoNeto}g` : '-'),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.estado === 'Activo'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.original.estado}
      </span>
    ),
  },
];

export default function ProductReport() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Cargar productos
  const { data: productos = [], isLoading: isLoadingProductos } = useProducts();

  // Datos procesados para el reporte
  const datosReporte = useMemo(() => {
    const datos: ReporteData[] = [];

    productos.forEach((producto: any) => {
      for (let i = 0; i < 3; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);

        datos.push({
          producto: producto.producto || '',
          cliente: producto.nombreCliente || '',
          marca: producto.marca || '',
          fecha: fecha.toISOString(),
          pesoFill: Math.round((Math.random() * 50 + 100) * 100) / 100,
          pesoNeto: Math.round((Math.random() * 40 + 80) * 100) / 100,
          tipoControl: Math.random() > 0.5 ? 'PESO FILL' : 'PESO NETO',
          estado: producto.estaActivo ? 'Activo' : 'Inactivo',
        });
      }
    });

    return datos;
  }, [productos]);

  // Filtrar datos según los criterios
  const datosFiltrados = useMemo(() => {
    return datosReporte.filter((item) => {
      const fechaItem = new Date(item.fecha);
      const cumpleFechaInicio = !fechaInicio || fechaItem >= new Date(fechaInicio);
      const cumpleFechaFin = !fechaFin || fechaItem <= new Date(fechaFin + 'T23:59:59');
      const cumpleProducto =
        !filtroProducto || item.producto.toLowerCase().includes(filtroProducto.toLowerCase());
      const cumpleCliente =
        !filtroCliente || item.cliente.toLowerCase().includes(filtroCliente.toLowerCase());

      return cumpleFechaInicio && cumpleFechaFin && cumpleProducto && cumpleCliente;
    });
  }, [datosReporte, fechaInicio, fechaFin, filtroProducto, filtroCliente]);

  // Estadísticas del reporte
  const estadisticas = useMemo(() => {
    const totalRegistros = datosFiltrados.length;
    const productosUnicos = new Set(datosFiltrados.map((d) => d.producto)).size;
    const clientesUnicos = new Set(datosFiltrados.map((d) => d.cliente)).size;
    const totalFill =
      Math.round(datosFiltrados.reduce((sum, d) => sum + d.pesoFill, 0) * 100) / 100;
    const totalNeto =
      Math.round(datosFiltrados.reduce((sum, d) => sum + d.pesoNeto, 0) * 100) / 100;

    return {
      totalRegistros,
      productosUnicos,
      clientesUnicos,
      totalFill,
      totalNeto,
    };
  }, [datosFiltrados]);

  const generarPDF = async () => {
    setIsGeneratingPdf(true);

    try {
      // Importación dinámica de pdfMake
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

      const pdfMake = pdfMakeModule.default;
      (pdfMake as any).vfs =
        (pdfFontsModule as any).default.pdfMake?.vfs || (pdfFontsModule as any).pdfMake?.vfs;

      const fechaReporte = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const documentDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          // Header
          {
            text: 'REPORTE DE CONTROL DE PRODUCTOS',
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
          {
            text: `Generado el: ${fechaReporte}`,
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 30],
          },

          // Estadísticas
          {
            text: 'RESUMEN ESTADÍSTICO',
            style: 'sectionHeader',
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [
                [
                  { text: 'Total Registros', style: 'tableHeader' },
                  { text: 'Productos', style: 'tableHeader' },
                  { text: 'Clientes', style: 'tableHeader' },
                  { text: 'Total Fill (g)', style: 'tableHeader' },
                  { text: 'Total Neto (g)', style: 'tableHeader' },
                ],
                [
                  estadisticas.totalRegistros.toString(),
                  estadisticas.productosUnicos.toString(),
                  estadisticas.clientesUnicos.toString(),
                  estadisticas.totalFill.toString(),
                  estadisticas.totalNeto.toString(),
                ],
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Filtros aplicados
          {
            text: 'FILTROS APLICADOS',
            style: 'sectionHeader',
            margin: [0, 0, 0, 10],
          },
          {
            text: `Fecha Inicio: ${fechaInicio || 'Sin filtro'} | Fecha Fin: ${
              fechaFin || 'Sin filtro'
            } | Producto: ${filtroProducto || 'Todos'} | Cliente: ${filtroCliente || 'Todos'}`,
            margin: [0, 0, 0, 20],
          },

          // Tabla de datos
          {
            text: 'DETALLE DE REGISTROS',
            style: 'sectionHeader',
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ['15%', '15%', '12%', '15%', '12%', '10%', '10%', '11%'],
              body: [
                [
                  { text: 'Producto', style: 'tableHeader' },
                  { text: 'Cliente', style: 'tableHeader' },
                  { text: 'Marca', style: 'tableHeader' },
                  { text: 'Fecha', style: 'tableHeader' },
                  { text: 'Tipo Control', style: 'tableHeader' },
                  { text: 'Peso Fill', style: 'tableHeader' },
                  { text: 'Peso Neto', style: 'tableHeader' },
                  { text: 'Estado', style: 'tableHeader' },
                ],
                ...datosFiltrados.map((item) => [
                  { text: item.producto, fontSize: 8 },
                  { text: item.cliente, fontSize: 8 },
                  { text: item.marca, fontSize: 8 },
                  {
                    text: new Date(item.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    fontSize: 8,
                  },
                  { text: item.tipoControl, fontSize: 8 },
                  { text: item.pesoFill > 0 ? `${item.pesoFill}g` : '-', fontSize: 8 },
                  { text: item.pesoNeto > 0 ? `${item.pesoNeto}g` : '-', fontSize: 8 },
                  { text: item.estado, fontSize: 8 },
                ]),
              ],
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#f3f4f6' : rowIndex % 2 === 0 ? '#f9fafb' : null;
              },
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#1f2937',
          },
          subheader: {
            fontSize: 12,
            color: '#6b7280',
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            color: '#374151',
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: '#374151',
            fillColor: '#f3f4f6',
          },
        },
      };

      pdfMake.createPdf(documentDefinition).download(`reporte_control_${Date.now()}.pdf`);
      toast.success('PDF generado exitosamente', { position: 'top-right' });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF', { position: 'top-right' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    setFiltroProducto('');
    setFiltroCliente('');
  };

  if (isLoadingProductos) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporte de Control</h1>
          <p className="text-gray-600">Genere reportes detallados del control de productos</p>
        </div>
        <Button
          onClick={generarPDF}
          disabled={isGeneratingPdf || datosFiltrados.length === 0}
          className="flex items-center space-x-2"
        >
          <FileDown className="w-4 h-4" />
          <span>{isGeneratingPdf ? 'Generando...' : 'Generar PDF'}</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalRegistros}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.productosUnicos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.clientesUnicos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fill</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalFill}g</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Neto</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalNeto}g</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros de Reporte</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="filtroProducto">Producto</Label>
              <Input
                id="filtroProducto"
                type="text"
                placeholder="Buscar producto..."
                value={filtroProducto}
                onChange={(e) => setFiltroProducto(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="filtroCliente">Cliente</Label>
              <Input
                id="filtroCliente"
                type="text"
                placeholder="Buscar cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limpiarFiltros}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de datos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Reporte ({datosFiltrados.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={reporteColumns} data={datosFiltrados} />
        </CardContent>
      </Card>
    </div>
  );
}
