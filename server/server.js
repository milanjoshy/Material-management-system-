const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ProductRoutes = require('./Product');
const UserModel = require('./User');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect('mongodb://localhost:27017/DemoApp')
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

// Mount routes
app.use('/', ProductRoutes);

// User Routes
app.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, location, password } = req.body;
        if (!name || !email || !phone || !location || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (isNaN(phone)) {
            return res.status(400).json({ success: false, message: 'Phone must be a number' });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const newUser = new UserModel({ name, email, phone: Number(phone), location, password });
        await newUser.save();
        res.json({ success: true, message: 'User registered successfully', user: { name, email } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to register user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to login' });
    }
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
