import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone } from "lucide-react";

interface ClienteForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    estaActivo: boolean;
}

const initialState: ClienteForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    estaActivo: true,
};

export default function NuevoClientePage() {
    const [form, setForm] = useState<ClienteForm>(initialState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | boolean = value;
        if (type === "checkbox") {
            newValue = (e.target as HTMLInputElement).checked;
        }
        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setError("");
        // Validación básica
        if (!form.firstName || !form.lastName || !form.email || !form.phone) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        // Aquí iría la lógica para guardar el cliente
        alert("Cliente registrado: " + JSON.stringify(form, null, 2));
        setForm(initialState);
        setSubmitted(false);
    };

    return (
        <div className="flex items-center justify-center -mt-40">
            <form
                onSubmit={handleSubmit}
                className="p-8 rounded-xl w-full"
                autoComplete="off"
            >
                <h2 className="text-3xl font-bold text-blue-950 dark:text-white text-center mb-8 flex items-center justify-center gap-2">
                    Nuevo Cliente
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-6 relative">
                        <Label htmlFor="firstName" className="mb-1">Nombre</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-blue-300">
                                <User className="w-5 h-5" />
                            </span>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                                aria-invalid={submitted && !form.firstName}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="mb-6 relative">
                        <Label htmlFor="lastName" className="mb-1">Apellido</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-blue-300">
                                <User className="w-5 h-5" />
                            </span>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Ingrese el apellido"
                                aria-invalid={submitted && !form.lastName}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-6 relative">
                    <Label htmlFor="email" className="mb-1">Email</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-blue-300">
                            <Mail className="w-5 h-5" />
                        </span>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ejemplo@email.com"
                            aria-invalid={submitted && !form.email}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="mb-6 relative">
                    <Label htmlFor="phone" className="mb-1">Teléfono</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-blue-300">
                            <Phone className="w-5 h-5" />
                        </span>
                        <Input
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Ingrese el teléfono"
                            aria-invalid={submitted && !form.phone}
                            className="pl-10"
                        />
                    </div>
                </div>

                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                <Button type="submit" className="w-full text-lg py-3">Registrar</Button>
            </form>
        </div>
    );
}
