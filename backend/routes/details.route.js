const express = require('express')
const router = express.Router();
const Details = require('../models/Details')
const connectDb = require('../db/connectDb')
connectDb();


router.post('/addCostume', async (req, res) => {
    try {


        const data = await req.body;
        if (!data.cpid) {
            res.json({ success: false })
        }
        const newDetails = new Details(data);
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

            await Details.findOneAndDelete({ id: id });
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
router.put('/updateCostume', async (req, res) => {
    try {

        const { description, cosutmename, id } = await req.body;
        console.log({description, cosutmename, id})
        const data = await Details.findOneAndUpdate(
           { id: id,},
           { $set: {  description: description,costumename: cosutmename } },
           { new:true}
        )
        if (data) {
            res.json({ success: true, message: "Data updated",updatedData:data })
        }else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }

})

router.put('/trasferCostume',async (req,res)=>{
    try{
        const {id,cpid,newCpid}= await req.body
        const data = await Details.findOneAndUpdate(
            {id:id,cpid:cpid},
            {$set:{cpid:newCpid}},
            {new:true}
        )
        if (data) {
            res.json({ success: true, message: "Data Transfered" })
        }else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    }catch(err){
        console.log(err)
        res.json({ success: false })

    }
})



module.exports = router;