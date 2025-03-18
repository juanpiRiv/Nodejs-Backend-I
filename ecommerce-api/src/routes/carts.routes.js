import express from 'express';
import methodOverride from 'method-override';
import { 
    createCart, getCartById, addProductToCart, updateCart, 
    updateProductQuantity, deleteProductFromCart, deleteCart, 
    addProductSessionCart, checkoutCart 
} from '../controllers/carts.controller.js';

const router = express.Router();

router.use(methodOverride('_method'));  // ✅ Permite usar _method en formularios

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/products/:pid', addProductToCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);  // ✅ Actualizar cantidad de producto
router.delete('/:cid/products/:pid', deleteProductFromCart);  // ✅ Eliminar producto del carrito
router.delete('/:cid', deleteCart);
router.post('/add-product', addProductSessionCart);  // ✅ Finalizar compra
router.post('/:cid/checkout', checkoutCart);
router.get('/:cid/checkout', checkoutCart); 
export default router;
