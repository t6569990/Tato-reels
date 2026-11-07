# Tato Reels — auditoría de separación PC / celular

Rama de trabajo: `work/device-separation`

## Estado verificado

- `public/index.html` funciona como selector de dispositivo.
- `public/pc.html` y `public/mobile.html` existen y cargan hojas CSS propias.
- PC usa `body.device-desktop` y `/device-pc.css`.
- Celular usa `body.device-mobile` y `/device-mobile.css`.
- Las dos páginas conservan tres bloques de JavaScript y el mismo contenido funcional.
- Se corrigió la ubicación de tres bloques `<style>` que estaban después de `</html>`; ahora están dentro de `<body>`, antes de `</body>`.
- No se encontraron IDs HTML duplicados ni llaves CSS desbalanceadas en la última inspección.
- No se ha publicado esta rama en Cloudflare ni se ha integrado a `main`.

## Hallazgos CSS

- Cada página contiene 19 bloques `<style>`; los 19 bloques son iguales entre PC y celular.
- El primer bloque concentra aproximadamente 64.8 KB de CSS y 41 media queries.
- Hay 66 media queries en total entre todos los bloques.
- La mayoría de los breakpoints son móviles (`max-width: 720px`, 560px, 390px, 380px y 360px).
- Algunos bloques añadidos para resolver detalles del móvil también contienen reglas globales o reglas de escritorio. Por eso no se deben mover completos a una hoja móvil sin separar primero sus reglas.
- Los bloques posteriores contienen correcciones acumuladas que dependen del orden de carga. Mantener ese orden es obligatorio durante la extracción.

## Riesgos que deben evitarse

1. No borrar ni reescribir reglas existentes en bloque.
2. No mover un bloque entero a CSS móvil si contiene selectores fuera de media queries o breakpoints de escritorio.
3. No cambiar HTML, IDs, listeners ni funciones JavaScript durante la separación visual.
4. No tocar autenticación, guardado de reels, audio, base de datos ni Worker en esta etapa.
5. No publicar ni fusionar a `main` hasta validar ambas interfaces.

## Secuencia segura de trabajo

1. Mantener el CSS actual intacto como referencia funcional.
2. Clasificar reglas por selector y breakpoint: base compartida, PC, celular y reglas mixtas.
3. Preparar primero overrides PC aislados bajo `body.device-desktop`, sin alterar el resultado móvil.
4. Extraer reglas móviles solo cuando su alcance y orden de cascada estén comprobados.
5. Validar diferencias entre PC y celular y comprobar que el JavaScript permanece idéntico.
6. Esperar las instrucciones de distribución visual del usuario antes de definir el diseño final de PC.
7. Después de aprobar las interfaces, abordar la extracción del motor compartido.

## Criterio de finalización de esta fase

La preparación estará lista cuando PC y celular tengan capas de estilos independientes y comprobables, sin cambios involuntarios en la versión móvil, y PC esté lista para recibir las instrucciones de diseño del usuario. La existencia de dos HTML y dos archivos CSS, por sí sola, no significa que la separación visual esté terminada.

## Primera extracción completada

- Se trasladó el bloque `tato-mobile-tool-size-fix` (2,261 caracteres) desde ambos HTML a `public/device-mobile.css`.
- El bloque conserva su posición de cascada: la hoja móvil se carga en el encabezado después del CSS base y antes de los bloques de estilos posteriores.
- Se comprobó que el bloque ya no aparece inline en PC ni en celular, sí aparece en la hoja móvil y no aparece en la hoja PC.
- Ambas páginas conservan tres bloques de JavaScript, 18 bloques de estilo inline y no tienen estilos fuera de `</html>`.
- La estructura HTML de ambas páginas continúa equivalente salvo la clase del body y la hoja CSS específica del dispositivo.
