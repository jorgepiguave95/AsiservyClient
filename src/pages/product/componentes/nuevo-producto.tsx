import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateProduct } from '@/services/products/products.mutation';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';
import type { CreacionProductoDto } from '@/interfaces/products/products.interface';
import { ClientCombobox } from './client-combobox';

interface NuevoProductoPageProps {
  onProductoCreado: () => void;
}

export default function NuevoProductoPage({ onProductoCreado }: NuevoProductoPageProps) {
  const [producto, setProducto] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [marca, setMarca] = useState('');
  const [porcentajeMiga, setPorcentajeMiga] = useState('');
  const [pesoDrenado, setPesoDrenado] = useState('');
  const [pesoEnvase, setPesoEnvase] = useState('');

  const { mutate: createProduct } = useCreateProduct();

  const handleSubmit = () => {
    if (!producto || !nombreCliente || !marca || !porcentajeMiga || !pesoDrenado || !pesoEnvase) {
      toast.error('Todos los campos son obligatorios.', { position: 'top-right' });
      return;
    }

    const productoData: CreacionProductoDto = {
      producto,
      nombreCliente,
      marca,
      porcentajeMiga: parseFloat(porcentajeMiga),
      pesoDrenado: parseFloat(pesoDrenado),
      pesoEnvase: parseFloat(pesoEnvase),
    };

    createProduct(productoData, {
      onSuccess: () => {
        toast.success('Producto creado exitosamente', { position: 'top-right' });
        setProducto('');
        setNombreCliente('');
        setMarca('');
        setPorcentajeMiga('');
        setPesoDrenado('');
        setPesoEnvase('');
        onProductoCreado();
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error);
        toast.error(errorMessage, { position: 'top-right' });
      },
    });
  };

  return (
    <div className="space-y-4 -mt-10">
      <div>
        <Label htmlFor="producto">Nombre del producto</Label>
        <Input
          id="producto"
          value={producto}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProducto(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarca(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPorcentajeMiga(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPesoDrenado(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPesoEnvase(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <Button variant="success" onClick={handleSubmit} className="w-full mt-5 mb-0">
        <span>Crear Producto</span>
      </Button>
    </div>
  );
}
