const express = require('express')
const router = express.Router();
const Details = require('../models/Details')
const connectDb = require('../db/connectDb')
const Cupboard = require('../models/Cupboard');
const path = require('path')
const fs = require('fs')
connectDb();


router.post('/addCostume', async (req, res) => {
    try {


        const data = await req.body;
        if (!data.cpid) {
            return res.json({ success: false })
        }
        const cupDet = await Cupboard.findOne({ id: data.cpid });
        console.log(cupDet.name);
        console.log(cupDet.place);
        const newDetails = new Details({
            cpid: data.cpid,
            id: data.id,
            cpname: cupDet.name,
            place: cupDet.place,
            costumename: data.costumename,
            description: data.description,
            fileUrl: data.fileUrl
        });
        await newDetails.save();
        res.json({ success: true })
    } catch (err) {
        console.log(err);
        res.json({ success: false })
    }
})
router.delete('/deleteCostume/:id', async (req, res) => {
    try {
        const { id } = await req.params;

        const isAvailableId = await Details.findOne({ id: id });
        if (isAvailableId) {
            const img = isAvailableId.fileUrl;
            const filePath = path.join(__dirname, '../', img.replace('http://localhost:3002/', ''));
            console.log(filePath)
            await Details.findOneAndDelete({ id: id });
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    console.log(err);
                })
            }
            res.json({ success: true, message: "Data Deleted" })
        } else {
            res.json({ success: false })
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false })

    }
})


router.get('/getCostume/:cpid', async (req, res) => {
    try {
        const { cpid } = await req.params;
        if (!cpid) {
            res.json({ success: false })
        }
        const data = await Details.find({ cpid: cpid });
        if (data) {
            res.json({ success: true, data });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }


})
router.get('/getCostume', async (req, res) => {
    try {


        const data = await Details.find();

        if (data) {
            res.json({ success: true, data });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }


})
router.put('/updateCostume', async (req, res) => {
    try {

        const { description, costumename, id } = await req.body;
        console.log({ description, costumename, id })
        const data = await Details.findOneAndUpdate(
            { id: id, },
            { $set: { description: description, costumename: costumename } },
            { new: true }
        )
        if (data) {
            res.json({ success: true, message: "Data updated", updatedData: data })
        } else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }

})

router.put('/trasferCostume', async (req, res) => {
    try {
        const { id, cpid, newCpid } = await req.body
        const detail = await Cupboard.findOne({ id: newCpid });
        const data = await Details.findOneAndUpdate(
            { id: id, cpid: cpid },
            { $set: { cpid: newCpid, cpname: detail.name, place: detail.place } },
            { new: true }
        )
        if (data) {
            res.json({ success: true, message: "Data Transfered" })
        } else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })

    }
})



module.exports = router;