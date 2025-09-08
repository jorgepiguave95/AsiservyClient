import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleAxiosError } from '@/lib/utils';
import type {
  EditarClienteFormProps,
  ActualizacionClienteDto,
} from '@/interfaces/customer/customer.interface';
import { updateClient } from '@/services/customer/customer.service';

export default function EditarClienteForm({ cliente, onClose }: EditarClienteFormProps) {
  const [firstName, setFirstName] = useState(cliente.firstName);
  const [lastName, setLastName] = useState(cliente.lastName);
  const [email, setEmail] = useState(cliente.email);
  const [phone, setPhone] = useState(cliente.phone);
  const queryClient = useQueryClient();

  const { mutate: editClient } = useMutation({
    mutationFn: (updatedClientData: ActualizacionClienteDto) =>
      updateClient(cliente.id, updatedClientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente actualizado exitosamente', { position: 'top-right' });
      onClose?.();
    },
    onError: (error) => {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage, { position: 'top-right' });
    },
  });

  const handleSubmit = () => {
    const updatedData: ActualizacionClienteDto = { firstName, lastName, email, phone };
    editClient(updatedData);
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
