import Product from '../models/Product.model.js';

// ✅ Obtener productos con filtros, paginación y ordenamiento
export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const filter = query ? { category: query } : {}; // Filtrar por categoría si se pasa query
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}; // Ordenar por precio

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption
        };

        const products = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// ✅ Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Agregar un nuevo producto
export const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

// ✅ Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ✅ Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
