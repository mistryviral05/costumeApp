const Washing = require("../models/Washing");
const Details = require("../models/Details")
const { getIO } = require("../socket");




exports.addWashingClothes = async (req, res) => {

    try {
        const { costumes } = req.body;

        if (!costumes || !Array.isArray(costumes) || costumes.length === 0) {
            return res.json({ message: "Please select costumes" });
        }


        // Convert date strings to Date objects before saving
        const formattedCostumes = costumes.map(costume => ({
            ...costume,
            date: costume.date ? new Date(costume.date) : new Date() // Ensure it's a Date object
        }));

        await Washing.insertMany(formattedCostumes);
        costumes.forEach(async (costume) => {
            const costumeDetails = await Details.findOne({ id: costume.id });
            costumeDetails.quantity -= costume.quantity;
            await costumeDetails.save();
        })

        getIO().emit("washingAdd", { message: "New costume added", costumes: formattedCostumes });

        res.json({ success: true, message: "Costume added to washing" });
    } catch (error) {
        console.error("Error adding costumes to washing:", error);
        res.json({ success: false, error: error.message });
    }

}

exports.getWashingClothes = async (req, res) => {

    try {

        const costumes = await Washing.find();
        if (!costumes) {
            return res.json({ message: "Costumes is not in washing" })
        }

        res.json({ success: true, costumes })

    } catch (error) {
        res.json({ success: false })
    }
}

exports.markAsClean = async (req, res) => {
    try {

        const { date, costumes } = req.body;

        if (!date || !costumes || costumes.length === 0) {
            return res.status(400).json({ error: "Invalid data provided." });
        }

        // Convert the given date (YYYY-MM-DD) to start and end of the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // ✅ Find only "Not cleaned" costumes from Washing
        const washingCostumes = await Washing.find({
            date: { $gte: startOfDay, $lt: endOfDay },
            id: { $in: costumes },
            status: "Not cleaned" // Only process costumes that are not yet cleaned
        });

        if (washingCostumes.length === 0) {
            return res.json({ message: "Alredy cleaned" });
        }

        // ✅ Update their status to "Cleaned"
        await Washing.updateMany(
            { date: { $gte: startOfDay, $lt: endOfDay }, id: { $in: costumes }, status: "Not cleaned" },
            { $set: { status: "Cleaned" } }
        );

        // ✅ Increase quantity in Details collection only for newly cleaned costumes
        for (const washingItem of washingCostumes) {
            await Details.findOneAndUpdate(
                { id: washingItem.id },
                { $inc: { quantity: washingItem.quantity } }, // Add back the quantity
                { new: true }
            );
        }

        // ✅ Emit socket event
        getIO().emit("washingClean", {
            message: "Costumes marked as cleaned",
            costumes: washingCostumes.map(c => c.id), // Send only updated costumes
            date,
            status: "Cleaned"
        });

        return res.json({ message: "Selected costumes marked as cleaned successfully." });






    } catch (error) {
        res.json({ success: false })
    }
}
exports.deleteWashingClothes = async (req, res) => {
    try {
        const { date, id } = req.body;

        if (!date || !id) {
            return res.status(400).json({ error: "Invalid data provided." });
        }
        
        // Convert the given date (YYYY-MM-DD) to start and end of the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        // ✅ Find the costume and check its status before deleting
        const deletedEntry = await Washing.findOneAndDelete({
            id: id,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: "Cleaned"  // ✅ Only delete if already cleaned
        });
        
        if (!deletedEntry) {
            return res.status(400).json({ error: "Costume  not cleaned yet." });
        }
        
        getIO().emit("washingDeleted", { message: "Costume deleted from washing", id,date });
        res.json({ success: true, message: "Deleted successfully" });
        

    } catch (error) {
        res.json({ success: false })
    }
}