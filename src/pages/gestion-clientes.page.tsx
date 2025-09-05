
import { DataTable } from "@/components/data-table";
import type { CustomerResponseDto } from "@/interfaces/clientes/clientes.interface";
import clientes from "@/data/clientes.json";
import { customerColumns } from "@/pages/componentes/columns-clientes";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NuevoClientePage from "./componentes/nuevo-cliente";
import { useState } from "react";


const selectFilterOptions = [
    { label: "Activo", value: "true" },
    { label: "Inactivo", value: "false" },
];
export default function GestionClientesPage() {
    const [dialogNuevoCliente, setDialogNuevoCliente] = useState(false);
    return (
        <>
            <Dialog open={dialogNuevoCliente} onOpenChange={setDialogNuevoCliente}>
                <DialogContent className="!max-w-6/12 !h-8/12 overflow-auto" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Clientes</DialogTitle>
                    </DialogHeader>
                    <NuevoClientePage />
                </DialogContent>
            </Dialog>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold mb-4 text-blue-950 dark:text-white">Gestión de Clientes</h1>
                    <Button variant={"success"} onClick={() => setDialogNuevoCliente(true)}><UserRoundPlus /></Button>
                </div>
                <div>
                    <DataTable
                        columns={customerColumns}
                        data={clientes as CustomerResponseDto[]}
                        generalFilterKey="search"
                        generalFilterColumns={["firstName", "lastName", "email", "phone"]}
                        selectFilterKey="estaActivo"
                        selectFilterOptions={selectFilterOptions}
                    />
                </div>
            </div>

        </>
    );
}
