import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../config/utils.js';  // Importamos __dirname

class CartManager {
    constructor(filePath) {
        this.path = path.resolve('src/data', filePath)
        this.carts = [];
        this.initialize();
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo, inicializando como vacío:', error.message);
            await fs.writeFile(this.path, '[]');
            this.carts = [];
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
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar los carritos:', error.message);
        }
    }
}

export default CartManager;
