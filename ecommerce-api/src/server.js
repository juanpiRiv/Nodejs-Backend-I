import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js'; // 🚀 Nueva ruta de vistas
import { config } from './config/config.js';
import ProductManager from './models/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/', viewsRoutes); // 🚀 Agregamos las vistas

// Configuración de WebSockets
io.on('connection', async (socket) => {
    console.log('⚡ Cliente conectado');

    // Enviar productos actuales al cliente
    socket.emit('updateProducts', await productManager.getProducts({}));

    // Escuchar productos nuevos
    socket.on('newProduct', async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            io.emit('updateProducts', await productManager.getProducts({}));
        } catch (error) {
            console.error('❌ Error al agregar producto:', error.message);
        }
    });

    // Escuchar eliminación de productos
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('updateProducts', await productManager.getProducts({}));
        } catch (error) {
            console.error('❌ Error al eliminar producto:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado');
    });
});

// Conectar a MongoDB
mongoose.connect(config.URL_MONGODB)
    .then(() => console.log(`✅ Conectado a MongoDB en ${config.URL_MONGODB}`))
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    });

// Levantar el servidor
server.listen(config.PORT, () => console.log(`🚀 Servidor corriendo en puerto ${config.PORT}`));

export { io };
