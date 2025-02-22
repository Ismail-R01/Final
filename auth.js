const express = require('express');
const bcrypt = require('bcryptjs');
const schema = require('./schemas');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const {decode} = require("jsonwebtoken");

router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const User = schema.user;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment variables!");
    process.exit(1); // Exit if JWT_SECRET is not defined
}

// User Registration Route
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web Final/public/auth/register.html'));
});

router.post('/register', async (req, res) => {
    
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Username already in use" });
        } 
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
            .send("<script>alert('Registered successfully');window.location.href='/profile.html';</script>"); // Redirect to profile after login
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/login.html'));
});

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        const userEmail = await User.findOne({ email });
        if (!user || !userEmail) {
            return res.status(400).json({ message: "Invalid username or email" });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
            .redirect('/profile.html'); // Redirect to profile after login

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/check-auth', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isAuthenticated: true });
    } catch (error) {
        res.json({ isAuthenticated: false });
    }
});

// Profile Route
router.get('/profile', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        res.json({ username: user.username, email: user.email });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ message: 'Logged out successfully' });
});

router.put('/update-profile', async (req, res) => {
    try {
        const { email, username } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email) user.email = email;
        if (username) user.username = username;

        await user.save();

        // Generate a new token with the updated username
        const newToken = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        // Send the new token back to the client in the response
        res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;