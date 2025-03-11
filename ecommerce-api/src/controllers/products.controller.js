import Product from '../models/Product.model.js';

// ✅ Obtener productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        const filter = query ? { category: query } : {}; // Filtrar por categoría si se envía query
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {} // Ordenar por precio asc/desc
        };

        const products = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ✅ Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Crear un nuevo producto
export const addProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: 'Producto agregado', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
