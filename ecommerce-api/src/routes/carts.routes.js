import express from 'express';
import CartManager from '../models/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('carts.json'); // Ajusta la ruta si es necesario

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
