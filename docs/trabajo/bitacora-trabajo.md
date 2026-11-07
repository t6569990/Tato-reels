# Bitácora de trabajo y construcción empresarial

**Tato Technology Inc. — Archivo de proyecto y decisiones**  
**Fecha de consolidación:** 7 de noviembre de 2026  
**Tipo:** Trabajo, producto, estrategia y operación  
**Estado:** Documento vivo

> Esta bitácora resume el contexto de trabajo disponible. No es una transcripción literal ni sustituye los commits, respaldos, issues o documentación técnica del repositorio.

## 1. Visión de empresa

Tato Technology Inc. busca construir productos digitales útiles y sostenibles. Tato Reels Creator es el primer proyecto de aprendizaje y entrada al mercado: una herramienta para crear contenido, no una red social ni una plataforma para competir por la atención de los usuarios.

La intención es aprender a desarrollar, probar, distribuir, mantener y monetizar productos digitales, dejando procesos reutilizables para proyectos futuros.

## 2. Tato Reels Creator: propósito

La aplicación debe ayudar a personas que quieren crear reels y contenido audiovisual, especialmente a quienes no tienen conocimientos avanzados de edición o herramientas profesionales.

La propuesta de valor es facilitar la creación. No se debe prometer que el usuario se convertirá en influencer ni que ganará dinero. Se le deben ofrecer herramientas reales para que desarrolle sus proyectos y pueda buscar oportunidades de monetización por su cuenta.

**Principio de producto:** utilidad, facilidad de uso y recurrencia antes que acumular funciones.

## 3. Modelo de negocio y beneficio compartido

La industria de aplicaciones y publicidad representa un mercado amplio, pero Tato Technology debe construir su negocio con métricas y expectativas realistas.

La visión de beneficio compartido:
- **Creadores:** reciben herramientas para producir y desarrollar sus proyectos.
- **Audiencias:** pueden disfrutar del contenido que esos creadores elaboran.
- **Anunciantes:** pueden encontrar espacios adecuados para comunicar sus productos o servicios.
- **Tato Technology:** obtiene ingresos para sostener, mejorar y distribuir sus productos.
- **Plataformas de distribución y contenido:** reciben contenido que alimenta sus ecosistemas.

La publicidad debe integrarse sin destruir la experiencia de uso. No se trata de fomentar adicción digital, sino de ofrecer una herramienta que convierta parte del tiempo de pantalla en creación.

## 4. Métricas de negocio

No confundir descargas, reproducciones o cantidad de archivos creados con un negocio saludable. Medir, cuando existan datos:
- usuarios activos;
- retención y frecuencia de regreso;
- reels o proyectos creados;
- impresiones y rendimiento de anuncios;
- ingresos publicitarios;
- costos de infraestructura y operación;
- costo de adquisición de usuarios;
- margen y sostenibilidad.

## 5. Frentes de trabajo pendientes

1. **Terminar el producto:** cerrar ajustes visuales y funcionales, probar los flujos y corregir errores.
2. **Proteger el proyecto y la empresa:** revisar titularidad del código, repositorios, accesos, respaldos, marca, derechos de autor y documentación legal con los profesionales u organismos correspondientes.
3. **Integrar publicidad:** seleccionar una red apropiada, revisar requisitos y políticas, implementar anuncios y medir resultados.
4. **Distribuir:** preparar la publicación web, evaluar conversión a APK y definir canales de distribución y promoción.
5. **Tutorial y marketing:** cuando la interfaz esté estable, grabar un tutorial desde la PC que muestre el proceso completo y el resultado final. Reutilizarlo en canales sociales.

## 6. Forma de trabajo y control de cambios

La colaboración se basa en revisión a cuatro ojos:
- la dirección humana define prioridades, observa el producto, prueba y decide;
- la asistencia de IA apoya con investigación, análisis, programación, documentación y revisión;
- los cambios deben ser pequeños, verificables y documentados;
- antes de cambios importantes, crear o confirmar un respaldo;
- después de modificar código, comprobar el resultado en GitHub;
- verificar el despliegue en Cloudflare por separado: un commit en GitHub no demuestra que ya esté desplegado;
- no declarar una función terminada hasta probarla.

### Flujo técnico habitual

1. Obtener las versiones actuales de `index.html` y `public/index.html`.
2. Comparar su contenido antes de editar.
3. Aplicar un cambio específico y acotado.
4. Actualizar ambos archivos de manera secuencial con sus SHA vigentes.
5. Volver a obtenerlos y comprobar que sean idénticos y que incluyan el cambio esperado.
6. Verificar el despliegue de Cloudflare por separado.

## 7. Estado y decisiones de interfaz conocidas

- El enfoque de revisión actual es la vista de PC como referencia visual.
- No dividir ni rediseñar por separado las interfaces de PC y móvil sin una decisión expresa.
- Los controles independientes para agregar video/fotos y abrir el visualizador se ubicaron encima de la sección de edición.
- La tarjeta de recorte permanece separada debajo de la barra de herramientas.
- Los modos de creación (solo video, solo fotos e híbrido) se organizaron como tarjetas independientes, conservando identificadores y listeners.
- El contenedor «ELIGE CÓMO CREAR TU REEL» necesitó un selector CSS que contemplara que JavaScript mueve el panel a `.editor-tool-pane[data-pane="video"]`.
- El último ajuste de ancho se registró en los archivos principales; el despliegue de Cloudflare de ese ajuste requiere verificación independiente.
- Después de cerrar PC, revisar la sección Música en móvil y preparar el APK según corresponda.

## 8. Visión N360 aplicada al trabajo

N360 es una filosofía operativa: cada integrante debe conocer las funciones esenciales de los demás para cubrir ausencias, reducir dependencias de personas clave y mantener la continuidad de la operación.

Aplicación en Tato Technology:
- documentar procedimientos esenciales;
- compartir conocimiento entre funciones;
- mantener respaldos y accesos adecuados;
- crear procesos reproducibles;
- evitar puntos únicos de fallo;
- preparar a la organización para crecer sin depender de una sola persona.

## 9. Frases de dirección y cultura

- «Una empresa fuerte no es aquella que nunca pierde a un integrante; es aquella que puede seguir funcionando cuando alguno falta».
- «No queremos venderles el sueño de ser influencers; queremos darles herramientas para que tengan una oportunidad real de construirlo».
- «No queremos competir por la atención: queremos proporcionar herramientas a quienes crean contenido».
- «Todos tienen oportunidad de ganar» como principio de beneficio compartido, sin confundir oportunidad con garantía de resultados.

## 10. Próximos proyectos y aprendizaje

Tato Reels Creator también funciona como campo de aprendizaje para el siguiente producto digital. Las lecciones técnicas, comerciales, operativas y de distribución deben documentarse para no empezar desde cero en el futuro.

Las ideas de nuevos productos deben describirse a partir de los requisitos reales del usuario y no asumir funciones antes de contar con su planteamiento.

## 11. Cómo mantener este documento

Registrar nuevas decisiones con fecha, motivo, alternativas consideradas, responsable, evidencia de prueba y estado. Los detalles técnicos concretos deben permanecer también en commits, issues, respaldos y documentación específica.
