const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb')
const Cupboard = require('../models/Cupboard');
const Details = require('../models/Details');
const path = require('path')
const fs = require('fs')
connectDb();


router.post('/addCupboard', async (req, res) => {
    try {
        const data = await req.body;
        //store in database
        const newCupboard = new Cupboard({
            id: data.id,
            name: data.name,
            place: data.place,
            space: data.space
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

router.put('/updateCupboard', async (req, res) => {
    const { name, id } = req.body;

    try {
        const data = await Cupboard.findOneAndUpdate(
            { id }, // Find the document with the specific id
            { name }, // Update only the name field
            { new: true } // Return the updated document
        );

        await Details.updateMany({cpid:id},{$set:{cpname:name}},{new:true})

        if (data ) {

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
        const fileUrls = await Details.find({ cpid: id })
        for (const fileUrl of fileUrls) {
            const url = fileUrl.fileUrl
            const filePath = path.join(__dirname, '../', url.replace('http://localhost:3002/', ''));
            console.log(fileUrl)
            console.log(url)
            console.log(filePath)
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    console.log(err);
                })
            }
        }
        await Details.deleteMany({ cpid: id })
        await Cupboard.findOneAndDelete({ id: id });
        res.json({ success: true, message: 'Cupboard and it s item deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
})

module.exports = router;