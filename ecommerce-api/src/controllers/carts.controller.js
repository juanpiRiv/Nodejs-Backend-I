import Cart from '../models/Cart.model.js';

// ✅ Crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const { selectedProducts } = req.body;

        if (!selectedProducts) {
            return res.status(400).json({ status: 'error', message: 'No se seleccionaron productos' });
        }

        // Convertir selectedProducts en un array si solo hay un producto seleccionado
        const productIds = Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts];

        // Obtener cantidades
        const productsWithQuantities = productIds.map(productId => ({
            product: productId,
            quantity: Number(req.body[`quantity_${productId}`]) || 1
        }));

        // Crear el carrito con los productos seleccionados
        const newCart = new Cart({ products: productsWithQuantities });
        await newCart.save();

        res.redirect(`/carts/${newCart._id}`);  // Redirigir a la vista del carrito
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const addProductSessionCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findById(req.session.cartId);

        if (!cart) {
            cart = await Cart.create({ products: [] });
            req.session.cartId = cart._id;
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += Number(quantity);
        } else {
            cart.products.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.save();
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


// ✅ Obtener un carrito por ID con productos poblados
export const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate({
                path: 'products.product',  // 🔥 Poblar datos del producto
                model: 'Product',  // Asegurar referencia a Product
                select: 'title price thumbnails category'  // Solo traer estos datos
            });

        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// ✅ Agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Actualizar un carrito con nuevos productos
export const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Actualizar solo la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (quantity < 1) return res.status(400).json({ status: "error", message: "Cantidad no válida" });

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ status: "success", cart });
        } else {
            res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Vaciar un carrito
export const deleteCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.cid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const checkoutCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ status: "error", message: "El carrito está vacío" });
        }

        // Simular confirmación de compra (en un e-commerce real, aquí procesarías el pago)
        console.log("✅ Compra finalizada:", cart.products);

        // Vaciar el carrito después de la compra
        cart.products = [];
        await cart.save();

        res.render("checkout", { title: "Compra Finalizada", cartId: cart._id });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
