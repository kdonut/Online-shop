const db = require('../data/database');
const mongodb = require('mongodb');

class Product {

    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image; //image name
        this.imagePath = `product-data/images/${productData.image}`;
        this.imageUrl = `/products/assets/images/${productData.image}`;
        ///to by uniknac bledu przy nowym produkcie
        if(productData._id){
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        let prodId;

        try {
            prodId = new mongodb.ObjectId(productId);
        }catch(error){
            error.code = 404;
            throw(error);
        }

        
        const product = await db.getDb().collection('products').findOne({_id:prodId});
        if(!product){
            const error = new Error('Coud not find product with provided Id');
            error.code = 404;
            throw error;
        }

        return product;
    }

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        //uzywam map by utworzyc imagePath oraz imageUrl, normalnie by tego nie bylo
        return products.map(function(productDocument) {
            return new Product(productDocument)
        });
    }

    async save() {
        const producData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description : this.description,
            image: this.image,
            imagePath: this.imagePath,
            imageUrl: this.imageUrl
        };
        await db.getDb().collection('products').insertOne(producData);
    }
}

module.exports = Product;