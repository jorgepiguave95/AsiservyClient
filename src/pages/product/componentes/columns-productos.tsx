import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { ProductResponseDto } from '@/interfaces/products/products.interface';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DetallesProductos from './detalles-productos';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientCombobox } from './client-combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateProduct } from '@/services/products/products.mutation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';

export const productColumns: ColumnDef<ProductResponseDto>[] = [
  {
    accessorKey: 'producto',
    header: 'Producto',
    cell: ({ row }) => row.original.producto ?? '-',
  },
  {
    accessorKey: 'nombreCliente',
    header: 'Cliente',
    cell: ({ row }) => row.original.nombreCliente ?? '-',
  },
  {
    accessorKey: 'marca',
    header: 'Marca',
    cell: ({ row }) => row.original.marca ?? '-',
  },
  {
    accessorKey: 'porcentajeMiga',
    header: '% Miga',
    cell: ({ row }) => (row.original.porcentajeMiga ? `${row.original.porcentajeMiga}%` : '-'),
  },
  {
    accessorKey: 'pesoDrenado',
    header: 'Peso Drenado',
    cell: ({ row }) => row.original.pesoDrenado ?? 0,
  },
  {
    accessorKey: 'pesoEnvase',
    header: 'Peso Envase',
    cell: ({ row }) => row.original.pesoEnvase ?? 0,
  },
  {
    accessorKey: 'estaActivo',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.estaActivo ? 'success' : 'destructive'}>
        {row.original.estaActivo ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    filterFn: (row, columnId, value) => {
      if (value === 'all') return true;
      return String(row.getValue(columnId)) === value;
    },
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [dialogType, setDialogType] = useState<'detalles' | 'editar'>('detalles');
      const { mutate: updateProduct, isPending } = useUpdateProduct();
      const queryClient = useQueryClient();

      const handleOpenDialog = (type: 'detalles' | 'editar') => {
        setDialogType(type);
        setDialogOpen(true);
      };

      const [producto, setProducto] = useState('');
      const [nombreCliente, setNombreCliente] = useState('');
      const [marca, setMarca] = useState('');
      const [porcentajeMiga, setPorcentajeMiga] = useState('');
      const [pesoDrenado, setPesoDrenado] = useState('');
      const [pesoEnvase, setPesoEnvase] = useState('');

      useEffect(() => {
        if (dialogType === 'editar' && dialogOpen) {
          setProducto(row.original.producto || '');
          setNombreCliente(row.original.nombreCliente || '');
          setMarca(row.original.marca || '');
          setPorcentajeMiga(row.original.porcentajeMiga?.toString() || '');
          setPesoDrenado(row.original.pesoDrenado?.toString() || '');
          setPesoEnvase(row.original.pesoEnvase?.toString() || '');
        }
      }, [dialogType, dialogOpen, row.original]);

      const handleSaveChanges = () => {
        const updatedData = {
          producto,
          nombreCliente,
          marca,
          porcentajeMiga: parseFloat(porcentajeMiga) || 0,
          pesoDrenado: parseFloat(pesoDrenado) || 0,
          pesoEnvase: parseFloat(pesoEnvase) || 0,
        };

        updateProduct(
          { id: row.original.id, data: updatedData },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['products'] });
              toast.success('Producto actualizado exitosamente', { position: 'top-right' });
              setDialogOpen(false);
            },
            onError: (error) => {
              const errorMessage = handleAxiosError(error);
              toast.error(errorMessage, { position: 'top-right' });
            },
          },
        );
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem onClick={() => handleOpenDialog('detalles')}>
                Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenDialog('editar')}>Editar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {dialogType === 'detalles' && (
            <DetallesProductos
              producto={row.original}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          )}

          {dialogType === 'editar' && dialogOpen && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-0 pb-0 pt-0">
                      Editar Producto
                    </h1>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="producto">Nombre del producto</Label>
                    <Input
                      id="producto"
                      value={producto}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProducto(e.target.value)
                      }
                      placeholder="Ingrese el nombre del producto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nombreCliente" className="flex items-center space-x-2 mb-2">
                      <span>Nombre del cliente</span>
                    </Label>
                    <ClientCombobox value={nombreCliente} onValueChange={setNombreCliente} />
                  </div>
                  <div>
                    <Label htmlFor="marca">Marca del producto</Label>
                    <Input
                      id="marca"
                      value={marca}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setMarca(e.target.value)
                      }
                      placeholder="Ingrese la marca"
                    />
                  </div>
                  <div>
                    <Label htmlFor="porcentajeMiga">Porcentaje de miga</Label>
                    <Input
                      id="porcentajeMiga"
                      type="number"
                      step="0.01"
                      value={porcentajeMiga}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPorcentajeMiga(e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pesoDrenado">Peso de drenado</Label>
                    <Input
                      id="pesoDrenado"
                      type="number"
                      step="0.01"
                      value={pesoDrenado}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPesoDrenado(e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pesoEnvase">Peso de envase</Label>
                    <Input
                      id="pesoEnvase"
                      type="number"
                      step="0.01"
                      value={pesoEnvase}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPesoEnvase(e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <Button
                    variant="success"
                    className="w-full mt-5 mb-0"
                    onClick={handleSaveChanges}
                    disabled={isPending}
                  >
                    <span>{isPending ? 'Guardando...' : 'Guardar cambios'}</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      );
    },
  },
];
