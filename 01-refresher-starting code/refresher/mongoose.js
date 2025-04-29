const mongoose = require('mongoose');

const Product = require('./models/products')

mongoose.connect(
    'mongodb+srv://debi:ddaA3sPXTvxNL-C@cluster0.ryy6u.mongodb.net/products_test?retryWrites=true&w=majority&appName=Cluster0'
).then(()=>{
    console.log("Conected to database!")
}).catch(()=>{
    console.log('Conection failed')
})



const createProduct = async (req, res, next) =>{
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });
    console.log(createdProduct)
    const result = await createdProduct.save();
    //console.log(typeof createdProduct._id)
    res.json(result)
}

const getProduct = async (req, res, next) =>{
    const products = await Product.find().exec();
    res.json(products)
}

exports.createProduct = createProduct;
exports.getProduct = getProduct;