# Backend - EPMTPQ

Este proyecto corresponde al backend de una aplicación orientada a la gestión del sistema de transporte público de la ciudad de Quito, administrado por la Empresa Pública Metropolitana de Transporte de Pasajeros (EPMTPQ). Permite administrar corredores, rutas y paradas mediante roles definidos (superadministrador y administrador), ofreciendo endpoints seguros y funcionales.

---

## Despliegue

Puedes acceder al backend desplegado en la siguiente URL:  
🔗 [https://backend-epmtpq.vercel.app](https://backend-epmtpq.vercel.app)

---

## Manual de Usuario

Accede al video explicativo de las funcionalidades del sistema:  
🎥 [Manual de usuario](//)

---

## Instalación

Para instalar el proyecto de forma local, sigue los siguientes pasos:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/Ithanblade/Backend-EPMTPQ.git

2. Accede a la carpeta del proyecto e instala las dependencias necesarias:
    ```bash
    cd Backend-EPMTPQ
    npm install

3. Crea un archivo .env con las variables de entorno necesarias (consulta el archivo env.example para más detalles).

4. Ejecuta el servidor:
    ```bash
    npm run dev


5. Realiza pruebas en thunderClient o en algún sitio en el que se pueda hacer peticiónes, usa la siguiente url para las peticiones:

    [http://localhost:3000/](http://localhost:3000)

    recuerda añadir la ruta específica a la que vas a hacer la petición, ejemplo: http://localhost:3000/api/corredores (lista de corredores)
