import { DataTable } from '@/components/data-table';
import type { CustomerResponseDto } from '@/interfaces/customer/customer.interface';
import { customerColumns } from '@/pages/customer/componentes/columns-clientes';
import { Button } from '@/components/ui/button';
import { UserRoundPlus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NuevoClientePage from './componentes/nuevo-cliente';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useClients } from '@/services/customer/customer.query';

const selectFilterOptions = [
  { label: 'Activo', value: 'true' },
  { label: 'Inactivo', value: 'false' },
];
export default function GestionClientesPage() {
  const [dialogNuevoCliente, setDialogNuevoCliente] = useState(false);
  const { data: clientes, isLoading, isError } = useClients();
  const queryClient = useQueryClient();

  const handleClienteCreado = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    setDialogNuevoCliente(false);
  };

  if (isLoading) return <div className="p-6">Cargando clientes...</div>;
  if (isError) return <div className="p-6 text-red-500">Error al cargar clientes.</div>;
  return (
    <>
      <Dialog open={dialogNuevoCliente} onOpenChange={setDialogNuevoCliente}>
        <DialogContent
          className="!max-w-3/12 !h-4/12 overflow-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-0 pb-0 pt-0">
            Nuevo Cliente
          </h1>
          <NuevoClientePage onClienteCreado={handleClienteCreado} />
        </DialogContent>
      </Dialog>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold mb-4 text-blue-950 dark:text-white">
            Gestión de Clientes
          </h1>
          <Button variant={'success'} onClick={() => setDialogNuevoCliente(true)}>
            <UserRoundPlus />
          </Button>
        </div>
        <div className="-mt-5">
          <DataTable
            columns={customerColumns}
            data={clientes as CustomerResponseDto[]}
            generalFilterKey="search"
            generalFilterColumns={['firstName', 'lastName', 'email', 'phone']}
            selectFilterKey="estaActivo"
            selectFilterOptions={selectFilterOptions}
          />
        </div>
      </div>
    </>
  );
}
