# 📘 Descripción Completa del Sistema de Facturación Profesional

## 🎯 Visión General

El **Sistema de Facturación Profesional** es una aplicación web full-stack de código abierto diseñada para freelancers, profesionales independientes y pequeñas empresas que necesitan gestionar de manera integral su facturación, clientes, proyectos y tiempos de trabajo. El sistema combina una interfaz moderna y intuitiva con un backend robusto y escalable, ofreciendo funcionalidades avanzadas como facturación multi-moneda, cálculo automático de impuestos según jurisdicción, generación de PDFs profesionales y seguimiento completo del ciclo de vida de proyectos y facturas.

## 🏗️ Arquitectura del Sistema

### Arquitectura General

El sistema sigue una arquitectura **cliente-servidor** con separación clara entre frontend y backend:

- **Frontend**: Aplicación React 18 con TypeScript, construida con Vite para desarrollo rápido y builds optimizados
- **Backend**: API RESTful construida con Node.js y Express, utilizando TypeScript para type-safety
- **Base de Datos**: SQLite con Prisma ORM para gestión type-safe del schema y migraciones
- **Autenticación**: Sistema JWT (JSON Web Tokens) para autenticación stateless
- **Comunicación**: API REST con JSON, cliente HTTP Axios en frontend

### Stack Tecnológico Completo

#### Frontend
- **React 18.3.1**: Biblioteca de UI moderna con hooks y componentes funcionales
- **TypeScript 5.6.3**: Tipado estático para mayor seguridad y productividad
- **Vite 6.3.5**: Build tool ultra-rápido con HMR (Hot Module Replacement)
- **Tailwind CSS**: Framework utility-first para estilos rápidos y consistentes
- **Radix UI**: Componentes accesibles y sin estilos predefinidos (48+ componentes)
- **Recharts 2.15.4**: Librería de gráficos para visualización de datos en dashboard
- **React Hook Form 7.55.0**: Manejo eficiente de formularios con validación
- **Axios 1.7.7**: Cliente HTTP para comunicación con la API
- **Sonner 2.0.3**: Sistema de notificaciones toast elegante
- **Lucide React 0.487.0**: Iconos modernos y ligeros
- **React Day Picker 8.10.1**: Selector de fechas accesible

#### Backend
- **Node.js 20+**: Runtime de JavaScript del lado del servidor
- **Express 4.21.1**: Framework web minimalista y flexible
- **TypeScript 5.6.3**: Tipado estático en backend
- **Prisma 5.20.0**: ORM moderno con type-safety y migraciones
- **SQLite**: Base de datos ligera, portable y sin servidor
- **JWT (jsonwebtoken 9.0.2)**: Autenticación basada en tokens
- **Bcrypt 5.1.1**: Hash seguro de contraseñas
- **Puppeteer 24.24.0**: Generación de PDFs desde HTML
- **Resend 6.2.2**: Servicio moderno de envío de emails
- **SendGrid 8.1.6**: Alternativa para envío de emails (legacy)
- **Node-cron 4.2.1**: Tareas programadas (actualización de estados de facturas)
- **Zod 3.23.8**: Validación de esquemas TypeScript-first
- **Express-validator 7.2.0**: Validación de requests HTTP

## 📦 Módulos y Funcionalidades

### 1. Módulo de Autenticación y Usuarios

#### Características
- Registro de nuevos usuarios con validación
- Login con email y contraseña
- Autenticación JWT con tokens que expiran en 7 días (configurable)
- Gestión de sesiones en el navegador (localStorage)
- Protección de rutas en frontend y backend
- Middleware de autenticación en todas las rutas protegidas

#### Modelo de Datos
- **User**: Información del usuario (email, nombre, contraseña hasheada, rol, información fiscal)
- **Settings**: Configuraciones personalizadas por usuario (email, facturación, banco)

#### Seguridad
- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT firmados con secret key
- Validación de inputs en frontend y backend
- Protección contra SQL injection (Prisma)
- CORS configurado para desarrollo y producción

### 2. Módulo de Gestión de Clientes

#### Funcionalidades Principales
- **CRUD Completo**: Crear, leer, actualizar y eliminar clientes
- **Información Fiscal**: Almacenamiento de datos fiscales completos (tax ID, dirección, jurisdicción)
- **Información de Contacto**: Email, teléfono, dirección física
- **Configuración por Cliente**: Moneda preferida, términos de pago, tasa de impuestos
- **Historial Automático**: Seguimiento de facturas emitidas por cliente
- **Búsqueda y Filtrado**: Búsqueda por nombre, email, estado
- **Estados**: Clientes activos o inactivos

#### Modelo de Datos
- **Client**: Información completa del cliente vinculada al usuario
- Relaciones: Un cliente tiene muchas facturas y proyectos

