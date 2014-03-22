NODEYAG
======================

### Descripción

NODEYAG es la aplicación REST API que brinda servicios al proyecto de aplicación móvil con nombre de proyecto YAG. La aplicación brinda información sobre establecimientos y sitios de interés turísticos.

### Dependencias

- Express 3.x
- Mongoose 3.x
- mongoose-dbref
- bcrypt 0.7.x
- express-jwt 0.2.x

### Instalación

- Agregar express y mongoose al archivo `package.json` y ejecutar el comando `npm install` para que se instalen las librerías.
- Ejecutar el comando `npm install mongoose-dbref` para añadir el plugin para mongoose

### Rutas
### Sin autenticación
- /authenticate    Necesaria para obtener un Token JWT que incluye el perfil del usuario
- /refresh-token   Necesaria para validar el token almacenado y obtener uno nuevo si las credenciales son correctas

### Con autenticación
Para poder acceder al API se debe enviar el request con un header Authorization: Bearer + token

- /api/cities
- /api/cities/:id
- /api/negocios
- /api/establecimientos/
- /api/establecimientos/near?lat=xxx&lon=xx
- /api/establecimientos/search?q=string
- /api/establecimientos/:id
