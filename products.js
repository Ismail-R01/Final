const express = require('express');
const schemas = require('./schemas');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user data to request
        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

router.post('/add', isAuthenticated, async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log request body
        
        const { name, price, description, category, imageUrl } = req.body;
        const owner = req.user?.userId;

        if (!name || !price || !description || !category || !imageUrl) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new schemas.product({
            name,
            price: parseFloat(price),
            description,
            category,
            imageUrl,
            owner
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Fetch a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await schemas.product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Fetch a single product by ID and update it
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        // Build the update object dynamically
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No updates provided" });
        }
        
        Product = schemas.product;
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
