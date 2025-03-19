import Product from '../models/Product.model.js';

export const getProducts = async (req, res) => {
    try {
        let { page = 1, limit = 10, sort, query } = req.query;
        
        // Validar que page y limit sean números positivos
        page = parseInt(page) > 0 ? parseInt(page) : 1;
        limit = parseInt(limit) > 0 ? parseInt(limit) : 10;

        // Filtros mejorados: Buscar por categoría, disponibilidad o nombre
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: { $regex: query, $options: "i" } }, // Filtra por categoría (insensible a mayúsculas)
                    { title: { $regex: query, $options: "i" } }, // Filtra por nombre del producto
                    { status: query.toLowerCase() === "disponible" ? true : false } // Filtra por disponibilidad
                ]
            };
        }

        // Opciones de ordenamiento (ascendente o descendente por precio)
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = {
            page,
            limit,
            sort: sortOption,
            lean: true,
        };

        const result = await Product.paginate(filter, options);

        // Construcción de respuesta
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};



export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
