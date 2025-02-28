const Cupboard = require('../models/Cupboard');
const Details = require('../models/Details');
const path = require('path');
const fs = require('fs');
const { getIO } = require('../socket');
exports.addCupboard = async (req, res) => {
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
        getIO().emit("addNewCupboard",{newCupboard})
        res.json({ success: true, message: 'Data received' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
exports.getCupboard = async (req, res) => {
    try {
        const cupboards = await Cupboard.find();

        res.json({ success: true, cupboards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
exports.getCupboardCount = async(req,res)=>{

    try{
        const count = await Cupboard.countDocuments();
        res.json({success:true,message:{count:count}})

    }catch(err){
        res.json({success:false,message:"error in controller"})
    }

}
exports.updateCupboard =  async (req, res) => {
    const { name, id } = req.body;

    try {
        const data = await Cupboard.findOneAndUpdate(
            { id }, // Find the document with the specific id
            { name }, // Update only the name field
            { new: true } // Return the updated document
        );

        await Details.updateMany({cpid:id},{$set:{cpname:name}},{new:true})

        if (data ) {
            getIO().emit("updateCupboard",{id,name})
            res.json({ success: "Updated successfully", updatedData: data });
        } else {
            res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Internal server error" });
    }


}
exports.deleteCupboards =  async (req, res) => {
    try {
        const { id } = req.params;
        const fileUrls = await Details.find({ cpid: id })
        for (const fileUrl of fileUrls) {
            const url = fileUrl.fileUrl
            const filePath = path.join(__dirname, '../', url.replace('http://localhost:3002/', ''));
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    console.log(err);
                })
            }
        }
        await Details.deleteMany({ cpid: id })
        await Cupboard.findOneAndDelete({ id: id });
        getIO().emit("deleteCupboard",{id})
        res.json({ success: true, message: 'Cupboard and it s item deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}

