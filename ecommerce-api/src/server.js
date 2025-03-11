import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import { config } from './config/config.js';
import Product from './models/Product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Depuración de rutas
console.log('Cargando rutas...');
console.log('productsRoutes:', productsRoutes);
console.log('cartsRoutes:', cartsRoutes);

// Rutas de la API
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Renderizar vista home con productos desde MongoDB
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { title: 'Lista de Productos', products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos.");
    }
});

// Renderizar vista de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos.");
    }
});

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
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
