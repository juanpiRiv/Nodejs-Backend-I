import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { getProducts, addProduct } from './controllers/products.controller.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data/products.json'); // Ruta del archivo de productos

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para renderizar la vista home con productos
app.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { title: 'Lista de Productos', products });
});

// Ruta para la vista en tiempo real con productos
app.get('/realtimeproducts', (req, res) => {
    const products = getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar productos actuales al cliente cuando se conecta
    socket.emit('updateProducts', getProducts());

    // Recibir productos nuevos desde el cliente
    socket.on('newProduct', (product) => {
        const newProduct = addProduct(product);
        io.emit('updateProducts', getProducts()); // Notificar a todos los clientes
    });

    // Recibir solicitud para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        let products = getProducts();
        products = products.filter(product => product.id !== parseInt(productId));
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        io.emit('updateProducts', products); // Notificar a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Levantar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { io }; // Exportamos io después de levantar el servidor
