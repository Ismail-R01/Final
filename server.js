// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const schemas = require('./schemas');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config(); // Load environment variables from .env file

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))

const mongoURI = process.env.MONGOURI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


app.get('/api/products', async (req, res) => {
    try {
        const products = await schemas.product.find(); // Fetch products from MongoDB
        res.json(products); // Send products as JSON
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.get('/api/user-products', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userProducts = await schemas.product.find({ owner: decoded.userId });

        res.json(userProducts);
    } catch (error) {
        console.error("Error fetching user products:", error);
        res.status(500).json({ message: "Server error" });
    }
});


PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


function addProduct(name, price, description, category, imageUrl, owner){
    let product = schemas.product
    
    newProduct = {
        name: name,
        price: price,
        description: description,
        category: category,
        imageUrl: imageUrl,
        owner: owner
    }

    product.insertOne(newProduct)
        .then(() => {
            console.log('Products inserted successfully');
            mongoose.connection.close();
        })
        .catch(err => {
            console.log('Error inserting products:', err);
            mongoose.connection.close();
        });
    
}

