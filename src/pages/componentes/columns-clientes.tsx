import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerResponseDto } from "@/interfaces/clientes/clientes.interface";


export const customerColumns: ColumnDef<CustomerResponseDto>[] = [
    {
        accessorKey: "firstName",
        header: "Nombre",
        cell: ({ row }) => row.original.firstName ?? "-",
    },
    {
        accessorKey: "lastName",
        header: "Apellido",
        cell: ({ row }) => row.original.lastName ?? "-",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email ?? "-",
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => row.original.phone ?? "-",
    },
    {
        accessorKey: "estaActivo",
        header: "Estado",
        cell: ({ row }) => row.original.estaActivo ? (
            <span className="text-green-600 font-semibold">Activo</span>
        ) : (
            <span className="text-red-600 font-semibold">Inactivo</span>
        ),
        filterFn: (row, columnId, value) => {
            if (value === "all") return true;
            return String(row.getValue(columnId)) === value;
        },
        enableColumnFilter: true,
    },
];
