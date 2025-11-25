# 🤝 Guía de Contribución

Gracias por tu interés en contribuir al Sistema de Facturación Profesional. Esta guía te ayudará a entender cómo puedes contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)
- [Pull Requests](#pull-requests)

## 📜 Código de Conducta

Este proyecto sigue un código de conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables.

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. **Verifica** que no esté ya reportado en [Issues](https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF/issues)
2. **Crea un nuevo issue** con:
   - Título claro y descriptivo
   - Descripción detallada del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Screenshots si aplica
   - Información del entorno:
     - OS y versión
     - Node.js version
     - Navegador (si aplica)
     - Versión del proyecto

### Sugerir Features

Para sugerir nuevas funcionalidades:

1. Abre un issue con el tag `enhancement`
2. Describe la funcionalidad propuesta
3. Explica el caso de uso y por qué sería útil
4. Si es posible, propón una implementación
5. Considera el impacto en la arquitectura existente

## 💻 Proceso de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/Sistema_de_facturaci-n_SF.git
cd Sistema_de_facturaci-n_SF
```

### 2. Configurar Remoto

```bash
# Agregar el repositorio original como upstream
git remote add upstream https://github.com/ASINOSE12345/Sistema_de_facturaci-n_SF.git

# Verificar remotos
git remote -v
```

### 3. Crear Rama

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear rama para tu feature
git checkout -b feature/nombre-de-tu-feature
# o para bugs
git checkout -b fix/descripcion-del-bug
```

### 4. Desarrollo

- Haz tus cambios
- Sigue los estándares de código
- Escribe tests si es posible
- Actualiza documentación si es necesario

### 5. Commit

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar funcionalidad X"
# o
git commit -m "fix: corregir bug en Y"
```

**Convenciones de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma, etc.
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### 6. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-de-tu-feature

# Luego crea un Pull Request en GitHub
```

## 📝 Estándares de Código

### TypeScript

- Usar TypeScript estricto
- Tipar todas las funciones y variables
- Evitar `any` cuando sea posible
- Usar interfaces para objetos complejos

### Nomenclatura

- **Variables y funciones**: `camelCase`
- **Componentes React**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos**: `kebab-case` o `PascalCase` para componentes

### Estructura de Archivos

```
component/
  ├── ComponentName.tsx
  ├── ComponentName.test.tsx
  └── index.ts
```

### Comentarios

- Documentar funciones complejas
- Explicar "por qué" no "qué"
- Mantener comentarios actualizados

### Formato

- Usar Prettier (si está configurado)
- 2 espacios para indentación
- Comillas simples para strings
- Punto y coma al final

## 🔍 Pull Requests

### Antes de Enviar

- [ ] Código sigue los estándares del proyecto
- [ ] Tests pasan (si existen)
- [ ] Documentación actualizada
- [ ] Commits descriptivos
- [ ] Sin conflictos con `main`

### Proceso de Revisión

1. Un mantenedor revisará tu PR
2. Puede haber sugerencias de cambios
3. Responde a los comentarios
4. Una vez aprobado, se hará merge

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Código sigue estándares
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de lint
```

## 🧪 Testing

Si agregas nuevas funcionalidades:

1. Escribe tests unitarios cuando sea posible
2. Prueba manualmente en diferentes navegadores
3. Verifica que no rompes funcionalidad existente

## 📚 Documentación

Si agregas features:

1. Actualiza el README si es necesario
2. Documenta APIs nuevas
3. Agrega ejemplos de uso
4. Actualiza CHANGELOG si existe

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación existente
2. Busca en issues cerrados
3. Abre un issue con la etiqueta `question`

## 🙏 Agradecimientos

¡Gracias por contribuir! Tu ayuda hace que este proyecto sea mejor para todos.

---

**¿Listo para contribuir?** 🚀

1. Fork el repositorio
2. Crea tu rama
3. Haz tus cambios
4. Envía un Pull Request

¡Esperamos tu contribución!

