
# CommunityHub — Backend

API REST para **CommunityHub**, una plataforma comunitaria de gestión y participación en actividades y eventos. Proyecto final del curso de Software Libre.

## Tecnologías

- Node.js 24 LTS
- Express 5
- MongoDB Atlas + Mongoose 9
- JSON Web Tokens (`jsonwebtoken`) para autenticación
- `bcryptjs` para hasheo de contraseñas
- `express-validator` para validación de requests
- `cors`, `helmet` para seguridad
- `dotenv` para variables de entorno
- ES Modules (`import`/`export default`) en todo el código

## Requisitos previos

- Node.js 24 LTS o superior
- Una base de datos MongoDB (Atlas o local)

## Instalación

```bash
npm ci
```

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores reales:

```env
PORT= Tú puerto
NODE_ENV=development

MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<basededatos>

JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost: Tú puerto 
```

> El archivo `.env` nunca se sube al repositorio (está en `.gitignore`). `FRONTEND_URL` debe coincidir exactamente con el puerto en el que corre el frontend, o las peticiones fallarán por CORS.

## Scripts disponibles

```bash
npm run dev            # Levanta el servidor con nodemon (recarga automática)
npm run start           # Levanta el servidor en modo producción
npm run create-admin    # Crea o promueve un usuario a rol admin
```

Uso de `create-admin` (es el único mecanismo para generar el primer administrador, ya que el registro público siempre asigna rol `user`):

```bash
npm run create-admin -- admin@correo.com Password123 Nombre Apellido
```

## Estructura del proyecto

```
src/
├── config/          # Conexión a la base de datos
├── controllers/     # Manejadores de request/response por recurso
├── middleware/       # Autenticación, autorización, validación, errores
├── models/           # Schemas de Mongoose
├── routes/            # Definición de endpoints por recurso
├── services/          # Lógica de negocio
├── utils/             # Clases y helpers compartidos
├── app.js             # Configuración de Express y montaje de rutas
└── server.js          # Punto de entrada, conexión a la base y arranque
scripts/
└── createAdmin.js     # Script para crear/promover administradores
```

## Roles y permisos

El sistema maneja tres roles: **Administrador**, **Organizador** y **Usuario**. El registro público siempre crea usuarios con rol `user` — ningún endpoint permite que el cliente elija su propio rol.

| Acción | Usuario | Organizador | Admin |
|---|---|---|---|
| Consultar actividades publicadas | ✅ | ✅ | ✅ |
| Inscribirse / marcar favoritos | ✅ | — | ✅ |
| Crear / editar / cancelar sus propias actividades | — | ✅ | ✅ (cualquiera) |
| Eliminar actividades | — | — | ✅ |
| Gestionar categorías | — | — | ✅ |
| Gestionar usuarios | — | — | ✅ |
| Ver participantes de una actividad | — | ✅ (solo las propias) | ✅ (cualquiera) |

## Endpoints principales

Formato de respuesta uniforme: `{ success, message, data }`.

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me        (protegido)
POST   /api/auth/logout    (protegido)
```

### Usuarios (admin)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id       (borrado lógico)
GET    /api/users/stats     (estadísticas agregadas, admin)
GET    /api/users/me/registrations
GET    /api/users/me/favorites
GET    /api/users/me/notifications
```

### Categorías
```
GET    /api/categories                      (cualquier rol autenticado)
GET    /api/categories/:id
POST   /api/categories                      (admin)
PUT    /api/categories/:id                  (admin)
DELETE /api/categories/:id                  (admin, borrado lógico)
```

### Eventos / Actividades
```
GET    /api/events        (?category, date, location, organizer, available, search, mine, includeInactive)
GET    /api/events/:id
POST   /api/events         (admin, organizer)
PUT    /api/events/:id     (admin, organizer dueño)
PATCH  /api/events/:id
DELETE /api/events/:id     (admin, borrado lógico)
GET    /api/events/:id/registrations   (admin, organizer dueño — participantes)
```

### Inscripciones
```
POST   /api/events/:id/register
DELETE /api/events/:id/register
```

### Favoritos
```
POST   /api/events/:id/favorite
DELETE /api/events/:id/favorite
```

### Notificaciones
```
GET    /api/users/me/notifications
PATCH  /api/notifications/:id/read
```

## Decisiones de diseño relevantes

- **Borrado lógico** en Usuarios, Categorías, Eventos e Inscripciones (`isActive`/`status`, nunca se elimina el documento) para preservar la integridad referencial y el historial.
- **Ownership**: un organizador nunca puede modificar, eliminar o ver participantes de actividades de otro organizador.
- **`checkExact`** en los endpoints de edición: rechaza cualquier campo del body que no esté explícitamente permitido.
- **Guarda de auto-protección**: un administrador no puede quitarse el rol admin ni desactivarse a sí mismo si es el único administrador activo del sistema.

## Notificaciones y función Lambda

Este backend expone los endpoints que consumen las notificaciones generadas de forma automática (`GET /api/users/me/notifications`, `PATCH /api/notifications/:id/read`), pero la función serverless que las genera (recordatorios de eventos próximos, disparada periódicamente vía AWS EventBridge) vive en un **repositorio independiente**, no en este. Esa función escribe directamente en la misma base de datos (`MONGODB_URI` compartido), por lo que las notificaciones que aparecen acá reflejan lo que esa Lambda haya generado.

## Seguridad

- Contraseñas siempre hasheadas con bcrypt, nunca en texto plano.
- Autenticación stateless vía JWT.
- Middleware de autenticación (`protect`) y autorización por rol (`authorizeRoles`) en cada endpoint que lo requiere.
- CORS configurado con origen explícito.
- Manejo global de errores: nunca se exponen errores internos de MongoDB al cliente.
- Variables sensibles fuera del repositorio (`.env` en `.gitignore`, se provee `.env.example`).
