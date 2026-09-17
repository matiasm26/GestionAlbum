# Gestión de álbumes y láminas

API REST para administrar colecciones de álbumes y láminas. Implementada con Node.js (ES Modules), Express, Prisma ORM, MySQL, Zod y Docker Compose.

## Tecnologías utilizadas

- Node.js
- Express
- Prisma ORM
- MySQL 8.4
- Zod
- Docker y Docker Compose

## Instalación

### Requisitos

- Node.js 20+
- Docker
- Docker Compose

### Configuración

Crear el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Instalar las dependencias:

```bash
npm install
```

Generar el cliente de Prisma:

```bash
npm run prisma:generate
```

Levantar MySQL mediante Docker Compose:

```bash
docker compose up -d
```

Aplicar las migraciones:

```bash
npm run prisma:deploy
```

Cargar los datos de demostración:

```bash
npm run seed
```

Iniciar la aplicación:

```bash
npm start
```

La API queda disponible en:

```text
http://localhost:3000
```

Para comprobar el estado del servidor:

```http
GET /health
```

Para desarrollo se puede utilizar:

```bash
npm run dev
```

El archivo `.env` contiene la configuración local y no se versiona en el repositorio. El proyecto incluye `.env.example` como referencia para configurar el entorno.

## Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
routes -> controllers -> services -> repositories -> Prisma -> MySQL
```

La responsabilidad de cada capa es la siguiente:

- **Routes:** definen los endpoints disponibles en la API.
- **Controllers:** reciben las solicitudes HTTP y generan las respuestas.
- **Services:** contienen la lógica de negocio y gestionan la auditoría.
- **Repositories:** encapsulan el acceso a los datos mediante Prisma ORM.
- **Prisma ORM:** realiza el mapeo entre las entidades de la aplicación y MySQL.
- **MySQL:** almacena persistentemente la información del sistema.

Esta estructura implementa el patrón Repository, evitando el acceso directo a Prisma desde controllers y services y manteniendo separada la lógica de negocio de la persistencia.

## Modelo de datos

### Album

Representa un álbum perteneciente a la colección.

Principales atributos:

- `id`
- `nombre`
- `descripcion` opcional
- `anio`
- `createdAt`
- `updatedAt`

Un álbum puede contener múltiples láminas.

### Lamina

Representa una lámina perteneciente a un álbum.

Principales atributos:

- `id`
- `numero`
- `nombre`
- `cantidad`
- `imagenUrl` opcional
- `albumId`
- `createdAt`
- `updatedAt`

El número de lámina es único dentro de cada álbum.

La propiedad `cantidad` permite determinar el estado de una lámina:

- `0`: lámina faltante.
- `1`: lámina obtenida.
- Mayor que `1`: lámina repetida.

### AuditLog

Registra las modificaciones realizadas sobre los datos del sistema.

Las principales acciones registradas son:

- `CREACION`
- `ACTUALIZACION`
- `ELIMINACION`

Cada registro almacena la entidad afectada, su identificador, información asociada a la operación y la fecha en que fue realizada. Esto permite mantener trazabilidad de los cambios efectuados sobre álbumes y láminas.

## Endpoints

Todos los endpoints, excepto `/health`, utilizan el prefijo `/api` y trabajan con JSON.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/albums` | Lista los álbumes con sus láminas |
| POST | `/albums` | Crea un álbum |
| GET | `/albums/:id` | Consulta un álbum |
| PATCH | `/albums/:id` | Actualiza un álbum |
| DELETE | `/albums/:id` | Elimina un álbum |
| GET | `/albums/:albumId/laminas` | Lista las láminas de un álbum |
| POST | `/albums/:albumId/laminas` | Crea una lámina |
| POST | `/albums/:albumId/laminas/bulk` | Realiza una carga múltiple de láminas |
| GET | `/albums/:albumId/laminas/missing` | Lista las láminas faltantes |
| GET | `/albums/:albumId/laminas/repeated` | Lista las láminas repetidas |
| GET | `/laminas/:id` | Consulta una lámina |
| PATCH | `/laminas/:id` | Actualiza una lámina |
| DELETE | `/laminas/:id` | Elimina una lámina |

## Ejemplos de Request y Response

### Crear un álbum

**Request**

```http
POST /api/albums
Content-Type: application/json
```

```json
{
  "nombre": "Mundial 2026",
  "descripcion": "Colección principal",
  "anio": 2026
}
```

**Response - 201 Created**

