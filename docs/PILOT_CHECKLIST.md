# Tato Reels — revisión y lista de verificación de prueba piloto

Fecha de revisión: 2026-11-05  
Rama: `feature/text-customization`  
Archivo principal revisado: `index.html`

Este documento registra una revisión estática del código y las pruebas que todavía deben realizarse en un navegador real. **No equivale a una certificación de seguridad, auditoría legal ni prueba funcional.**

## 1. Estado observado en el código

- [x] Existe el editor principal en `index.html`.
- [x] Existe el manifiesto `manifest.webmanifest` y referencia al icono SVG de Tato Reels.
- [x] Existe una ventana independiente de Ajustes con apartados de cuenta, almacenamiento, accesibilidad, idioma, privacidad, ayuda, comunidad y acerca de.
- [x] Existe el apartado de avisos legales.
- [x] Se identificó almacenamiento local mediante `localStorage` e `IndexedDB`.
- [x] La Línea de tiempo conserva su sección y controles; el organizador de pestañas excluye el panel de timeline.
- [x] La interfaz explica que la cuenta piloto es local, no se sincroniza entre dispositivos y la recuperación depende de un código local.
- [x] El aviso de almacenamiento distingue los archivos audiovisuales del almacenamiento local de preferencias, referencias, recompensas y cuenta de prueba.
- [x] La revisión del HTML no encontró llamadas directas a `fetch()`, `XMLHttpRequest` ni `sendBeacon`.
- [ ] No se ha auditado la configuración, registros, analítica o tratamiento de datos del servicio de alojamiento.
- [ ] No se ha realizado una captura de tráfico de red ni una auditoría de dependencias externas.

## 2. Puntos que deben resolverse antes de una prueba pública

1. **Autenticación:** la cuenta piloto guarda la contraseña directamente en el almacenamiento local del navegador. No debe utilizarse una contraseña real o reutilizada. Antes de producción se necesita autenticación del lado servidor, almacenamiento seguro de contraseñas (hash robusto con sal), recuperación verificada y protección contra abuso.
2. **Recompensas:** el saldo, las tiradas y el inventario se guardan localmente y pueden modificarse desde el dispositivo. No representan dinero ni un saldo seguro. Antes de cualquier recompensa con valor externo se necesitaría validación del servidor y reglas publicadas.
3. **Privacidad:** revisar el proveedor de alojamiento, sus registros, cookies, telemetría y cualquier servicio de terceros; publicar datos de contacto y un aviso de privacidad completo y correcto.
4. **Publicación social:** los accesos actuales abren plataformas externas; no deben describirse como publicación automática ni como cuentas conectadas.
5. **Almacenamiento:** confirmar en cada navegador dónde se descargan los videos exportados. `localStorage` e `IndexedDB` no son carpetas visibles ni una copia de seguridad.
6. **Compatibilidad:** comprobar manifiesto, icono, instalación y comportamiento en Android y escritorio.
7. **Derechos y marca:** comprobar titularidad/licencias de cada recurso gráfico, tipografía, música, biblioteca y material de terceros. Revisar los avisos con asesoría jurídica antes de distribución amplia.

## 3. Pruebas manuales pendientes

### Acceso y cuenta
- [ ] Crear cuenta de prueba con una contraseña exclusiva.
- [ ] Cerrar y volver a abrir la app; verificar el acceso.
- [ ] Probar mostrar/ocultar contraseña.
- [ ] Probar recuperación con el código y documentar el flujo.
- [ ] Confirmar el comportamiento al borrar datos del navegador y al cambiar de dispositivo.

### Ajustes y avisos
- [ ] Abrir/cerrar Ajustes desde escritorio y móvil.
- [ ] Entrar en cada apartado y comprobar que el contenido corresponde al título.
- [ ] Probar texto grande y alto contraste.
- [ ] Abrir los avisos desde Ajustes.
- [ ] Comprobar teclado, foco, Escape y lector de pantalla básico.

### Editor y Línea de tiempo
- [ ] Cargar uno y varios videos.
- [ ] Probar selección, recorte, reordenamiento, duplicado y eliminación.
- [ ] Probar vista previa y restablecer recortes.
- [ ] Confirmar que guardar borrador, exportar clip y exportar Reel completo funcionan.
- [ ] Comparar audio original, música añadida, volumen, recortes y sincronización.
- [ ] Confirmar que el título y demás elementos previstos aparecen en la exportación.
- [ ] Verificar que la Línea de tiempo mantiene sus textos, controles y estructura originales.

### Explorar, comunidad y recompensas
- [ ] Guardar y eliminar una referencia.
- [ ] Importar un video local y usarlo en el editor.
- [ ] Cerrar y reabrir la app para comprobar la biblioteca local.
- [ ] Probar ruleta, límites diarios, saldo e inventario.
- [ ] Confirmar que no se otorgan monedas por exportaciones fallidas.
- [ ] Probar los enlaces de redes y compartir.

### Compatibilidad y publicación
- [ ] Probar en Chrome de escritorio.
- [ ] Probar en Android (Chrome).
- [ ] Probar tamaños de pantalla pequeños.
- [ ] Revisar errores de consola y permisos.
- [ ] Verificar que no se activa ninguna publicidad durante edición, importación, guardado o exportación.
- [ ] No desplegar ni fusionar a `main` hasta aprobar las pruebas y revisar los pendientes.

## 4. Regla de protección del proyecto

La sección **Línea de tiempo** debe permanecer sin cambios en texto, controles ni estructura. Cualquier mejora futura debe respetar esa condición.

## 5. Respaldo final

El respaldo maestro en USB se realizará al final del proyecto, después de aprobar la prueba piloto. Debe incluir el código y recursos, documentación, historial Git, instrucciones de recuperación y una copia separada de los datos locales que el usuario decida conservar. No incluir contraseñas, tokens ni claves en texto plano.
