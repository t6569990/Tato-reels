# Tato Reels — auditoría de separación PC / celular y publicación

Rama de integración de trabajo: `work/device-separation-reconciled`
Rama de referencia previa: `work/device-separation`
Base de integración: `main` en `90077e745d68d45f5288b43dfced389bac5f26c2`

## Estado del código comprobado

- `public/index.html` es un selector de dispositivo que redirige a `mobile.html` o `pc.html`, conservando query y hash.
- `public/pc.html` existe y usa `body.device-desktop` y `/device-pc.css`.
- `public/mobile.html` existe y usa `body.device-mobile` y `/device-mobile.css`.
- Ambas páginas conservan tres bloques de JavaScript y 18 bloques de estilo inline.
- Los tres bloques de estilo que estaban fuera del documento se reubicaron dentro del body.
- La regla `tato-mobile-tool-size-fix` se extrajo a la hoja móvil; no permanece en el HTML de PC.
- La capa PC contiene el ajuste de acciones inferiores para que dejen de ser una barra fija y permanezcan dentro del editor.
- El selector `.creator>.editor-bottom-actions` sí corresponde al montaje del DOM: el JavaScript crea el contenedor y ejecuta `creator.append(bottomActions)`.
- No se alteraron los scripts de autenticación, guardado, audio, exportación ni publicación en esta fase.
- Se creó esta rama reconciliada desde `main` y se aplicaron sobre ella las últimas versiones comprobadas de PC, móvil, las dos hojas CSS y esta auditoría. La rama anterior se conserva intacta.

## Hallazgos de CSS

- Las páginas siguen compartiendo la mayor parte del CSS base. La separación actual es por páginas y capas adicionales, no una extracción completa de todos los estilos.
- El CSS acumulado tiene reglas mixtas y media queries que afectan más de un dispositivo.
- Los bloques de acciones inferiores y de distribución del espacio de trabajo dependen del orden de cascada. No deben moverse completos sin clasificar selectores y breakpoints.
- La separación visual final de PC queda pendiente de las instrucciones de acomodo del usuario.

## Diagnóstico de publicación y error 404

Configuración versionada en el repositorio:

```toml
main = "backend/worker.js"

[assets]
directory = "./public"
binding = "ASSETS"
run_worker_first = ["/api/*"]
```

- El Worker entrega las rutas que no empiezan por `/api/` a `env.ASSETS.fetch(request)`.
- Los archivos `public/pc.html`, `public/mobile.html` y `public/index.html` existen en `main` y en la rama reconciliada.
- Por tanto, un 404 tanto en `/pc` como en `/pc.html` no se explica por la ausencia del archivo en GitHub ni por el CSS PC. Apunta a una diferencia entre el código/configuración del repositorio y el despliegue activo, o a que el Worker publicado no tiene enlazados los assets esperados.
- El historial visible de GitHub Actions muestra dos ejecuciones de publicación, ambas fallidas, del 3 de noviembre de 2026. No aparece una ejecución posterior en ese historial consultado.
- No hay acceso de administración a Cloudflare desde esta sesión. No se puede verificar el despliegue activo, sus bindings ni el resultado de una publicación real desde GitHub.

## Riesgos y límites

1. No sobrescribir `main`, la rama de respaldo ni los datos D1 para resolver el 404.
2. No cambiar el Worker ni los bindings de producción sin verificar primero la configuración activa de Cloudflare.
3. No extraer reglas mixtas de CSS en bloque.
4. No tocar autenticación, guardado, música o exportación durante el ajuste visual.
5. No afirmar que una publicación funcionó hasta probar las rutas públicas.

## Próximos pasos seguros

1. Revisar en Cloudflare el Worker activo, el último despliegue y la configuración de assets.
2. Automatizar la publicación solo después de identificar el flujo activo y corregir su causa de fallo; evitar dos sistemas de despliegue compitiendo.
3. Validar `/`, `/pc.html`, `/mobile.html`, los CSS y las rutas `/api/*` después de publicar.
4. Continuar el diseño PC con las instrucciones visuales del usuario, sin modificar la experiencia móvil.
5. Después de aprobar ambas interfaces, evaluar la extracción del motor compartido.

## Validaciones estructurales registradas

- PC: `body.device-desktop`, hoja `/device-pc.css`, tres scripts, 18 bloques de estilo inline.
- Celular: `body.device-mobile`, hoja `/device-mobile.css`, tres scripts, 18 bloques de estilo inline.
- El bloque de tamaño de herramientas móvil está solo en `device-mobile.css`.
- El override PC de acciones inferiores tiene mayor especificidad que la regla fija compartida y corresponde a un contenedor añadido como hijo directo de `.creator`.
- No se ha realizado una prueba visual automatizada en navegador ni una comprobación real del despliegue Cloudflare. Esas verificaciones quedan expresamente pendientes.
