# Revisión de seguridad del prototipo — Tato Reels

Fecha de revisión: 2026-11-05  
Rama: `feature/text-customization`

## Alcance

Revisión estática de `index.html` y recursos del repositorio. No equivale a una auditoría de penetración, análisis de dependencias, revisión de configuración de Cloudflare ni pruebas en navegador/Android. No se han inspeccionado registros del proveedor de hosting ni tráfico real de red.

## Corrección aplicada en esta revisión

- La ventana de exportación ya no concatena el nombre del archivo dentro de `innerHTML`.
- El nombre se añade mediante `textContent`, evitando que un nombre de archivo manipulado se interprete como marcado HTML.
- Se verificó el cambio en el archivo de la rama.

## Hallazgos que bloquean el uso con cuentas o recompensas reales

### Crítico — Contraseña de cuenta local en texto legible

El prototipo conserva `user`, `pass` y `recoveryCode` en `localStorage` bajo `tatoReelsLocalAccount`. La recuperación compara el código local y reemplaza la contraseña en el mismo almacenamiento.

Riesgo: cualquier persona o script con acceso al almacenamiento de ese navegador podría leer o modificar esos datos. El código de recuperación no es una recuperación por correo ni una verificación remota.

Medida antes de producción:
- No utilizar contraseñas reales ni reutilizadas.
- Implementar autenticación del lado servidor, almacenamiento de contraseñas con hash robusto y sal mediante una biblioteca mantenida, protección contra intentos repetidos, sesiones seguras y recuperación por correo con token de un solo uso y expiración.
- No presentar la cuenta local actual como una cuenta segura o sincronizada.

### Alto — Monedas y premios controlados por el navegador

El saldo, las tiradas y el inventario de stickers se almacenan en `localStorage`. Las funciones locales pueden ser modificadas por el usuario desde las herramientas del navegador o alterando el reloj del dispositivo.

Medida antes de producción:
- Mantener las monedas como elementos virtuales de prueba, sin valor monetario ni canje externo.
- Si se implementan premios externos, validar saldo, límites, tiempos y transacciones en un servidor; registrar eventos idempotentes y no confiar en valores enviados por el cliente.

### Alto — Privacidad y datos técnicos del alojamiento

La revisión previa del HTML no encontró llamadas explícitas a `fetch`, `XMLHttpRequest` ni `sendBeacon` en ese archivo. Esto no demuestra ausencia de comunicaciones: el proveedor de hosting, CDN, recursos externos, configuración, registros o futuras integraciones pueden procesar datos técnicos.

Medida antes de producción:
- Revisar configuración de Cloudflare, analítica, registros, cookies, recursos de terceros y dependencias.
- Publicar un aviso de privacidad fiel al tratamiento real, contacto y mecanismo de reporte.
- No afirmar que no se procesa ningún dato técnico.

## Almacenamiento y contenido del usuario

- Borradores básicos, preferencias, referencias, cuenta local y recompensas utilizan almacenamiento del navegador.
- Videos importados a la biblioteca de inspiración se guardan como Blob en IndexedDB local.
- Esto no equivale a una carpeta visible elegida por el usuario ni implica sincronización entre dispositivos.
- La exportación utiliza el selector de guardado cuando el navegador lo soporta; de lo contrario, depende del mecanismo de descarga del navegador.
- Al compartir o publicar en servicios externos, esos servicios pueden recibir y almacenar el contenido conforme a sus propias políticas.
- Antes de afirmar que ningún contenido sale del dispositivo, deben verificarse red, recursos externos y configuración de infraestructura.

## Funciones externas

- Los botones de redes abren sitios o aplicaciones; no constituyen publicación automática.
- No solicitar contraseñas de redes sociales dentro de Tato Reels.
- La publicación directa requiere integraciones oficiales, OAuth, permisos y revisión aplicable.

## Pruebas manuales pendientes

- Crear/iniciar/cerrar sesión, recuperación, recarga y cambio de dispositivo.
- Guardar y compartir archivos en Android Chrome y escritorio.
- Exportar clip y Reel completo con/sin música, verificar duración, audio, sincronía y reproducción.
- Importar, abrir, eliminar y volver a utilizar videos de IndexedDB.
- Comprobar errores de cuota/espacio, permisos y cancelación del selector de archivos.
- Revisar teclado, foco, lectores de pantalla, contraste y tamaño de texto.
- Revisar consola, solicitudes de red, cookies y almacenamiento del navegador.
- Confirmar que publicidad no cubre ni interrumpe edición, línea de tiempo, importación, guardado o exportación.

## Regla de preservación

La sección **Línea de tiempo** queda congelada: no cambiar su texto, estructura ni controles sin una autorización específica posterior. No se realizaron cambios en esa sección durante esta revisión.

## Estado de publicación

Este documento y las correcciones indicadas pertenecen a la rama de trabajo. No se ha hecho merge a `main` ni despliegue en Cloudflare. La revisión fue estática; no se afirma que la aplicación haya superado pruebas funcionales o de seguridad.

## Comprobaciones estáticas adicionales — 2026-11-05

- Se revisaron los identificadores del HTML: 133 identificadores, todos únicos; no se encontraron IDs duplicados.
- Se contrastaron las referencias realizadas mediante el helper de búsqueda por ID (`$('...')`) con el marcado: no se encontraron referencias sin elemento correspondiente.
- Las asignaciones detectadas a `innerHTML` revisadas en esta pasada usan estructuras estáticas o contenido añadido por nodos y `textContent`; no se identificó una nueva interpolación de nombre de archivo o URL en esas asignaciones.
- El manifiesto `manifest.webmanifest` se pudo interpretar como JSON válido.
- Los dos recursos SVG de identidad tienen raíz SVG y no contienen etiquetas `script` ni `foreignObject`, ni referencias `href` HTTP(S) externas en el texto revisado.

Estas comprobaciones son estáticas y acotadas al contenido de los archivos consultados. No validan ejecución, compatibilidad de renderizado, comportamiento de lectores de pantalla, recursos servidos por el hosting ni seguridad integral del navegador.


## Revisión adicional del flujo de exportación — 2026-11-05

- Se revisó estáticamente el flujo de exportación del Reel completo (canvas, MediaRecorder, pistas de audio y clips temporales).
- Se detectó que, si la exportación fallaba a mitad del proceso, el clip de video temporal y las pistas de captura podían quedar sin una limpieza explícita.
- Se actualizó el bloque `finally` para pausar y liberar el video temporal activo, detener las pistas del flujo combinado y del canvas, pausar la música y cerrar el AudioContext.
- Se verificó en GitHub que las nuevas referencias y la limpieza quedaron guardadas en la rama de trabajo.
- Se comparó el bloque de `renderTimeline()` antes y después del cambio: permanece idéntico.

La corrección reduce el riesgo de dejar recursos multimedia activos después de una exportación fallida, pero no demuestra por sí sola que la exportación funcione en todos los navegadores. Sigue pendiente la prueba funcional en Android y escritorio, con videos de distintas duraciones y con/sin música.
