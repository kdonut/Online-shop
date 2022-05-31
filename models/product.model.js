const db = require("../data/database");
const mongodb = require("mongodb");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; //image name
    this.updateImageData();
    ///to by uniknac bledu przy nowym produkcie
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;

    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });


    if (!product) {
      const error = new Error("Coud not find product with provided Id");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    //uzywam map by utworzyc imagePath oraz imageUrl, normalnie by tego nie bylo
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }


  updateImageData(){
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const producData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
      imagePath: this.imagePath,
      imageUrl: this.imageUrl,
    };

    if(this.id){
        const productId = new mongodb.ObjectId(this.id);

    if(!this.image){
        delete producData.image;
    }

        await db.getDb().collection('products').updateOne({_id:productId},{
        $set: producData,
       });


    }
    else {
        await db.getDb().collection("products").insertOne(producData);

    }
  }

  replaceImage(newImage){
    this.image = newImage;
    this.updateImageData();
}

}

module.exports = Product;