#### Características Avanzadas
- Total facturado por cliente (calculado automáticamente)
- Fecha de última factura
- Moneda preferida por cliente
- Términos de pago personalizados

### 3. Módulo de Gestión de Proyectos

#### Funcionalidades Principales
- **CRUD Completo**: Gestión completa del ciclo de vida de proyectos
- **Vinculación con Clientes**: Cada proyecto pertenece a un cliente
- **Control de Presupuesto**: Presupuesto estimado vs. gastado
- **Seguimiento de Horas**: Horas estimadas vs. horas registradas
- **Estados de Proyecto**: Planning, In Progress, On Hold, Completed
- **Prioridades**: Low, Medium, High
- **Equipos de Trabajo**: Lista de miembros del equipo (JSON)
- **Servicios**: Lista de servicios incluidos en el proyecto (JSON)
- **Milestones**: Hitos del proyecto con fechas (JSON)
- **Progreso**: Porcentaje de completitud (0-100%)
- **Fechas**: Fecha de inicio y fin del proyecto

#### Modelo de Datos
- **Project**: Información completa del proyecto
- Relaciones: Un proyecto pertenece a un cliente y usuario, tiene muchas facturas y time entries

#### Características Avanzadas
- Cálculo automático de presupuesto gastado
- Seguimiento de horas trabajadas vs. estimadas
- Vinculación con facturas para tracking de ingresos
- Filtrado por estado, cliente, prioridad

### 4. Módulo de Facturación

#### Funcionalidades Principales
- **CRUD Completo**: Crear, editar, eliminar y consultar facturas
- **Facturación Multi-moneda**: Soporte para USD, EUR, ARS, MXN
- **Motor Fiscal Multi-jurisdiccional**: Cálculo automático de impuestos según jurisdicción
- **Múltiples Items**: Cada factura puede tener múltiples items
- **Cálculo Automático**: Subtotal, impuestos, descuentos y total calculados automáticamente
- **Estados de Factura**: Draft, Sent, Paid, Pending, Overdue, Cancelled
- **Vinculación con Proyectos**: Las facturas pueden estar vinculadas a proyectos
- **Generación de PDFs**: Exportación profesional de facturas a PDF
- **Envío por Email**: Envío automático de facturas a clientes
- **Numeración Automática**: Sistema de numeración secuencial configurable
- **Notas y Términos**: Campos para notas adicionales y términos de pago
- **Múltiples Idiomas**: Soporte para diferentes idiomas en facturas

#### Modelo de Datos
- **Invoice**: Información principal de la factura
- **InvoiceItem**: Items individuales de cada factura (descripción, cantidad, precio, horas, tasa)
- Relaciones: Una factura pertenece a un cliente, usuario y opcionalmente un proyecto

#### Motor Fiscal Multi-jurisdiccional

El sistema incluye un motor de cálculo fiscal (`TaxService`) que soporta:

- **Wyoming (USA-WY)**: Sales Tax estatal (4%) + local (1%) = 5% total
- **España (ESP)**: IVA estándar (21%)
- **Argentina (ARG)**: IVA (21%) + Percepciones (2.5%) = 23.5% total
- **México (MEX)**: IVA (16%)

El motor calcula automáticamente:
- Impuesto base (estatal/VAT)
- Impuestos locales (si aplica)
- Percepciones (si aplica)
- Total de impuestos
- Desglose completo para la factura

#### Características Avanzadas
- Conversión de monedas (opcional, requiere API key)
- Cálculo de descuentos porcentuales o fijos
- Items con horas trabajadas (vinculación con timesheet)
- Items con cantidad y precio unitario
- Fechas de emisión y vencimiento
- Tracking de fechas de envío y pago
- Métodos de pago registrados
- URLs de PDFs generados

### 5. Módulo de Timesheet (Registro de Tiempo)

#### Funcionalidades Principales
- **CRUD Completo**: Crear, editar, eliminar y consultar entradas de tiempo
- **Vinculación con Proyectos**: Cada entrada está vinculada a un proyecto
- **Vinculación con Facturas**: Las horas pueden ser facturadas y vinculadas a facturas
- **Registro Detallado**: Fecha, hora de inicio, hora de fin, horas trabajadas, minutos
- **Tasas Personalizadas**: Tasa por hora configurable por entrada
- **Multi-moneda**: Soporte para diferentes monedas
- **Estados de Aprobación**: Pending, Approved, Rejected, Billed
- **Sistema de Aprobación**: Los administradores pueden aprobar/rechazar horas
- **Cálculo Automático**: Monto total calculado automáticamente (horas × tasa)
- **Tags**: Sistema de etiquetas para categorización (JSON)
- **Tareas**: Nombre de tarea y descripción detallada
- **Facturabilidad**: Marca si las horas son facturables o no

