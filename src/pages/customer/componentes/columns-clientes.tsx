import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { CustomerResponseDto } from '@/interfaces/customer/customer.interface';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditarClienteForm from './detalles-clientes';
import { useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';
import { useActivateClient, useDeactivateClient } from '@/services/customer/customer.mutation';

export const customerColumns: ColumnDef<CustomerResponseDto>[] = [
  {
    accessorKey: 'firstName',
    header: 'Nombre',
    cell: ({ row }) => row.original.firstName ?? '-',
  },
  {
    accessorKey: 'lastName',
    header: 'Apellido',
    cell: ({ row }) => row.original.lastName ?? '-',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email ?? '-',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => row.original.phone ?? '-',
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
      const { mutate: activateClient } = useActivateClient();
      const { mutate: deactivateClient } = useDeactivateClient();
      const queryClient = useQueryClient();

      const handleOpenDialog = (type: 'detalles' | 'editar') => {
        setDialogType(type);
        setDialogOpen(true);
      };

      const handleSubmit = () => {
        if (row.original.estaActivo) {
          deactivateClient(row.original.id, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['clients'] });
              toast.info('Cliente desactivado exitosamente', { position: 'top-right' });
              setDialogOpen(false);
            },
            onError: (error) => {
              const errorMessage = handleAxiosError(error);
              toast.error(errorMessage, { position: 'top-right' });
            },
          });
        } else {
          activateClient(row.original.id, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['clients'] });
              toast.success('Cliente activado exitosamente', { position: 'top-right' });
              setDialogOpen(false);
            },
            onError: (error) => {
              const errorMessage = handleAxiosError(error);
              toast.error(errorMessage, { position: 'top-right' });
            },
          });
        }
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-0 pb-0 pt-0">
                    {dialogType === 'detalles' ? 'Detalles del Cliente' : 'Editar Cliente'}
                  </h1>
                </DialogTitle>
              </DialogHeader>
              {dialogType === 'detalles' ? (
                <div className="p-6 bg-white shadow-lg">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="text-gray-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        {row.original.firstName} {row.original.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="text-gray-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        {row.original.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="text-gray-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        {row.original.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle
                        className={`text-lg ${
                          row.original.estaActivo ? '!text-green-500' : '!text-red-500'
                        }`}
                      />
                      <Badge variant={row.original.estaActivo ? 'success' : 'destructive'}>
                        {row.original.estaActivo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {row.original.estaActivo ? (
                        <Button variant="destructive" onClick={handleSubmit} className="w-full">
                          Desactivar
                        </Button>
                      ) : (
                        <Button variant="success" onClick={handleSubmit} className="w-full">
                          Activar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <EditarClienteForm
                    cliente={{
                      id: row.original.id,
                      firstName: row.original.firstName ?? '',
                      lastName: row.original.lastName ?? '',
                      email: row.original.email ?? '',
                      phone: row.original.phone ?? '',
                    }}
                    onClose={() => setDialogOpen(false)}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