```json
{
  "id": 1,
  "nombre": "Mundial 2026",
  "descripcion": "Colección principal",
  "anio": 2026,
  "createdAt": "2026-09-17T12:00:00.000Z",
  "updatedAt": "2026-09-17T12:00:00.000Z"
}
```

### Crear una lámina

**Request**

```http
POST /api/albums/1/laminas
Content-Type: application/json
```

```json
{
  "numero": 20,
  "nombre": "Jugador destacado",
  "cantidad": 1,
  "imagenUrl": "https://example.com/lamina-20.jpg"
}
```

La propiedad `imagenUrl` es opcional.

### Carga múltiple de láminas

**Request**

```http
POST /api/albums/1/laminas/bulk
Content-Type: application/json
```

```json
{
  "laminas": [
    {
      "numero": 21,
      "nombre": "Lámina faltante",
      "cantidad": 0
    },
    {
      "numero": 22,
      "nombre": "Lámina obtenida",
      "cantidad": 1
    },
    {
      "numero": 23,
      "nombre": "Lámina repetida",
      "cantidad": 4
    }
  ]
}
```

**Response - 201 Created**

```json
{
  "count": 3
}
```

### Consultar láminas faltantes

```http
GET /api/albums/1/laminas/missing
```

Devuelve las láminas cuya propiedad `cantidad` es igual a `0`.

### Consultar láminas repetidas

```http
GET /api/albums/1/laminas/repeated
```

Devuelve las láminas cuya propiedad `cantidad` es mayor que `1`, permitiendo conocer además la cantidad disponible de cada lámina repetida.

### Actualizar una lámina

```http
PATCH /api/laminas/1
Content-Type: application/json
```

```json
{
  "cantidad": 3
}
```

La operación actualiza la cantidad de la lámina y permite que sea identificada como repetida.

## Validaciones y manejo de errores

Los datos recibidos por la API son validados mediante Zod antes de ejecutar la lógica de negocio.

Por ejemplo, intentar crear un álbum con un nombre vacío genera una respuesta:

```text
400 Bad Request
```

Los principales códigos utilizados por la API son:

| Código | Significado |
|---|---|
| `200` | Operación o consulta realizada correctamente |
| `201` | Recurso creado correctamente |
| `204` | Recurso eliminado correctamente |
| `400` | Datos de entrada inválidos |
| `404` | Recurso no encontrado |
| `409` | Conflicto de datos, por ejemplo un número de lámina duplicado |

Los errores de validación incluyen información en `details` para identificar los campos incorrectos.

## Auditoría

Las operaciones que modifican información generan registros en `AuditLog`.

Se auditan las operaciones de:

- Creación de álbumes.
- Actualización de álbumes.
- Eliminación de álbumes.
- Creación de láminas.
- Actualización de láminas.
- Eliminación de láminas.

De esta manera es posible consultar posteriormente qué acción fue realizada, sobre qué entidad y en qué momento.

## Pruebas de la API

Los endpoints fueron verificados mediante **Thunder Client**, comprobando:

- Health check de la API.
- CRUD de álbumes.
- CRUD de láminas.
- Creación de láminas con imagen opcional.
- Carga múltiple de láminas.
- Consulta de láminas faltantes.
- Consulta de láminas repetidas.
- Validaciones con datos incorrectos.
- Persistencia de los registros en MySQL.
- Registro de operaciones en `AuditLog`.

Adicionalmente, el proyecto incluye la colección:

```text
docs/gestion-album.postman_collection.json
```

Esta colección puede utilizarse como recurso adicional para probar los endpoints de la API mediante Postman.

## Base de datos

La migración inicial se encuentra en:

```text
prisma/migrations/20260917000000_init/migration.sql
```

Para aplicar las migraciones:

```bash
npm run prisma:deploy
```

Para cargar datos de demostración:

```bash
npm run seed
```

MySQL se ejecuta mediante Docker Compose y utiliza un volumen para mantener la persistencia de los datos.

Para comprobar el estado del contenedor:

```bash
docker compose ps
```

Para detener MySQL:

```bash
docker compose down
```

Los datos permanecen almacenados en el volumen `mysql_data`.

## Seguridad de configuración

El archivo `.env` no debe ser versionado debido a que contiene la configuración local de conexión a la base de datos.

El archivo `.gitignore` excluye:

```text
.env
.env.*
```

mientras que `.env.example` permanece disponible como plantilla para configurar el proyecto en otros entornos.