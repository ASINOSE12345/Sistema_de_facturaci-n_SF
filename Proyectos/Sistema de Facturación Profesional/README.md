# 💼 Sistema de Facturación Profesional

Sistema completo de gestión de facturación profesional desarrollado con React, Node.js, TypeScript y SQLite. Incluye gestión de clientes, proyectos, facturas multi-moneda, timesheet y reportes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Notas Técnicas](#-notas-técnicas)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción

Sistema de facturación profesional diseñado para empresas que necesitan gestionar clientes, proyectos, facturas y tiempos de trabajo. El sistema soporta múltiples monedas (USD, EUR, ARS, MXN), generación de PDFs, envío de facturas por email y seguimiento completo del ciclo de vida de facturas y proyectos.

### Casos de Uso

- ✅ **Gestión de Clientes**: Crear, editar y gestionar información de clientes
- ✅ **Gestión de Proyectos**: Control de proyectos con presupuestos, horas y progreso
- ✅ **Facturación Multi-moneda**: Crear facturas en diferentes monedas
- ✅ **Generación de PDFs**: Exportar facturas en formato PDF profesional
- ✅ **Envío por Email**: Enviar facturas directamente a clientes
- ✅ **Seguimiento de Pagos**: Control de estados de facturas (Draft, Sent, Paid, Overdue)
- ✅ **Reportes**: Análisis de facturación y rentabilidad
- ✅ **Timesheet**: Registro de horas trabajadas (en desarrollo)

## ✨ Características Principales

### Gestión de Clientes
- Creación y edición de clientes
- Información fiscal completa
- Historial de facturas por cliente
- Configuración de términos de pago personalizados

### Gestión de Proyectos
- Creación de proyectos vinculados a clientes
- Control de presupuesto y gastos
- Seguimiento de horas estimadas vs. horas trabajadas
- Estados de proyecto (Planning, In Progress, On Hold, Completed)
- Prioridades y equipos de trabajo

### Facturación
- Facturas multi-moneda (USD, EUR, ARS, MXN)
- Cálculo automático de impuestos
- Múltiples items por factura
- Descuentos y notas
- Vinculación con proyectos
- Generación de PDFs profesionales
- Envío automático por email

### Timesheet
- Registro de horas trabajadas
- Vinculación con proyectos
- Estados de aprobación (Pending, Approved, Rejected)
- Cálculo automático de montos facturables
- Integración con facturación

## 🛠 Tecnologías

### Frontend
- **React 18.3** - Biblioteca de UI
- **TypeScript 5.6** - Tipado estático
- **Vite 6.3** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Sonner** - Notificaciones toast

### Backend
- **Node.js 20+** - Runtime
- **Express 4.21** - Framework web
- **TypeScript 5.6** - Tipado estático
- **Prisma 5.20** - ORM
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Puppeteer** - Generación de PDFs
- **Resend** - Envío de emails
- **Node-cron** - Tareas programadas

## 📦 Requisitos Previos

- **Node.js** 20.x o superior
- **npm** 9.x o superior (o **yarn** / **pnpm**)
- **Git** para clonar el repositorio

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF.git
cd Sistema_de_facturaci-n_SF
```

### 2. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

#### Backend

Copia el archivo de ejemplo y configura las variables:

```bash
cd backend
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Database
DATABASE_URL="file:./data/invoice_system.db"

# Server
PORT=4001
NODE_ENV=development

# JWT
JWT_SECRET="tu-secret-key-super-segura-de-al-menos-32-caracteres"
JWT_EXPIRES_IN="7d"

# Frontend
FRONTEND_URL="http://localhost:4000"

# Email (Resend)
RESEND_API_KEY="tu-api-key-de-resend"
FROM_EMAIL="facturas@tudominio.com"
BUSINESS_NAME="Tu Empresa"

# Currency Exchange (Opcional)
EXCHANGE_RATE_API_KEY="tu-api-key"
```

#### Frontend

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:4001/api
```

### 4. Configurar Base de Datos

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Aplicar migraciones (si existen)
npm run prisma:migrate

# O sincronizar schema con la BD
npm run prisma:push
```

### 5. Iniciar el Sistema

#### Opción 1: Iniciar por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Opción 2: Script de Inicio Unificado

```bash
# Desde la raíz del proyecto
./iniciar-proyecto.command
```

El sistema estará disponible en:
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:4001

## ⚙️ Configuración

### Base de Datos SQLite

El sistema usa SQLite por defecto. La base de datos se crea automáticamente en:
```
backend/data/invoice_system.db
```

### Migraciones Prisma

Para aplicar cambios en el schema:

```bash
cd backend

# Crear nueva migración
npm run prisma:migrate

# O sincronizar sin migraciones (desarrollo)
npm run prisma:push
```

### Prisma Studio

Para visualizar y editar datos directamente:

```bash
cd backend
npm run prisma:studio
```

Esto abrirá Prisma Studio en http://localhost:5555

## 📖 Uso

### Primer Usuario

1. Accede a http://localhost:4000
2. Haz clic en "Registrarse"
3. Completa el formulario de registro
4. Inicia sesión con tus credenciales

### Crear un Cliente

1. Ve a "Clientes" en el menú lateral
2. Haz clic en "+ Nuevo Cliente"
3. Completa la información del cliente
4. Guarda el cliente

### Crear un Proyecto

1. Ve a "Proyectos" en el menú lateral
2. Haz clic en "+ Nuevo Proyecto"
3. Selecciona un cliente
4. Completa la información del proyecto
5. Agrega servicios y presupuesto
6. Guarda el proyecto

### Crear una Factura

1. Ve a "Facturas" en el menú lateral
2. Haz clic en "+ Nueva Factura"
3. Selecciona un cliente (y opcionalmente un proyecto)
4. Completa los items de la factura
5. Revisa la vista previa
6. Guarda como borrador o crea y envía

### Enviar Factura por Email

1. Abre una factura
2. Haz clic en "Enviar por Email"
3. La factura se enviará automáticamente al cliente
4. El estado cambiará a "SENT"

## 📁 Estructura del Proyecto

```
Sistema_de_facturaci-n_SF/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuración (DB, env)
│   │   ├── controllers/    # Controladores de rutas
│   │   ├── routes/         # Definición de rutas
│   │   ├── services/       # Lógica de negocio
│   │   ├── middleware/     # Middlewares (auth, validation)
│   │   ├── utils/          # Utilidades
│   │   └── index.ts        # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma   # Schema de Prisma
│   │   └── migrations/     # Migraciones
│   ├── data/               # Base de datos SQLite
│   └── scripts/            # Scripts de utilidad
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades y API client
│   ├── types/              # Tipos TypeScript
│   └── context/            # React Context
├── docs/                   # Documentación
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Este archivo
```

## 🔧 Notas Técnicas

### SQLite

El sistema usa SQLite como base de datos por defecto. Esto permite:
- ✅ Fácil despliegue sin servidor de BD
- ✅ Portabilidad completa
- ✅ Ideal para aplicaciones de escritorio
- ✅ Backup simple (copiar archivo)

**Limitaciones:**
- No soporta múltiples escritores concurrentes
- Mejor para aplicaciones single-user o small-team

### Migraciones Prisma

El sistema usa Prisma Migrate para gestionar el schema:

```bash
# Crear migración
npm run prisma:migrate

# Aplicar migraciones
npm run prisma:migrate deploy

# Revertir migración
npm run prisma:migrate resolve --rolled-back <migration_name>
```

### Conversión a Aplicación de Escritorio

El proyecto incluye configuración para Electron:

```bash
# Instalar dependencias de Electron
npm install

# Construir aplicación de escritorio
npm run build:electron
```

### Autenticación JWT

El sistema usa JWT para autenticación:
- Tokens expiran en 7 días por defecto
- Se almacenan en `localStorage` del navegador
- Se envían en header `Authorization: Bearer <token>`

### Generación de PDFs

Las facturas se generan usando Puppeteer:
- Renderiza HTML a PDF
- Incluye estilos profesionales
- Soporta múltiples idiomas

## 🗺 Roadmap

### ✅ Completado
- [x] Gestión de clientes
- [x] Gestión de proyectos
- [x] Facturación multi-moneda
- [x] Generación de PDFs
- [x] Envío por email
- [x] Autenticación JWT
- [x] Backend API completo

### 🚧 En Desarrollo
- [ ] Módulo Timesheet completo (backend listo, UI pendiente)
- [ ] Reportes avanzados
- [ ] Dashboard con métricas
- [ ] Exportación de datos

### 📅 Planificado
- [ ] Aplicación de escritorio (Electron)
- [ ] Sincronización en la nube
- [ ] API pública para integraciones
- [ ] Módulo de contabilidad
- [ ] Integración con bancos
- [ ] App móvil

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Reportar Errores

Si encuentras un bug:

1. Verifica que no esté ya reportado en [Issues](https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Screenshots si aplica
   - Información del entorno (OS, Node.js version, etc.)

### Sugerir Features

Para sugerir nuevas funcionalidades:

1. Abre un issue con el tag `enhancement`
2. Describe la funcionalidad propuesta
3. Explica el caso de uso
4. Si es posible, propón una implementación

### Estándares de Código

- Usar TypeScript estricto
- Seguir convenciones de nombres
- Documentar funciones complejas
- Escribir tests cuando sea posible
- Mantener commits descriptivos

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **ASINOSE12345** - *Desarrollo inicial* - [GitHub](https://github.com/ASINOSE12345)

## 🙏 Agradecimientos

- Prisma por el excelente ORM
- Radix UI por los componentes accesibles
- La comunidad de React y Node.js

## 📞 Soporte

Para soporte, abre un issue en GitHub o contacta a través de:
- **GitHub Issues**: [Issues](https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/issues)

---

**Desarrollado con ❤️ usando React, Node.js y TypeScript**

