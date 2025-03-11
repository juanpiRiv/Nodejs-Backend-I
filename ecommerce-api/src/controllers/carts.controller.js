import CartManager from '../models/CartManager.js';

const cartManager = new CartManager();

export const createCart = async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity || 1);

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) return res.status(400).json({ status: "error", message: "Cantidad no válida" });

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        await cartManager.deleteCart(req.params.cid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
