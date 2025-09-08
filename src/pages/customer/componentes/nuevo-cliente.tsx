import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';
import { useCreateClient } from '@/services/customer/customer.mutation';

interface NuevoClientePageProps {
  onClienteCreado?: () => void;
}

export default function NuevoClientePage({ onClienteCreado }: NuevoClientePageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { mutate: createClient } = useCreateClient();

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !phone) {
      toast.error('Todos los campos son obligatorios.', { position: 'top-right' });
      return;
    }

    createClient(
      {
        firstName,
        lastName,
        email,
        phone,
      },
      {
        onSuccess: () => {
          toast.success('Cliente registrado exitosamente', { position: 'top-right' });
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhone('');
          if (onClienteCreado) onClienteCreado();
        },
        onError: (error) => {
          const errorMessage = handleAxiosError(error);
          toast.error(errorMessage, { position: 'top-right' });
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">Nombre</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ingrese el nombre"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Apellido</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Ingrese el apellido"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese el email"
        />
      </div>
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ingrese el teléfono"
        />
      </div>
      <Button variant="success" onClick={handleSubmit} className="w-full">
        Guardar Cambios
      </Button>
    </div>
  );
}