#### Modelo de Datos
- **TimeEntry**: Entrada de tiempo con toda la información
- Relaciones: Una entrada pertenece a un usuario, proyecto y opcionalmente una factura y aprobador

#### Características Avanzadas
- Cálculo automático de horas desde startTime y endTime
- Integración con facturación para crear items automáticamente
- Filtrado por proyecto, fecha, estado, facturabilidad
- Reportes de tiempo por proyecto
- Aprobación/rechazo con razones

### 6. Módulo de Dashboard y KPIs

#### Métricas en Tiempo Real
- **Total de Clientes**: Número de clientes activos
- **Total de Facturas**: Número de facturas emitidas
- **Ingresos Totales**: Suma de todas las facturas pagadas (multi-moneda)
- **Montos Pendientes**: Suma de facturas pendientes de pago
- **Facturas Recientes**: Lista de últimas facturas creadas
- **Gráficos de Tendencias**: Visualización de ingresos a lo largo del tiempo
- **Alertas**: Notificaciones de facturas vencidas o próximas a vencer

#### Visualizaciones
- Tarjetas de métricas con iconos
- Gráficos de líneas para tendencias
- Gráficos de barras para comparaciones
- Listas de elementos recientes
- Badges de estado con colores

### 7. Módulo de Reportes

#### Funcionalidades
- **Análisis de Facturación**: Reportes por período (mensual, trimestral, anual)
- **Rentabilidad por Proyecto**: Análisis de ingresos vs. costos por proyecto
- **Proyecciones**: Estimaciones de ingresos futuros
- **Exportación**: Capacidad de exportar datos (CSV, Excel - en desarrollo)
- **Filtros Avanzados**: Por cliente, proyecto, fecha, estado, moneda

### 8. Módulo de Configuración

#### Configuraciones Disponibles
- **Email**: Configuración de remitente, reply-to, SMTP
- **Facturación**: Prefijo de facturas, siguiente número, moneda por defecto
- **Impuestos**: Tasa de impuestos por defecto
- **Términos de Pago**: Días de pago por defecto
- **Información Bancaria**: Datos de cuenta bancaria para pagos
- **Instrucciones de Pago**: Texto personalizado para facturas

#### Modelo de Datos
- **Settings**: Configuraciones por usuario (relación 1:1 con User)

## 🔧 Servicios del Backend

### 1. TaxService (Motor Fiscal)
- Cálculo automático de impuestos según jurisdicción
- Soporte para Sales Tax, VAT y sistemas mixtos
- Desglose detallado de impuestos
- Fácil extensión para nuevas jurisdicciones

### 2. PDFService (Generación de PDFs)
- Generación de PDFs profesionales desde HTML
- Incluye logo de empresa
- Diseño limpio y profesional
- Soporte para múltiples idiomas
- Información fiscal completa

### 3. EmailService (Envío de Emails)
- Integración con Resend (recomendado)
- Integración con SendGrid (legacy)
- Envío de facturas como PDF adjunto
- Templates de email personalizables

### 4. CurrencyService (Conversión de Monedas)
- Conversión automática de monedas (opcional)
- Integración con Exchange Rate API
- Caché de tasas de cambio
- Soporte para USD, EUR, ARS, MXN

### 5. InvoiceNumberService (Numeración de Facturas)
- Generación automática de números de factura
- Prefijo configurable
- Numeración secuencial
- Prevención de duplicados

## 🗄️ Base de Datos

### Esquema de Base de Datos (Prisma)

#### Modelos Principales
1. **User**: Usuarios del sistema
2. **Settings**: Configuraciones por usuario
3. **Client**: Clientes
4. **Project**: Proyectos
5. **Invoice**: Facturas
6. **InvoiceItem**: Items de facturas
7. **TimeEntry**: Entradas de tiempo
8. **AuditLog**: Log de auditoría (para futuras implementaciones)

#### Características de la Base de Datos
- **SQLite**: Base de datos ligera y portable
- **Migraciones**: Sistema de migraciones versionado con Prisma
- **Type-Safety**: TypeScript types generados automáticamente
- **Relaciones**: Foreign keys y cascadas configuradas
- **Índices**: Optimización de consultas con índices en campos clave
- **Validación**: Constraints a nivel de base de datos

### Relaciones entre Modelos

```
User (1) ──< (N) Client
User (1) ──< (N) Project
User (1) ──< (N) Invoice
User (1) ──< (N) TimeEntry
User (1) ──< (1) Settings

Client (1) ──< (N) Project
Client (1) ──< (N) Invoice

Project (1) ──< (N) Invoice
Project (1) ──< (N) TimeEntry

Invoice (1) ──< (N) InvoiceItem
Invoice (1) ──< (N) TimeEntry
```

