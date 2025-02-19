import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { io } from '../server.js'; // Importamos WebSockets

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/products.json');

const getProducts = () => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const addProduct = (req, res) => {
    const products = getProducts();
    const newProduct = { id: Date.now(), ...req.body };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    io.emit('updateProducts', products); // Enviamos los productos actualizados a todos los clientes
    res.status(201).json({ message: 'Producto agregado', product: newProduct });
};

export { getProducts, addProduct };
