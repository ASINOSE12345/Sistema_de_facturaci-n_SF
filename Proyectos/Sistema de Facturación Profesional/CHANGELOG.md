# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- Sistema completo de gestión de proyectos
- Backend API para proyectos con CRUD completo
- Endpoints de timesheet (backend completo)
- Integración de proyectos en creación de facturas
- Mapeo automático de estados entre frontend y backend
- Script de prueba de persistencia
- Documentación completa (README, CONTRIBUTING, ISSUE_TEMPLATE)

### Fixed
- Proyectos ahora se guardan correctamente en base de datos
- Dropdown de proyectos en facturas carga datos reales
- Sincronización entre frontend y backend
- Mapeo de estados de proyectos (active ↔ IN_PROGRESS)

### Changed
- Hook useProjects ahora conecta con API real
- Componente InvoicesManager carga proyectos dinámicamente
- Mejora en manejo de errores con logs detallados

## [1.0.0] - 2025-11-25

### Added
- Sistema de autenticación JWT
- Gestión completa de clientes
- Gestión de facturas multi-moneda
- Generación de PDFs profesionales
- Envío de facturas por email
- Dashboard con métricas
- Reportes básicos
- Configuración del sistema
- Base de datos SQLite con Prisma
- Backend API RESTful completo
- Frontend React con TypeScript
- UI moderna con Tailwind CSS y Radix UI

### Technical
- Arquitectura separada frontend/backend
- TypeScript en todo el stack
- Prisma ORM para gestión de BD
- Validaciones robustas
- Manejo de errores completo
- Logs estructurados

[Unreleased]: https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/releases/tag/v1.0.0

