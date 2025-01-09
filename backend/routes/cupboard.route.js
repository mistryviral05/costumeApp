const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb')
const Cupboard = require('../models/Cupboard');
connectDb();


router.post('/addCupboard', async (req, res) => {
    try {
        const data = await req.body;
        //store in database
        const newCupboard = new Cupboard({
            id: data.id,
            name: data.name
        })
        await newCupboard.save();

        res.json({ success: true, message: 'Data received' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
router.get('/getCupboard', async (req, res) => {
    try {
        const cupboards = await Cupboard.find();
        res.json({ success: true, cupboards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

router.put('/updateCupboard',async(req,res)=>{
    const { name, id } = req.body;
   
    try {
        const data = await Cupboard.findOneAndUpdate(
            { id }, // Find the document with the specific id
            { name }, // Update only the name field
            { new: true } // Return the updated document
        );
 
    
        if (data) {
        
            res.json({ success: "Updated successfully", updatedData: data });
        } else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    

})



router.delete('/deleteCupboard/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Cupboard.findOneAndDelete({ id: id });
        res.json({ success: true, message: 'Costume deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
})

module.exports = router;