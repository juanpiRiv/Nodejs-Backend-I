# Nodejs-Backend-I

Entrega para Coderhouse  

## Descripción  

Este proyecto es una API de comercio electrónico construida con Node.js y Express. Su propósito principal es proporcionar una solución backend robusta para la gestión de productos y carritos de compras en una tienda en línea. La API permite la interacción entre clientes y el sistema de gestión de productos, facilitando operaciones como:  

- **Gestión de productos**: Creación, actualización, eliminación y consulta de productos disponibles en la tienda.  
- **Gestión de carritos de compras**: Agregar y eliminar productos en un carrito de compras asociado a un usuario.  
- **Procesamiento de pedidos**: Finalización de compras y generación de órdenes.  
- **Autenticación y sesiones**: Uso de sesiones para la gestión de usuarios con Express-session y almacenamiento en MongoDB.  
- **Conexión en tiempo real**: Implementación de WebSockets con Socket.io para la actualización en vivo de productos y carritos.  

El proyecto sigue una arquitectura modular que permite su escalabilidad y mantenimiento fácil. Se basa en una estructura MVC (Modelo-Vista-Controlador), asegurando una separación clara entre la lógica de negocio y las rutas de la aplicación.  

## Instalación  

Sigue estos pasos para instalar y configurar el proyecto:  

1. Clona el repositorio:  
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ecommerce-api
   npm install
Crea un archivo .env en la raíz del proyecto y configura las variables necesarias (ver Configuración).


PORT=
MONGO_URI=mongodb://localhost:27017/ecommerce
SESSION_SECRET=tu_secreto_aqui

## Dependencias
Este proyecto usa las siguientes tecnologías:

- **Node.js y Express para el backend
- **MongoDB con Mongoose como base de datos
- **Express Handlebars para vistas
- **Socket.io para comunicación en tiempo real
- **dotenv para manejar variables de entorno


