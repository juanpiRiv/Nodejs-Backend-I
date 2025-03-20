import express from 'express';
import Product from '../models/Product.model.js';
import Cart from '../models/Cart.model.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/products');
});
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, search = "", category = "", sort = "" } = req.query;
        const filter = search
            ? {
                $or: [
                    { category: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    { status: search.toLowerCase() === "disponible" ? true : false }
                ]
            }
            : {};
        // Si además se envía category, podrías combinarlo (esto depende de tu lógica)
        if (category) {
            // Por ejemplo, puedes añadir la condición directamente
            filter.category = { $regex: category, $options: "i" };
        }
        
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const products = await Product.paginate(filter, options);

        console.log("📌 Datos enviados a Handlebars:", products.docs);

        res.render('products', {
            title: 'Productos',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&search=${search}&category=${category}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&search=${search}&category=${category}` : null,
            // Aquí pasas los valores para que se muestren en el formulario
            search,
            category,
            sort,
            limit
        });
    } catch (error) {
        res.status(500).send('Error al cargar los productos');
    }
});



router.get('/cart', async (req, res) => {
    try {
        if (!req.session.cartId) {
            return res.render('cart', { title: "Carrito de Compras", cart: { products: [] } });
        }

        const cart = await Cart.findById(req.session.cartId).populate('products.product');

        if (!cart) {
            return res.render('cart', { title: "Carrito de Compras", cart: { products: [] } });
        }

        res.render('cart', { title: "Carrito de Compras", cart });
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');

        res.render('productDetail', { title: product.title, product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('cart', { title: 'Carrito', cart });
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

export default router;
