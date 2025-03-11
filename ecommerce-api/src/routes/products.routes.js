import express from 'express';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js';

const router = express.Router();

// ✅ Obtener productos con paginación, filtros y ordenamiento
router.get('/', getProducts);

// ✅ Obtener un producto por ID
router.get('/:pid', getProductById);

// ✅ Agregar un nuevo producto
router.post('/', addProduct);

// ✅ Actualizar un producto
router.put('/:pid', updateProduct);

// ✅ Eliminar un producto
router.delete('/:pid', deleteProduct);

export default router;
