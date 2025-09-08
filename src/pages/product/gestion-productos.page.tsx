import { DataTable } from '@/components/data-table';
import type { ProductResponseDto } from '@/interfaces/products/products.interface';
import { useProducts } from '@/services/products/products.query';
import { productColumns } from '@/pages/product/componentes/columns-productos';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NuevoProductoPage from './componentes/nuevo-producto';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const selectFilterOptions = [
  { label: 'Activo', value: 'true' },
  { label: 'Inactivo', value: 'false' },
];

export default function GestionProductoPage() {
  const [dialogNuevoProducto, setDialogNuevoProducto] = useState(false);
  const { data: productos, isLoading, isError } = useProducts();
  const queryClient = useQueryClient();

  const handleProductoCreado = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setDialogNuevoProducto(false);
  };

  if (isLoading) return <div className="p-6">Cargando productos...</div>;
  if (isError) return <div className="p-6 text-red-500">Error al cargar productos.</div>;

  return (
    <>
      <Dialog open={dialogNuevoProducto} onOpenChange={setDialogNuevoProducto}>
        <DialogContent
          className="!max-w-3/12 !h-6/12 overflow-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-0 pb-0 pt-0">
            Nuevo Producto
          </h1>
          <NuevoProductoPage onProductoCreado={handleProductoCreado} />
        </DialogContent>
      </Dialog>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold mb-4 text-blue-950 dark:text-white">
            Gestión de Productos
          </h1>
          <Button variant={'success'} onClick={() => setDialogNuevoProducto(true)}>
            <Plus />
          </Button>
        </div>
        <div className="-mt-5">
          <DataTable
            columns={productColumns}
            data={productos as ProductResponseDto[]}
            generalFilterKey="search"
            generalFilterColumns={['producto', 'nombreCliente', 'marca']}
            selectFilterKey="estaActivo"
            selectFilterOptions={selectFilterOptions}
          />
        </div>
      </div>
    </>
  );
}
