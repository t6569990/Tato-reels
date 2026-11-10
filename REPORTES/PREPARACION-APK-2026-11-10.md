# Preparación APK — 10 noviembre 2026

## Fuente móvil seleccionada
- Rama: `preparacion-app-movil`
- Fuente: `public/pc.html`
- SHA de la fuente: `786987eef2ee05cf3f28d5693edb42a0901465be`
- `public/mobile.html` se sincronizó byte por byte con `public/pc.html` para evitar mezclar la interfaz móvil antigua con controles incompletos.

## Respaldo
- Versión móvil anterior preservada en `public/mobile-legacy-2026-11-10.html`.
- Captura HTML descargada de Cloudflare preservada en la raíz como `Tato Reels Creator.html`; no se usó como fuente de compilación porque sus referencias locales apuntan a una carpeta de recursos no incluida y su contenido difiere de `public/pc.html`.

## Recursos
- Icono y logotipo están disponibles en `public/assets/`.
- El script Android copia `public/mobile.html` a `dist/index.html` y copia los recursos públicos.

## Protección y alcance
- No se modificó `main`, Cloudflare, D1/base de datos ni datos de usuario.
- La sección Línea de tiempo se conserva desde la fuente PC seleccionada.
- No se integraron anuncios.
- La APK todavía requiere compilación y pruebas reales en dispositivo; la sincronización de fuentes no equivale a aprobación funcional.

## Automatización
- El workflow Android ahora también se activa con cambios en `preparacion-app-movil`, además de `main`.
