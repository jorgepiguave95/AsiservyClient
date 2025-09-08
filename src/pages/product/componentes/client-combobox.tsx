'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useClients } from '@/services/customer/customer.query';

interface ClientComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

interface ClienteOption {
  value: string;
  label: string;
}

export function ClientCombobox({ value, onValueChange }: ClientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { data: clientes, isLoading } = useClients();

  const clientesActivos = React.useMemo((): ClienteOption[] => {
    if (!clientes) return [];
    return clientes
      .filter((cliente: any) => cliente.estaActivo)
      .map((cliente: any) => ({
        value: `${cliente.firstName} ${cliente.lastName}`.toLowerCase(),
        label: `${cliente.firstName} ${cliente.lastName}`,
      }));
  }, [clientes]);

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        Cargando clientes...
        <ChevronsUpDown className="opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? clientesActivos.find(
                (cliente: ClienteOption) => cliente.value === value.toLowerCase(),
              )?.label
            : 'Seleccionar cliente...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró cliente.</CommandEmpty>
            <CommandGroup>
              {clientesActivos.map((cliente: ClienteOption) => (
                <CommandItem
                  key={cliente.value}
                  value={cliente.value}
                  onSelect={(currentValue: string) => {
                    const selectedClient = clientesActivos.find(
                      (c: ClienteOption) => c.value === currentValue,
                    );
                    onValueChange(selectedClient ? selectedClient.label : '');
                    setOpen(false);
                  }}
                >
                  {cliente.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value.toLowerCase() === cliente.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
