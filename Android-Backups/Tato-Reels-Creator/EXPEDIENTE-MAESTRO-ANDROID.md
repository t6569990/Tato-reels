# Expediente maestro Android — Tato Reels Creator

**Empresa:** Tato Technology Inc.  
**Producto:** Tato Reels Creator  
**Paquete Android (applicationId):** `com.tatotechnology.tatoreelscreator`  
**Proyecto local conocido:** `C:\\Users\\USER 007\\AndroidStudioProjects\\tatoreelscreatorv10`

## Identidad y firma

- **Keystore de producción:** `tato-reels-release.jks`
- **Ubicación local reportada:** `C:\\Users\\USER 007\\Documents\\TatoReelsSigning\\tato-reels-release.jks`
- **Tipo:** JKS
- **Alias:** `tato-reels-release`
- **Entrada:** PrivateKeyEntry
- **SHA-256 del certificado:** `8D:B3:C5:E9:7E:C2:F3:09:83:60:74:D2:D7:70:19:C0:90:8E:EE:07:D9:CB:19:86:27:F2:32:51:63:B9:A2:77`
- **Estado reportado en Android Developer Console:** Registrado y verificado.

> Seguridad: este documento no contiene contraseñas ni claves privadas. No subir el archivo JKS/keystore, sus contraseñas, tokens ni secretos a GitHub. Mantener al menos dos copias cifradas y separadas del archivo de firma.

## Estado comprobado

- El paquete `com.tatotechnology.tatoreelscreator` fue registrado en Android Developer Console.
- El certificado SHA-256 del JKS fue leído correctamente con `keytool` usando el tipo JKS y coincide con la huella reportada como verificada.
- La carpeta de respaldo existe en el repositorio GitHub `t6569990/Tato-reels`.
- La conexión autorizada de GitHub respondió correctamente al consultar este expediente/README después de que el usuario habilitó 2FA.
- La carpeta contiene su README de seguridad y este expediente maestro.

## Pendiente para completar el respaldo y publicación

1. Generar o localizar el APK/AAB firmado de la versión candidata.
2. Confirmar versión `versionCode` y `versionName` del artefacto.
3. Configurar y verificar la firma `release` de Gradle sin exponer contraseñas.
4. Verificar el AAB/APK con las herramientas de Android y comprobar que usa el paquete correcto.
5. Completar la ficha de Google Play Console, pruebas requeridas y publicación.
6. Registrar por separado el certificado de firma de aplicación de Google Play si Play App Signing está habilitado; puede ser distinto del certificado de carga.

## Regla de respaldo

Guardar aquí APK/AAB y documentación no secreta, identificados por versión y fecha. Mantener el JKS y las contraseñas fuera del repositorio, en almacenamiento cifrado y respaldos privados.
