import { useState, useMemo } from 'react';
import type {
  ProductResponseDto,
  CrearProductDetailDto,
} from '@/interfaces/products/products.interface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table';
import { Package, User, Tag, Percent, Weight, CheckCircle, Plus, Save } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  useActivateProduct,
  useDeactivateProduct,
  useCreateProductDetails,
} from '@/services/products/products.mutation';
import { useProductDetails } from '@/services/products/products.query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';

interface DetallesProductosProps {
  producto: ProductResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DetalleAgrupado {
  fechaHora: string;
  pesosFill: number[];
  pesosNeto: number[];
}

const detallesColumns: ColumnDef<DetalleAgrupado>[] = [
  {
    accessorKey: 'fechaHora',
    header: 'Fecha/Hora',
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaHora);
      return `${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    },
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    accessorKey: `peso${index + 1}` as keyof DetalleAgrupado,
    header: `Peso ${index + 1}`,
    cell: ({ row }: { row: { original: DetalleAgrupado } }) => {
      const pesoFill = row.original.pesosFill[index];
      const pesoNeto = row.original.pesosNeto[index];

      const mostrarPesoFill = pesoFill !== undefined && pesoFill !== 0;
      const mostrarPesoNeto = pesoNeto !== undefined && pesoNeto !== 0;

      if (!mostrarPesoFill && !mostrarPesoNeto) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="flex flex-col space-y-1 text-xs">
          {mostrarPesoFill && (
            <span className="text-blue-600 font-medium">PF: {pesoFill.toFixed(2)}g</span>
          )}
          {mostrarPesoNeto && (
            <span className="text-green-600 font-medium">PN: {pesoNeto.toFixed(2)}g</span>
          )}
        </div>
      );
    },
  })),
];

export default function DetallesProductos({
  producto,
  open,
  onOpenChange,
}: DetallesProductosProps) {
  const [agregarDetalleOpen, setAgregarDetalleOpen] = useState(false);
  const [pesosFill, setPesosFill] = useState<string[]>(Array(10).fill(''));
  const [pesosNeto, setPesosNeto] = useState<string[]>(Array(10).fill(''));
  const [isGuardando, setIsGuardando] = useState(false);

  const {
    data: detallesRaw = [],
    isLoading: isLoadingDetalles,
    refetch: refetchDetalles,
  } = useProductDetails(producto.id);

  const detallesAgrupados = useMemo(() => {
    const grupos: { [key: string]: DetalleAgrupado } = {};

    detallesRaw.forEach((detalle) => {
      const fecha = new Date(detalle.fecha);
      const claveGrupo = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;

      if (!grupos[claveGrupo]) {
        grupos[claveGrupo] = {
          fechaHora: detalle.fecha,
          pesosFill: Array(10).fill(0),
          pesosNeto: Array(10).fill(0),
        };
      }

      // Determinar la posición basada en el tipo de control
      if (detalle.tipoControl.startsWith('PESO FILL')) {
        const match = detalle.tipoControl.match(/PESO FILL (\d+)/);
        if (match) {
          // Nuevo formato con posición específica
          const posicion = parseInt(match[1]) - 1; // Convertir a índice base 0
          if (posicion >= 0 && posicion < 10) {
            grupos[claveGrupo].pesosFill[posicion] = detalle.peso;
          }
        } else if (detalle.tipoControl === 'PESO FILL') {
          // Formato antiguo sin posición - agregar en orden
          const posicion = grupos[claveGrupo].pesosFill.findIndex((p) => p === 0);
          if (posicion !== -1) {
            grupos[claveGrupo].pesosFill[posicion] = detalle.peso;
          }
        }
      } else if (detalle.tipoControl.startsWith('PESO NETO')) {
        const match = detalle.tipoControl.match(/PESO NETO (\d+)/);
        if (match) {
          // Nuevo formato con posición específica
          const posicion = parseInt(match[1]) - 1; // Convertir a índice base 0
          if (posicion >= 0 && posicion < 10) {
            grupos[claveGrupo].pesosNeto[posicion] = detalle.peso;
          }
        } else if (detalle.tipoControl === 'PESO NETO') {
          // Formato antiguo sin posición - agregar en orden
          const posicion = grupos[claveGrupo].pesosNeto.findIndex((p) => p === 0);
          if (posicion !== -1) {
            grupos[claveGrupo].pesosNeto[posicion] = detalle.peso;
          }
        }
      }
    });

    const resultado = Object.values(grupos).sort(
      (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
    );

    return resultado;
  }, [detallesRaw]);

  const queryClient = useQueryClient();
  const { mutate: activateProduct } = useActivateProduct();
  const { mutate: deactivateProduct } = useDeactivateProduct();
  const { mutate: createProductDetails } = useCreateProductDetails();

  const handlePesoFillChange = (index: number, value: string) => {
    const newPesos = [...pesosFill];
    newPesos[index] = value;
    setPesosFill(newPesos);
  };

  const handlePesoNetoChange = (index: number, value: string) => {
    const newPesos = [...pesosNeto];
    newPesos[index] = value;
    setPesosNeto(newPesos);
  };

  const handleGuardarDetalle = async () => {
    setIsGuardando(true);

    try {
      const tieneValorFill = pesosFill.some(
        (peso) => peso && peso.trim() !== '' && !isNaN(parseFloat(peso)),
      );

      const tieneValorNeto = pesosNeto.some(
        (peso) => peso && peso.trim() !== '' && !isNaN(parseFloat(peso)),
      );

      if (!tieneValorFill) {
        toast.warning('Debe ingresar al menos un valor en Peso Fill', { position: 'top-right' });
        setIsGuardando(false);
        return;
      }

      if (!tieneValorNeto) {
        toast.warning('Debe ingresar al menos un valor en Peso Neto', { position: 'top-right' });
        setIsGuardando(false);
        return;
      }

      const fecha = new Date().toISOString();
      const detallesParaGuardar: CrearProductDetailDto[] = [];

      pesosFill.forEach((peso, index) => {
        let pesoNumerico = 0;

        // Verificar si el peso tiene algún valor
        if (peso !== null && peso !== undefined && peso !== '') {
          const pesoString = String(peso).trim();

          if (pesoString !== '') {
            const valorParseado = parseFloat(pesoString);

            if (!isNaN(valorParseado)) {
              pesoNumerico = Math.round(valorParseado * 100) / 100;
            }
          }
        }

        detallesParaGuardar.push({
          productControlId: producto.id,
          fecha,
          peso: pesoNumerico,
          tipoControl: `PESO FILL ${index + 1}`,
        });
      });

      pesosNeto.forEach((peso, index) => {
        let pesoNumerico = 0;

        if (peso !== null && peso !== undefined && peso !== '') {
          const pesoString = String(peso).trim();

          if (pesoString !== '') {
            const valorParseado = parseFloat(pesoString);

            if (!isNaN(valorParseado)) {
              pesoNumerico = Math.round(valorParseado * 100) / 100;
            }
          }
        }

        detallesParaGuardar.push({
          productControlId: producto.id,
          fecha,
          peso: pesoNumerico,
          tipoControl: `PESO NETO ${index + 1}`,
        });
      });

      let detallesGuardados = 0;
      let erroresCount = 0;
      let ultimoError = '';

      for (const detalle of detallesParaGuardar) {
        try {
          await new Promise<void>((resolve, reject) => {
            createProductDetails(detalle, {
              onSuccess: () => {
                detallesGuardados++;
                resolve();
              },
              onError: (error: any) => {
                erroresCount++;
                ultimoError = handleAxiosError(error);
                reject(error);
              },
            });
          });
        } catch {
          // El error ya se contó y procesó arriba
        }
      }

      if (detallesGuardados > 0) {
        toast.success(
          `${detallesGuardados} detalle(s) guardado(s) exitosamente${
            erroresCount > 0 ? ` (${erroresCount} errores)` : ''
          }`,
          { position: 'top-right' },
        );

        setAgregarDetalleOpen(false);
        setPesosFill(Array(10).fill(''));
        setPesosNeto(Array(10).fill(''));

        queryClient.invalidateQueries({ queryKey: ['productDetails', producto.id] });
        refetchDetalles();
      } else {
        const errorMessage = ultimoError || 'No se pudieron guardar los detalles';
        toast.error(errorMessage, { position: 'top-right' });
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(`Error inesperado: ${errorMessage}`, { position: 'top-right' });
    } finally {
      setIsGuardando(false);
    }
  };

  const handleSubmit = () => {
    if (producto.estaActivo) {
      deactivateProduct(producto.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          toast.info('Producto desactivado exitosamente', { position: 'top-right' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = handleAxiosError(error);
          toast.error(errorMessage, { position: 'top-right' });
        },
      });
    } else {
      activateProduct(producto.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          toast.success('Producto activado exitosamente', { position: 'top-right' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = handleAxiosError(error);
          toast.error(errorMessage, { position: 'top-right' });
        },
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-11/12 max-h-11/12 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Detalles del Producto</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Package className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Producto</span>
                  <p className="text-sm font-medium text-gray-700">{producto.producto}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Cliente</span>
                  <p className="text-sm font-medium text-gray-700">{producto.nombreCliente}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Marca</span>
                  <p className="text-sm font-medium text-gray-700">{producto.marca}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle
                  className={`w-3 h-3 ${producto.estaActivo ? 'text-green-500' : 'text-red-500'}`}
                />
                <div>
                  <span className="text-xs text-gray-500">Estado</span>
                  <Badge
                    variant={producto.estaActivo ? 'success' : 'destructive'}
                    className="text-xs"
                  >
                    {producto.estaActivo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4   gap-3 mt-3 pt-3 border-t border-gray-200 text-sm">
              <div className="flex items-center space-x-2">
                <Percent className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">% Miga</span>
                  <p className="text-sm font-medium text-gray-700">{producto.porcentajeMiga}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Peso Drenado</span>
                  <p className="text-sm font-medium text-gray-700">
                    {(producto.pesoDrenado ?? 0).toFixed(2)}g
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Peso Envase</span>
                  <p className="text-sm font-medium text-gray-700">
                    {(producto.pesoEnvase ?? 0).toFixed(2)}g
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Peso Neto</span>
                  <p className="text-sm font-medium text-gray-700">
                    {((producto.pesoEnvase ?? 0) + (producto.pesoDrenado ?? 0)).toFixed(2)}g
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Detalles con DataTable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Detalles de control</h3>
              {producto.estaActivo && (
                <Button
                  onClick={() => setAgregarDetalleOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Detalle</span>
                </Button>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              {isLoadingDetalles ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300 animate-pulse" />
                  <p>Cargando detalles...</p>
                </div>
              ) : (
                <>
                  <DataTable columns={detallesColumns} data={detallesAgrupados} />
                  {detallesAgrupados.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay registrados detalles sobre el control del producto</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            {producto.estaActivo ? (
              <Button variant="destructive" onClick={handleSubmit} className="w-40">
                Desactivar
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} className="w-40">
                Activar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Agregar Detalle */}
      <Dialog open={agregarDetalleOpen} onOpenChange={setAgregarDetalleOpen}>
        <DialogContent className="!max-w-8/12 max-h-12/12 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Detalle de control de producto</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Peso Fill */}
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 mb-4 col-span-2">
                <Weight className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-semibold text-gray-800">Peso Fill</h4>
              </div>
              {Array.from({ length: 10 }, (_, index) => (
                <div key={`fill-${index}`}>
                  <Label htmlFor={`pesoFill${index}`} className="text-sm font-medium text-gray-600">
                    Peso Fill {index + 1}
                  </Label>
                  <Input
                    id={`pesoFill${index}`}
                    type="number"
                    step="0.01"
                    value={pesosFill[index]}
                    onChange={(e) => handlePesoFillChange(index, e.target.value)}
                    placeholder="0.0"
                    className="mt-1"
                  />
                </div>
              ))}
            </div>

            {/* Columna Peso Neto */}
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 mb-4 col-span-2">
                <Weight className="w-5 h-5 text-green-500" />
                <h4 className="text-lg font-semibold text-gray-800">Peso Neto</h4>
              </div>
              {Array.from({ length: 10 }, (_, index) => (
                <div key={`neto-${index}`}>
                  <Label htmlFor={`pesoNeto${index}`} className="text-sm font-medium text-gray-600">
                    Peso Neto {index + 1}
                  </Label>
                  <Input
                    id={`pesoNeto${index}`}
                    type="number"
                    step="0.01"
                    value={pesosNeto[index]}
                    onChange={(e) => handlePesoNetoChange(index, e.target.value)}
                    placeholder="0.0"
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="destructive" onClick={() => setAgregarDetalleOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleGuardarDetalle}
              className="flex items-center space-x-2"
              variant={'success'}
              disabled={isGuardando}
            >
              <Save className="w-4 h-4" />
              <span>{isGuardando ? 'Guardando...' : 'Agregar Detalle'}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
