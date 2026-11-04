# Tato Reels · activar cuentas reales

El backend está preparado en `backend/worker.js` y el esquema SQL en `backend/schema.sql`. **Todavía no está conectado al Worker público**: falta crear D1 y añadir sus secretos/bindings en Cloudflare. No activar el frontend contra esta API hasta completar estos pasos.

## 1. Crear la base D1
En Cloudflare Dashboard → Workers & Pages → D1 SQL Database → Create database.
Nombre sugerido: `tato-reels-db`.
Abre la base → Console y ejecuta el contenido completo de `backend/schema.sql`.

## 2. Preparar el Worker
En el proyecto Worker que sirve `https://tato-reels.t6569990.workers.dev`, configura el código principal para usar `backend/worker.js` y agrega un binding D1:
- Variable de binding: `DB`
- Database: `tato-reels-db`

Conserva el servicio de archivos estáticos actual y enlázalo como binding `ASSETS` para que las rutas que no empiezan por `/api/` sigan sirviendo la aplicación.

## 3. Variables y secretos
Configura estas variables en Worker → Settings → Variables and Secrets:
- `APP_URL`: `https://tato-reels.t6569990.workers.dev`
- `EMAIL_FROM`: remitente de un dominio verificado en Resend, por ejemplo `Tato Reels <cuentas@tudominio.com>`
- `ADMIN_EMAIL`: correo que tendrá acceso a las estadísticas.

Como secretos (no variables de texto plano):
- `RESEND_API_KEY`: API key de Resend.
- `TURNSTILE_SECRET`: secreto del widget Turnstile (opcional hasta registrar el sitio).

Registra el dominio de la app en Cloudflare Turnstile y conserva la Site Key para mostrar el widget en el formulario. La API valida el token cuando `TURNSTILE_SECRET` está configurado.

## 4. Endpoints disponibles
- `POST /api/register` — crea usuario y sesión.
- `POST /api/login` — inicia sesión con usuario o correo.
- `POST /api/logout` — cierra sesión.
- `GET /api/me` — consulta la sesión actual.
- `POST /api/forgot-password` — envía enlace de recuperación al correo.
- `POST /api/reset-password` — consume el enlace de un solo uso.
- `GET /api/admin/stats` — estadísticas básicas, restringidas a `ADMIN_EMAIL`.

Las contraseñas se derivan con PBKDF2-SHA-256; las sesiones y los tokens de recuperación se almacenan como hashes. Los enlaces de recuperación vencen en 20 minutos y cierran las sesiones existentes al cambiar la contraseña.

## 5. Antes de abrir el registro
1. Verifica que el Worker tenga D1 y ASSETS enlazados.
2. Configura y prueba Resend con un dominio remitente verificado.
3. Configura Turnstile y añade su Site Key al frontend.
4. Prueba registro, cierre, inicio y recuperación con un correo de prueba.
5. Solo entonces sustituye el acceso local del HTML por las llamadas a esta API.

**Importante:** no pegues claves API ni contraseñas en el repositorio o en el chat. Añádelas únicamente como secretos en Cloudflare.
