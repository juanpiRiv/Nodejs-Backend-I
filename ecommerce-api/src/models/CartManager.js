import Cart from './Cart.model.js';

class CartManager {
    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async updateCart(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
        }

        return cart;
    }

    async deleteProductFromCart(cartId, productId) {
        return await Cart.findByIdAndUpdate(cartId, {
            $pull: { products: { product: productId } }
        }, { new: true });
    }

    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId);
    }
}

export default CartManager;
