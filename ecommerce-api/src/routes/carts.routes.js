import express from 'express';
import {
    getCartById,
    createCart,
    addProductToCart,
    updateCart,
    updateProductQuantity,
    deleteProductFromCart,
    clearCart
} from '../controllers/carts.controller.js';

const router = express.Router();

// ✅ Crear un nuevo carrito
router.post('/', createCart);

// ✅ Obtener un carrito por ID con productos poblados
router.get('/:cid', getCartById);

// ✅ Agregar un producto a un carrito
router.post('/:cid/product/:pid', addProductToCart);

// ✅ Actualizar un carrito con un nuevo array de productos
router.put('/:cid', updateCart);

// ✅ Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', updateProductQuantity);

// ✅ Eliminar un producto del carrito
router.delete('/:cid/product/:pid', deleteProductFromCart);

// ✅ Vaciar un carrito
router.delete('/:cid', clearCart);

export default router;
