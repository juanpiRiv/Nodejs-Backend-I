import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import ProductManager from './models/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager('products.json'); // ✅ Instanciamos ProductManager correctamente

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos y parsing de JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para renderizar la vista home con productos
app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { title: 'Lista de Productos', products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos.");
    }
});

// Ruta para la vista en tiempo real con productos
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos.");
    }
});

// Configuración de WebSockets
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Enviar productos actuales al cliente cuando se conecta
    socket.emit('updateProducts', await productManager.getProducts());

    // Recibir productos nuevos desde el cliente
    socket.on('newProduct', async (productData) => {
        try {
            console.log("📥 Producto recibido en WebSocket:", productData);
    
            const newProduct = await productManager.addProduct(productData);
            if (!newProduct) {
                console.log("❌ Error al agregar producto. Verifica los datos.");
                return;
            }
    
            console.log("✅ Producto agregado:", newProduct);
    
            io.emit('updateProducts', await productManager.getProducts());
        } catch (error) {
            console.error("❌ Error en WebSockets:", error.message);
        }
    });

    // Recibir solicitud para eliminar un producto
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('updateProducts', await productManager.getProducts());
        } catch (error) {
            console.error("❌ Error al eliminar producto:", error.message);
        }
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
