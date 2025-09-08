## 🚀 Tecnologías utilizadas

- **Frontend Framework:** [React 19](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)
- **Routing:** [TanStack Router](https://tanstack.com/router/latest)
- **Data Tables:** [TanStack Table](https://tanstack.com/table/latest)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

---

## 📦 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/jorgepiguave95/AsiservyClient.git
cd AsiservyClient
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Asegúrate de que el backend esté ejecutándose en `http://localhost:3000/api/`

### 4. Ejecutar el proyecto

```bash
npm run dev

La aplicación estará disponible en `http://localhost:5173`
---

## 🔐 Credenciales de acceso

Para iniciar sesión en el sistema, utiliza las siguientes credenciales:

- **Usuario:** `admin`
- **Contraseña:** `sistemas`


## 📁 Estructura del proyecto

src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base (ShadCN)
│   └── data-table.tsx  # Componente de tabla de datos
├── interfaces/         # Tipos e interfaces TypeScript
├── layout/            # Layouts de la aplicación
├── pages/             # Páginas principales
│   ├── customer/      # Gestión de clientes
│   └── product/       # Gestión de productos
├── services/          # Servicios y llamadas a API
├── hooks/             # Hooks personalizados
├── lib/               # Utilidades y configuraciones
└── routes/            # Configuración de rutas
```

## 🎯 Funcionalidades principales

### Gestión de Clientes

- ✅ Listar clientes con paginación y filtros
- ✅ Crear nuevos clientes
- ✅ Editar información de clientes
- ✅ Activar/desactivar clientes
- ✅ Ver detalles completos de clientes

### Gestión de Productos

- ✅ Listar productos con información detallada
- ✅ Crear nuevos productos
- ✅ Editar productos existentes
- ✅ Gestión de marca, porcentajes y pesos
- ✅ Asociación con clientes

### Características Técnicas

- 🔄 Actualizaciones en tiempo real con TanStack Query
- 📱 Diseño responsive con Tailwind CSS
- 🎨 Interfaz moderna con componentes ShadCN
- 📊 Tablas interactivas con ordenamiento y filtros
- 🔔 Notificaciones de estado con Sonner
- 🛡️ Manejo robusto de errores
