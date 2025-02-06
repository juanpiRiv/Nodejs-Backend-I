const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.initialize();
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch {
            await fs.writeFile(this.path, '[]');
        }
    }

    async createCart() {
        const newCart = {
            id: this.carts.length === 0 ? 1 : Math.max(...this.carts.map(c => c.id)) + 1,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === parseInt(id));
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({
                product: parseInt(productId),
                quantity: 1
            });
        }

        await this.saveCarts();
        return cart;
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }
}

module.exports = CartManager;