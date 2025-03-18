import Cart from '../models/Cart.model.js';

export const createCart = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en createCart:", req.body);

        const { selectedProducts } = req.body;

        if (!selectedProducts || selectedProducts.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No se seleccionaron productos' });
        }

        const productIds = Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts];

        // 🔥 Verifica si las cantidades son correctas
        const productsWithQuantities = productIds.map(productId => ({
            product: productId,
            quantity: Number(req.body[`quantity_${productId}`]) || 1
        }));

        console.log("🛒 Productos que se guardarán en el carrito:", productsWithQuantities);

        if (productsWithQuantities.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No hay productos válidos para el carrito' });
        }

        const newCart = new Cart({ products: productsWithQuantities });
        await newCart.save();

        req.session.cartId = newCart._id;
        console.log("✅ Carrito creado con ID:", newCart._id);

        res.redirect(`/carts/${newCart._id}`);
    } catch (error) {
        console.error("❌ Error en createCart:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const addProductSessionCart = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en addProductSessionCart:", req.body);

        const { productId, quantity } = req.body;
        let cart = await Cart.findById(req.session.cartId);

        if (!cart) {
            cart = await Cart.create({ products: [] });
            req.session.cartId = cart._id;
            console.log("🆕 Nuevo carrito creado con ID:", cart._id);
        }

        console.log("🔍 Carrito antes de agregar:", cart);

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += Number(quantity);
        } else {
            cart.products.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.save();

        console.log("✅ Carrito actualizado:", cart);
        res.redirect('/products');
    } catch (error) {
        console.error("❌ Error en addProductSessionCart:", error);
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
        const { cid } = req.params;
        const { products } = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ status: "error", message: "Cantidad no válida" });
        }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return res.json({ status: "success", cart });
        }

        res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// ✅ Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
// ✅ Vaciar un carrito
export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: "success", message: "Carrito vaciado correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
export const checkoutCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate({
            path: 'products.product',
            model: 'Product'
        });

        console.log("🛍️ Carrito en checkout después de populate:", JSON.stringify(cart, null, 2));

        if (!cart || cart.products.length === 0) {
            console.log("⚠ Carrito vacío. Enviando estructura vacía.");
            return res.render("checkout", { title: "Compra Finalizada", products: [], totalPrice: 0 });
        }

        const purchasedProducts = cart.products.map(item => ({
            title: item.product?.title || "Producto desconocido",
            price: item.product?.price || 0,
            quantity: item.quantity || 1,
            thumbnails: Array.isArray(item.product?.thumbnails) && item.product.thumbnails.length
                ? item.product.thumbnails[0]
                : 'https://via.placeholder.com/150'
        }));

        const totalPrice = purchasedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        console.log("📌 Enviando a Handlebars:", JSON.stringify({ products: purchasedProducts, totalPrice }, null, 2));
        // ✅ Renderizar ANTES de vaciar el carrito
        res.render("checkout", {
            title: "Compra Finalizada",
            products: purchasedProducts,
            totalPrice
        });

        // ✅ Vaciar carrito DESPUÉS de renderizar
        setTimeout(async () => {
            cart.products = [];
            await cart.save();
            req.session.cartId = null;
        }, 2000);  // Le damos 2 segundos para asegurar que la vista se renderiza correctamente


    } catch (error) {
        console.error("❌ Error en checkoutCart:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
