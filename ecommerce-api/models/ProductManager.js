const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.initialize();
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            await fs.writeFile(this.path, '[]');
        }
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios excepto thumbnails');
        }

        const exists = this.products.some(product => product.code === code);
        if (exists) {
            throw new Error('El código del producto ya existe');
        }

        const newProduct = {
            id: this.products.length === 0 ? 1 : Math.max(...this.products.map(p => p.id)) + 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const updatedProduct = {
            ...this.products[index],
            ...updates,
            id: parseInt(id)
        };

        this.products[index] = updatedProduct;
        await this.saveProducts();
        return updatedProduct;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        this.products.splice(index, 1);
        await this.saveProducts();
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
}

module.exports = ProductManager;