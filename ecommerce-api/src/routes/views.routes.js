import express from 'express';
import ProductManager from '../models/ProductManager.js';
import CartManager from '../models/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query);
        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null;

        res.render('products', { title: 'Productos', ...products });
    } catch (error) {
        res.status(500).send('Error al cargar los productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');

        res.render('productDetail', { title: product.title, product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('cart', { title: 'Carrito', cart });
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

export default router;
