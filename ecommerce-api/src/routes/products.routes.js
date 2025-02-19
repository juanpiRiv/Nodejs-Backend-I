import express from 'express';
import ProductManager from '../models/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('products.json');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;
        res.json(limit ? products.slice(0, parseInt(limit)) : products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        if (!newProduct) {
            return res.status(400).json({ error: "Error al agregar el producto. Verifica los datos." });
        }
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
