# Revisión global del repositorio — 2026-11-10

## Bases preservadas
- Web principal observada en `main` antes de esta revisión: `6e465f2db852e1c80f8f37c7d9ea285475797152`.
- Punto de recuperación creado: `checkpoint/2026-11-10-web-main`.
- APK #55: compilación Release firmada desde `build/apk-55-from-current-web`, commit `2ecaf4cf5f32bf5ad3f0f0e51f4a1dae3fb683d4`.
- Punto de recuperación creado: `checkpoint/2026-11-10-apk-55-release`.
- La compilación #55 terminó correctamente en GitHub Actions, ejecución `42738560478`.

## Hallazgo crítico de sincronización
La rama principal y la rama de APK #55 no son idénticas: el historial está divergido (main tiene 8 commits que la rama APK no tiene y la rama APK tiene 16 que main no tiene). Los archivos móviles también difieren:
- `main/public/mobile.html`: blob `1cd55bba5fe30c321210374c34cfed46c58e98f2`.
- `build/apk-55-from-current-web/public/mobile.html`: blob `fef0c1525079515bc404e66836a640a435c7803c`.
Por ello, APK #55 queda preservada como referencia de prueba, pero no debe asumirse que contiene exactamente el mismo código que la web principal actual. La ejecución `42739509558` está compilando Release desde `main` para producir una referencia alineada con esa rama; revisar el resultado antes de distribuirlo.

## Archivos y duplicados
- `Tato Reels.html` y `public/Tato Reels.html` tienen el mismo blob. Son duplicados exactos.
- `backend/schema.sql` y `backend/migrations/0001_init.sql` tienen el mismo blob. El primero sirve como referencia; el segundo es la migración.
- Los iconos/logos de `assets/` y `public/assets/` también aparecen duplicados en el árbol.
- `wrangler.toml` publica `./public`; por eso el `index.html` de la raíz no es el punto de entrada de los assets del Worker. Se conserva por precaución.
- `public/index.html` redirige a `mobile.html` o `pc.html`; se conserva.
- No se encontró un archivo de service worker ni referencias a `navigator.serviceWorker`/Cache API en las páginas inspeccionadas.
- No hay carpeta Android generada en el repositorio; el proyecto Android se genera durante la compilación Capacitor.

## Pendientes detectados — no modificados
1. La página móvil de `main` y la fuente usada por APK #55 todavía contienen `showFeedbackSurvey`, `promptFeedbackAfterExport` y `tatoFeedbackPending`. Esto parece contradecir la instrucción previa de trabajar sin encuesta. No se tocó porque se pidió conservar la web como está.
2. El Worker conserva rutas antiguas de registro/inicio de sesión/restablecimiento por correo y contraseña (`/api/register`, `/api/login`, `/api/forgot-password`, `/api/reset-password`). La interfaz móvil inspeccionada no contiene un campo `loginPassword`, pero no se modificaron backend, D1 ni configuración Cloudflare.
3. Los manifiestos PWA siguen mostrando el nombre corto `Tato Reels`, mientras que Capacitor usa `Tato Reels Creator`. No se cambió el nombre de la web.
4. No hay `package-lock.json`; `npm install` resuelve dependencias compatibles cada vez. Conviene fijar versiones en una tarea posterior para reproducibilidad.

## Ramas
Se encontraron 113 ramas en dos páginas de listado: 53 `backup/*`, 27 `fix/*`, 13 `feature/*`, además de ramas `restore/*`, `work/*`, `feat/*`, y checkpoints. Hay varios nombres distintos apuntando al mismo SHA. No se borró ninguna rama: algunas pueden conservar soluciones o respaldos únicos. Los checkpoints nuevos preservan las dos bases importantes.

## Cambios realizados en esta revisión
- Se crearon los dos checkpoints anteriores.
- Se actualizó únicamente `.github/workflows/build-android-apk.yml` en `main` para generar APK Release firmada en futuras actualizaciones.
- No se modificaron `public/mobile.html`, `public/pc.html`, `index.html`, backend, migraciones, D1 ni configuración Cloudflare.
- No se borraron archivos ni ramas.
