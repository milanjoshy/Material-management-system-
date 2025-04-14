// Product.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Material Schema and Model
const MaterialSchema = new mongoose.Schema({
    materialName: String,
    category: String,
    quantity: String,
    createdBy: String
});
const MaterialModel = mongoose.model('Material', MaterialSchema, 'Material');

// CRUD APIs
router.get('/viewMaterials', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }
        const materials = await MaterialModel.find({ createdBy: userEmail });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch materials' });
    }
});

router.post('/addMaterial', async (req, res) => {
    try {
        const { materialName, category, quantity, createdBy } = req.body;
        const newMaterial = new MaterialModel({ materialName, category, quantity, createdBy });
        await newMaterial.save();
        res.json({ success: true, message: 'Material added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add material' });
    }
});

router.get('/viewMaterials', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }
        const materials = await MaterialModel.find({ createdBy: userEmail });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch materials' });
    }
});


router.put('/editMaterial/:id', async (req, res) => {
    try {
        const { materialName, category, quantity, createdBy } = req.body;
        const updatedMaterial = await MaterialModel.findByIdAndUpdate(
            req.params.id, 
            { materialName, category, quantity, createdBy }, 
            { new: true }
        );
        if (!updatedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json({ success: true, message: 'Material updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update material' });
    }
});

router.delete('/deleteMaterial/:id', async (req, res) => {
    try {
        const deletedMaterial = await MaterialModel.findByIdAndDelete(req.params.id);
        if (!deletedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete material' });
    }
});

module.exports = router;