## 🔐 Seguridad

### Medidas Implementadas
- **Autenticación JWT**: Tokens firmados y con expiración
- **Hash de Contraseñas**: Bcrypt con 10 rounds
- **Validación de Inputs**: En frontend (React Hook Form) y backend (Zod, Express-validator)
- **Protección SQL Injection**: Prisma ORM previene automáticamente
- **CORS**: Configurado para desarrollo y producción
- **Variables de Entorno**: Secrets nunca en código
- **HTTPS Ready**: Preparado para producción con HTTPS

### Mejores Prácticas
- Nunca exponer secrets en el código
- Validar todos los inputs del usuario
- Usar tokens con expiración corta
- Implementar rate limiting (futuro)
- Logs de auditoría (modelo creado)

## 🚀 Despliegue y Producción

### Opciones de Despliegue

#### Desarrollo Local
- Frontend: `npm run dev` (Vite dev server)
- Backend: `npm run dev` (tsx watch)
- Base de datos: SQLite local

#### Producción
- Frontend: Build estático (`npm run build`) → Servir con Nginx/Apache
- Backend: Build TypeScript (`npm run build`) → Ejecutar con Node.js
- Base de datos: SQLite (o migrar a PostgreSQL para alta concurrencia)

#### Aplicación de Escritorio
- Electron configurado
- Empaquetado para Windows, macOS, Linux
- Incluye frontend, backend y base de datos

### Requisitos de Producción
- Node.js 20+
- Servidor web (Nginx recomendado)
- SSL/TLS (HTTPS)
- Variables de entorno configuradas
- Backup de base de datos

## 📊 Estadísticas del Proyecto

### Código
- **Frontend**: ~15,000+ líneas de código TypeScript/TSX
- **Backend**: ~8,000+ líneas de código TypeScript
- **Componentes UI**: 48+ componentes Radix UI
- **Modelos de Datos**: 8 modelos principales
- **Rutas API**: 6 grupos de rutas principales
- **Servicios**: 5 servicios principales

### Funcionalidades
- **Módulos Principales**: 8 módulos
- **Endpoints API**: 30+ endpoints REST
- **Pantallas/Views**: 7 vistas principales
- **Formularios**: 10+ formularios complejos
- **Reportes**: Dashboard + módulo de reportes

## 🎨 Interfaz de Usuario

### Diseño
- **Estilo**: Moderno, limpio y profesional
- **Colores**: Sistema de colores consistente
- **Tipografía**: Fuentes modernas y legibles
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Componentes Radix UI con ARIA labels

### Componentes Principales
- Dashboard con métricas y gráficos
- Tablas de datos con paginación y filtros
- Formularios con validación en tiempo real
- Modales y diálogos
- Notificaciones toast
- Navegación lateral (sidebar)
- Badges de estado con colores

## 🔄 Flujos de Trabajo

### Flujo de Creación de Factura
1. Usuario selecciona cliente (y opcionalmente proyecto)
2. Configura moneda y jurisdicción fiscal
3. Agrega items (descripción, cantidad, precio)
4. Sistema calcula automáticamente subtotal, impuestos y total
5. Usuario revisa y guarda como borrador o crea y envía
6. Si envía, se genera PDF y se envía por email
7. Estado cambia a "SENT"

### Flujo de Registro de Tiempo
1. Usuario selecciona proyecto
2. Ingresa fecha, horas trabajadas y descripción
3. Sistema calcula monto (horas × tasa)
4. Entrada queda en estado "PENDING"
5. Administrador aprueba o rechaza
6. Si se aprueba, puede vincularse a una factura
7. Al facturar, se crean items automáticamente

### Flujo de Gestión de Proyecto
1. Usuario crea proyecto vinculado a cliente
2. Configura presupuesto, fechas y equipo
3. Se registran horas trabajadas (timesheet)
4. Se crean facturas vinculadas al proyecto
5. Sistema calcula presupuesto gastado y progreso
6. Proyecto puede cambiar de estado según avance

## 📈 Roadmap y Futuro

### En Desarrollo
- Mejoras en UI del módulo Timesheet
- Reportes avanzados con más visualizaciones
- Exportación de datos (CSV, Excel)

### Planificado
- Aplicación de escritorio completa (Electron)
- Sincronización en la nube
- API pública para integraciones
- Módulo de contabilidad avanzado
- Integración con bancos (Open Banking)
- App móvil (React Native)
- Multi-idioma (i18n)
- Plantillas de factura personalizables
- Recordatorios automáticos de pagos
- Integración con sistemas contables (QuickBooks, Xero)

## 🤝 Contribución

El proyecto es open source y acepta contribuciones. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

**Versión del Documento**: 1.0  
**Última Actualización**: Enero 2025  
**Mantenido por**: ASINOSE12345

