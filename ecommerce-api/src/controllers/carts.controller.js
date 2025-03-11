import Cart from '../models/Cart.model.js';

// ✅ Obtener carrito por ID con productos poblados
export const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Actualizar carrito con nuevos productos
export const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
        if (!updatedCart) return res.status(404).json({ message: "Carrito no encontrado" });
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Actualizar solo la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Vaciar un carrito
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
