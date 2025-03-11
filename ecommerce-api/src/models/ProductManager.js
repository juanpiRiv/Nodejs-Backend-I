import Product from './Product.model.js';

class ProductManager {
    async addProduct(data) {
        try {
            const product = new Product(data);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error al agregar producto: ' + error.message);
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query }) {
        try {
            const options = {
                page,
                limit,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
            };
            
            const filter = query ? { category: query } : {};
            return await Product.paginate(filter, options);
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async updateProduct(id, updates) {
        return await Product.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default ProductManager;
