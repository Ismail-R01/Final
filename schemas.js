const mongoose = require("mongoose");
require('dotenv').config();

const mongoURI = process.env.MONGOURI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


const Products = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    category: String,
    owner: String
});
const product = mongoose.model('Products', Products);


const Users = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
const user = mongoose.model('Users', Users);

module.exports = { product, user };