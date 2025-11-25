# 💼 Sistema de Facturación Profesional

Sistema completo de gestión de facturación profesional desarrollado con React, Node.js, TypeScript y SQLite. Incluye gestión de clientes, proyectos, facturas multi-moneda, motor fiscal multi-jurisdiccional (Wyoming, España, Argentina, México), timesheet, dashboard de KPIs y reportes avanzados.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748.svg)](https://www.prisma.io/)

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Casos de Uso](#-casos-de-uso)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Notas Técnicas](#-notas-técnicas)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Reportar Problemas](#-reportar-problemas)
- [Licencia](#-licencia)
- [📘 Descripción Completa](#-descripción-completa)

## 🎯 Descripción

Sistema de facturación profesional diseñado para freelancers, profesionales independientes y pequeñas empresas que necesitan gestionar clientes, proyectos, facturas y tiempos de trabajo de manera eficiente. El sistema soporta múltiples monedas (USD, EUR, ARS, MXN), cálculo automático de impuestos según jurisdicción, generación de PDFs profesionales, envío de facturas por email y seguimiento completo del ciclo de vida de facturas y proyectos.

### Características Destacadas

- 🏢 **Gestión Completa de Clientes**: Base de datos de clientes con información fiscal completa
- 📊 **Dashboard de KPIs**: Métricas en tiempo real de ingresos, facturas pendientes, clientes activos
- 💰 **Facturación Multi-moneda**: Soporte para USD, EUR, ARS, MXN con conversión automática
- 🧮 **Motor Fiscal Multi-jurisdiccional**: Cálculo automático de impuestos para Wyoming (USA), España, Argentina y México
- 📄 **Generación de PDFs**: Facturas profesionales con diseño personalizable
- 📧 **Envío Automático**: Integración con Resend/SendGrid para envío de facturas por email
- ⏱️ **Timesheet**: Registro de horas trabajadas vinculado a proyectos
- 📈 **Reportes Avanzados**: Análisis de facturación, rentabilidad y proyecciones

## ✨ Características Principales

### Gestión de Clientes
- ✅ Creación y edición de clientes con información completa
- ✅ Información fiscal y de contacto
- ✅ Historial de facturas por cliente
- ✅ Configuración de términos de pago personalizados
- ✅ Búsqueda y filtrado avanzado

### Gestión de Proyectos
- ✅ Creación de proyectos vinculados a clientes
- ✅ Control de presupuesto y gastos
- ✅ Seguimiento de horas estimadas vs. horas trabajadas
- ✅ Estados de proyecto (Planning, In Progress, On Hold, Completed)
- ✅ Prioridades y equipos de trabajo
- ✅ Servicios y milestones configurables

### Facturación Multi-moneda
- ✅ Soporte para USD, EUR, ARS, MXN
- ✅ Conversión automática de tasas de cambio (opcional)
- ✅ Cálculo automático de impuestos según jurisdicción
- ✅ Múltiples items por factura
- ✅ Descuentos y notas personalizadas
- ✅ Vinculación con proyectos
- ✅ Estados de factura (Draft, Sent, Paid, Overdue)

### Motor Fiscal Multi-jurisdiccional
El sistema incluye un motor de cálculo fiscal que soporta múltiples jurisdicciones:

- **Wyoming (USA-WY)**: Sales Tax estatal (4%) + local (1%)
- **España (ESP)**: IVA estándar (21%)
- **Argentina (ARG)**: IVA (21%) + Percepciones (2.5%)
- **México (MEX)**: IVA (16%)

El motor calcula automáticamente los impuestos según la jurisdicción configurada, proporcionando un desglose detallado de impuestos base, locales y percepciones.

### Generación de PDFs
- ✅ Facturas profesionales con diseño limpio
- ✅ Incluye logo de empresa personalizable
- ✅ Información fiscal completa
- ✅ Desglose de items y impuestos
- ✅ Múltiples formatos de exportación

### Dashboard de KPIs
- ✅ Total de clientes activos
- ✅ Total de facturas emitidas
- ✅ Ingresos totales (multi-moneda)
- ✅ Montos pendientes de cobro
- ✅ Facturas recientes
- ✅ Gráficos de tendencias
- ✅ Alertas de facturas vencidas

### Timesheet
- ✅ Registro de horas trabajadas
- ✅ Vinculación con proyectos y facturas
- ✅ Estados de aprobación (Pending, Approved, Rejected)
- ✅ Cálculo automático de montos facturables
- ✅ Integración con facturación
- ✅ Reportes de tiempo por proyecto

### Reportes
- ✅ Análisis de facturación por período
- ✅ Rentabilidad por proyecto
- ✅ Proyecciones de ingresos
- ✅ Exportación de datos

## 🛠 Tecnologías

### Frontend
- **React 18.3** - Biblioteca de UI moderna y reactiva
- **TypeScript 5.6** - Tipado estático para mayor seguridad
- **Vite 6.3** - Build tool ultra-rápido y dev server
- **Tailwind CSS** - Framework de estilos utility-first
- **Radix UI** - Componentes accesibles y sin estilos
- **Recharts** - Librería de gráficos para dashboard
- **Axios** - Cliente HTTP para comunicación con API
- **React Hook Form** - Manejo eficiente de formularios
- **Sonner** - Sistema de notificaciones toast elegante
- **Lucide React** - Iconos modernos y ligeros

### Backend
- **Node.js 20+** - Runtime de JavaScript
- **Express 4.21** - Framework web minimalista
- **TypeScript 5.6** - Tipado estático en backend
- **Prisma 5.20** - ORM moderno y type-safe
- **SQLite** - Base de datos ligera y portable
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash seguro de contraseñas
- **Puppeteer** - Generación de PDFs desde HTML
- **Resend** - Servicio de envío de emails moderno
- **SendGrid** - Alternativa para envío de emails (legacy)
- **Node-cron** - Tareas programadas (actualización de estados)
- **Zod** - Validación de esquemas TypeScript-first

## 👥 Casos de Uso

### Freelancers
- Gestión de clientes y proyectos personales
- Facturación rápida y profesional
- Seguimiento de horas trabajadas
- Cálculo automático de impuestos según jurisdicción
- Envío automático de facturas por email

### Profesionales Independientes
- Control de múltiples clientes
- Presupuestos y seguimiento de proyectos
- Facturación multi-moneda para clientes internacionales
- Dashboard con métricas de negocio
- Reportes para declaraciones fiscales

### Pequeñas Empresas (PYMEs)
- Gestión centralizada de facturación
- Equipos de trabajo y asignación de proyectos
- Aprobación de horas trabajadas
- Análisis de rentabilidad por proyecto
- Integración con sistemas contables

## 📦 Requisitos Previos

- **Node.js** 20.x o superior
- **npm** 9.x o superior (o **yarn** / **pnpm**)
- **Git** para clonar el repositorio
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

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
cd ..
```

### 3. Configurar Variables de Entorno

#### Backend

Copia el archivo de ejemplo y configura las variables:

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env` con tus valores:

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

# Email (Resend - Recomendado)
RESEND_API_KEY="tu-api-key-de-resend"
FROM_EMAIL="facturas@tudominio.com"
BUSINESS_NAME="Tu Empresa"

# Email (SendGrid - Legacy, opcional)
# SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"

# Currency Exchange (Opcional)
EXCHANGE_RATE_API_KEY="tu-api-key"
EXCHANGE_RATE_API_URL="https://v6.exchangerate-api.com/v6"
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

# Aplicar migraciones (crea la base de datos y tablas)
npm run prisma:migrate

# O sincronizar schema con la BD (solo desarrollo)
npm run prisma:push
```

**Nota**: La primera vez que ejecutes `prisma:migrate`, se creará la base de datos SQLite en `backend/data/invoice_system.db`.

### 5. Iniciar el Sistema

#### Opción 1: Script de Inicio Unificado (Recomendado)

```bash
# Desde la raíz del proyecto
./iniciar-proyecto.command
```

Este script:
- Verifica dependencias
- Inicia el backend en el puerto 4001
- Inicia el frontend en el puerto 4000
- Abre el navegador automáticamente

#### Opción 2: Iniciar por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

El sistema estará disponible en:
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:4001
- **API Docs**: http://localhost:4001/api

## ⚙️ Configuración

### Base de Datos SQLite

El sistema usa SQLite por defecto. La base de datos se crea automáticamente en:
```
backend/data/invoice_system.db
```

**Ventajas de SQLite:**
- ✅ Fácil despliegue sin servidor de BD
- ✅ Portabilidad completa (un solo archivo)
- ✅ Ideal para aplicaciones de escritorio
- ✅ Backup simple (copiar archivo)
- ✅ Sin configuración adicional

**Limitaciones:**
- ⚠️ No soporta múltiples escritores concurrentes
- ⚠️ Mejor para aplicaciones single-user o small-team
- ⚠️ Para producción con alta concurrencia, considerar PostgreSQL

### Migraciones Prisma

El sistema usa Prisma Migrate para gestionar el schema de la base de datos. Es **muy importante** ejecutar las migraciones antes de usar el sistema.

```bash
cd backend

# Crear nueva migración (después de cambiar schema.prisma)
npm run prisma:migrate

# Aplicar migraciones pendientes
npm run prisma:migrate deploy

# Sincronizar sin migraciones (solo desarrollo, no recomendado en producción)
npm run prisma:push
```

**⚠️ Importante**: Siempre haz backup de la base de datos antes de ejecutar migraciones en producción.

### Prisma Studio

Para visualizar y editar datos directamente en la base de datos:

```bash
cd backend
npm run prisma:studio
```

Esto abrirá Prisma Studio en http://localhost:5555 - una interfaz gráfica para explorar y editar datos.

### Motor Fiscal

El motor fiscal está configurado en `backend/src/services/tax.service.ts`. Para agregar nuevas jurisdicciones:

1. Edita `TAX_CONFIGS` en `tax.service.ts`
2. Agrega la configuración de impuestos para la nueva jurisdicción
3. El sistema calculará automáticamente los impuestos al crear facturas

Ejemplo de configuración:
```typescript
'USA-CA': { 
  jurisdiction: 'USA-CA', 
  country: 'USA', 
  state: 'CA', 
  salesTax: 7.25, 
  localTax: 1.0, 
  taxType: 'SALES_TAX' 
}
```

### Conversión a Aplicación de Escritorio

El proyecto incluye configuración para Electron, permitiendo empaquetar la aplicación como aplicación de escritorio:

```bash
# Instalar dependencias de Electron (ya incluidas)
npm install

# Construir aplicación de escritorio
npm run build:electron
```

La aplicación de escritorio incluirá:
- Frontend React empaquetado
- Backend Node.js integrado
- Base de datos SQLite local
- Sin necesidad de servidor externo

## 📖 Uso

### Primer Usuario

1. Accede a http://localhost:4000
2. Haz clic en "Registrarse"
3. Completa el formulario de registro (nombre, email, contraseña)
4. Inicia sesión con tus credenciales
5. Serás redirigido al Dashboard

### Crear un Cliente

1. Ve a "Clientes" en el menú lateral
2. Haz clic en "+ Nuevo Cliente"
3. Completa la información del cliente:
   - Nombre y apellido / Razón social
   - Email y teléfono
   - Dirección fiscal
   - Información de impuestos (jurisdicción)
4. Guarda el cliente

### Crear un Proyecto

1. Ve a "Proyectos" en el menú lateral
2. Haz clic en "+ Nuevo Proyecto"
3. Selecciona un cliente
4. Completa la información del proyecto:
   - Nombre y descripción
   - Presupuesto estimado
   - Fechas de inicio y fin
   - Estado y prioridad
   - Servicios incluidos
5. Guarda el proyecto

### Crear una Factura

1. Ve a "Facturas" en el menú lateral
2. Haz clic en "+ Nueva Factura"
3. Selecciona un cliente (y opcionalmente un proyecto)
4. Configura la factura:
   - Moneda (USD, EUR, ARS, MXN)
   - Fecha de emisión y vencimiento
   - Jurisdicción fiscal (para cálculo de impuestos)
5. Agrega items:
   - Descripción
   - Cantidad
   - Precio unitario
   - El sistema calculará automáticamente subtotales e impuestos
6. Revisa la vista previa
7. Guarda como borrador o crea y envía

### Enviar Factura por Email

1. Abre una factura existente
2. Haz clic en "Enviar por Email"
3. La factura se generará como PDF
4. Se enviará automáticamente al email del cliente
5. El estado cambiará a "SENT"

**Requisitos**: Debes tener configurado `RESEND_API_KEY` o `SENDGRID_API_KEY` en `backend/.env`.

### Registrar Horas (Timesheet)

1. Ve a "Timesheet" en el menú lateral
2. Haz clic en "+ Nueva Entrada"
3. Selecciona proyecto y fecha
4. Ingresa horas trabajadas y descripción
5. Guarda la entrada
6. Las horas se vincularán al proyecto para facturación

### Ver Dashboard de KPIs

1. El Dashboard se muestra automáticamente al iniciar sesión
2. Verás métricas en tiempo real:
   - Total de clientes
   - Total de facturas
   - Ingresos totales
   - Montos pendientes
3. Gráficos de tendencias y facturas recientes

## 📁 Estructura del Proyecto

```
Sistema_de_facturaci-n_SF/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuración (DB, env)
│   │   ├── controllers/    # Controladores de rutas
│   │   │   ├── auth.controller.ts
│   │   │   ├── clients.controller.ts
│   │   │   ├── invoices.controller.ts
│   │   │   ├── projects.controller.ts
│   │   │   ├── settings.controller.ts
│   │   │   └── timesheet.controller.ts
│   │   ├── routes/         # Definición de rutas API
│   │   ├── services/       # Lógica de negocio
│   │   │   ├── tax.service.ts      # Motor fiscal
│   │   │   ├── pdf.service.ts      # Generación PDFs
│   │   │   ├── email.service.ts    # Envío de emails
│   │   │   └── currency.service.ts # Conversión de monedas
│   │   ├── middleware/     # Middlewares (auth, validation)
│   │   ├── utils/          # Utilidades (JWT, password)
│   │   ├── jobs/           # Tareas programadas
│   │   └── index.ts        # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma   # Schema de Prisma
│   │   └── migrations/     # Migraciones de BD
│   ├── data/               # Base de datos SQLite
│   ├── scripts/            # Scripts de utilidad
│   ├── .env.example        # Ejemplo de variables de entorno
│   └── package.json
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── ui/            # Componentes UI (Radix UI)
│   │   ├── dashboard.tsx  # Dashboard de KPIs
│   │   ├── clients-manager.tsx
│   │   ├── invoices-manager.tsx
│   │   ├── projects-manager.tsx
│   │   ├── timesheet-manager.tsx
│   │   └── reports-manager.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useClients.ts
│   │   ├── useInvoices.ts
│   │   └── useProjects.ts
│   ├── lib/                # Utilidades y API client
│   │   ├── api.ts         # Cliente API con Axios
│   │   ├── formatters.ts  # Formateo de datos
│   │   └── constants.ts   # Constantes
│   ├── types/              # Tipos TypeScript
│   ├── context/            # React Context (Auth)
│   └── styles/             # Estilos globales
├── docs/                   # Documentación adicional
├── .github/                # Templates de GitHub
│   └── ISSUE_TEMPLATE/
├── .gitignore             # Archivos ignorados por Git
├── LICENSE                # Licencia MIT
├── README.md              # Este archivo
├── CONTRIBUTING.md        # Guía de contribución
├── CHANGELOG.md           # Historial de cambios
├── iniciar-proyecto.command # Script de inicio
└── package.json           # Dependencias frontend
```

## 🔧 Notas Técnicas

### SQLite

El sistema usa SQLite como base de datos por defecto. Esto permite:
- ✅ Fácil despliegue sin servidor de BD
- ✅ Portabilidad completa (un solo archivo)
- ✅ Ideal para aplicaciones de escritorio
- ✅ Backup simple (copiar archivo)
- ✅ Sin configuración adicional

**Limitaciones:**
- ⚠️ No soporta múltiples escritores concurrentes
- ⚠️ Mejor para aplicaciones single-user o small-team
- ⚠️ Para producción con alta concurrencia, considerar migrar a PostgreSQL

**Migración a PostgreSQL**: El proyecto incluye un backup del schema PostgreSQL en `backend/prisma/schema.prisma.postgresql.backup` para facilitar la migración si es necesario.

### Migraciones Prisma

El sistema usa Prisma Migrate para gestionar el schema. Es **crítico** ejecutar las migraciones:

```bash
# Crear migración
npm run prisma:migrate

# Aplicar migraciones
npm run prisma:migrate deploy

# Revertir migración (si es necesario)
npm run prisma:migrate resolve --rolled-back <migration_name>
```

**⚠️ Importante**: 
- Siempre haz backup antes de migraciones en producción
- Las migraciones son versionadas y se guardan en `backend/prisma/migrations/`
- Nunca edites migraciones ya aplicadas

### Autenticación JWT

El sistema usa JWT para autenticación:
- Tokens expiran en 7 días por defecto (configurable en `.env`)
- Se almacenan en `localStorage` del navegador
- Se envían en header `Authorization: Bearer <token>`
- El backend valida el token en cada request protegido

**Seguridad:**
- Usa un `JWT_SECRET` fuerte (mínimo 32 caracteres)
- Nunca compartas el `JWT_SECRET` en el código
- En producción, usa variables de entorno seguras

### Generación de PDFs

Las facturas se generan usando Puppeteer:
- Renderiza HTML a PDF de alta calidad
- Incluye estilos profesionales
- Soporta múltiples idiomas
- Incluye logo de empresa personalizable

**Requisitos**: Puppeteer requiere Chromium, que se instala automáticamente con `npm install`.

### Envío de Emails

El sistema soporta dos proveedores de email:

1. **Resend** (Recomendado): Servicio moderno y fácil de usar
   - Configura `RESEND_API_KEY` en `.env`
   - Obtén tu API key en https://resend.com

2. **SendGrid** (Legacy): Alternativa tradicional
   - Configura `SENDGRID_API_KEY` en `.env`
   - Obtén tu API key en https://sendgrid.com

### Conversión a Aplicación de Escritorio

El proyecto incluye configuración para Electron:

```bash
# Construir aplicación de escritorio
npm run build:electron
```

La aplicación de escritorio:
- Incluye frontend y backend empaquetados
- Base de datos SQLite local
- Sin necesidad de servidor externo
- Ejecutable para Windows, macOS y Linux

### Recomendaciones de Seguridad

1. **Variables de Entorno**: Nunca commitees archivos `.env` con valores reales
2. **JWT Secret**: Usa un secret fuerte y único en producción
3. **HTTPS**: En producción, siempre usa HTTPS
4. **Validación**: Todas las entradas del usuario son validadas
5. **SQL Injection**: Prisma previene automáticamente SQL injection
6. **CORS**: Configura CORS correctamente en producción

## 🗺 Roadmap

### ✅ Completado
- [x] Gestión de clientes completa
- [x] Gestión de proyectos con presupuestos
- [x] Facturación multi-moneda (USD, EUR, ARS, MXN)
- [x] Motor fiscal multi-jurisdiccional (Wyoming, España, Argentina, México)
- [x] Generación de PDFs profesionales
- [x] Envío por email (Resend/SendGrid)
- [x] Autenticación JWT
- [x] Backend API completo con TypeScript
- [x] Dashboard de KPIs básico
- [x] Backend de Timesheet

### 🚧 En Desarrollo
- [ ] Módulo Timesheet completo (backend listo, UI pendiente de mejoras)
- [ ] Reportes avanzados con gráficos
- [ ] Dashboard con más métricas y visualizaciones
- [ ] Exportación de datos (CSV, Excel)
- [ ] Filtros avanzados en todas las vistas

### 📅 Planificado
- [ ] Aplicación de escritorio (Electron) - Estructura lista
- [ ] Sincronización en la nube
- [ ] API pública para integraciones
- [ ] Módulo de contabilidad avanzado
- [ ] Integración con bancos (Open Banking)
- [ ] App móvil (React Native)
- [ ] Multi-idioma (i18n)
- [ ] Plantillas de factura personalizables
- [ ] Recordatorios automáticos de pagos
- [ ] Integración con sistemas contables (QuickBooks, Xero)

## 🤝 Contribución

Las contribuciones son bienvenidas y apreciadas. Este proyecto sigue el [Código de Conducta del Contribuidor](CONTRIBUTING.md).

### Cómo Contribuir

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Estándares de Código

- ✅ Usar TypeScript estricto
- ✅ Seguir convenciones de nombres del proyecto
- ✅ Documentar funciones complejas
- ✅ Escribir tests cuando sea posible
- ✅ Mantener commits descriptivos y atómicos
- ✅ Actualizar documentación si es necesario

### Proceso de Pull Request

1. Asegúrate de que tu código compile sin errores
2. Ejecuta las migraciones de Prisma si modificaste el schema
3. Prueba tus cambios localmente
4. Actualiza la documentación si es necesario
5. Describe claramente los cambios en el PR

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

### Reportar Bugs

1. Verifica que no esté ya reportado en [Issues](https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/issues)
2. Crea un nuevo issue usando el [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md)
3. Incluye:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Screenshots si aplica
   - Información del entorno (OS, Node.js version, etc.)
   - Logs de error si hay

### Sugerir Features

Para sugerir nuevas funcionalidades:

1. Abre un issue con el tag `enhancement` usando el [template de feature request](.github/ISSUE_TEMPLATE/feature_request.md)
2. Describe la funcionalidad propuesta
3. Explica el caso de uso y el valor que aporta
4. Si es posible, propón una implementación o diseño

### Preguntas y Soporte

Para preguntas generales o soporte:
- Abre un issue con el tag `question`
- O contacta a través de GitHub Discussions (si está habilitado)

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 ASINOSE12345

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Autores

- **ASINOSE12345** - *Desarrollo inicial* - [GitHub](https://github.com/ASINOSE12345)

## 🙏 Agradecimientos

- [Prisma](https://www.prisma.io/) por el excelente ORM
- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles
- [Vite](https://vitejs.dev/) por el build tool ultra-rápido
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
- La comunidad de React y Node.js

## 📸 Screenshots

> **Nota**: Si tienes screenshots del sistema, puedes agregarlos aquí para mejorar la comprensión del proyecto. Por ejemplo:
> 
> ```markdown
> ### Dashboard
> ![Dashboard](docs/screenshots/dashboard.png)
> 
> ### Crear Factura
> ![Crear Factura](docs/screenshots/create-invoice.png)
> 
> ### Motor Fiscal
> ![Motor Fiscal](docs/screenshots/tax-engine.png)
> ```
> 
> Para agregar screenshots:
> 1. Crea la carpeta `docs/screenshots/`
> 2. Agrega tus imágenes (PNG, JPG)
> 3. Actualiza esta sección con las rutas correctas

## 📞 Soporte

Para soporte, abre un issue en GitHub:
- **GitHub Issues**: [Issues](https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/issues)

## 📘 Descripción Completa

Para una descripción exhaustiva y detallada de todo el software, incluyendo arquitectura completa, módulos, servicios, modelos de datos, flujos de trabajo y estadísticas del proyecto, consulta el documento **[DESCRIPTION.md](DESCRIPTION.md)**.

Este documento incluye:
- 🏗️ Arquitectura completa del sistema
- 📦 Descripción detallada de todos los módulos
- 🔧 Servicios del backend explicados
- 🗄️ Esquema completo de base de datos
- 🔐 Medidas de seguridad implementadas
- 🚀 Guía de despliegue
- 📊 Estadísticas del proyecto
- 🔄 Flujos de trabajo principales

---

**Desarrollado con ❤️ usando React, Node.js y TypeScript**

[⬆ Volver arriba](#-sistema-de-facturación-profesional)
