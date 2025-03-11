import ProductManager from '../models/ProductManager.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query);
        res.json({ status: "success", ...products });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        res.json({ status: "success", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
