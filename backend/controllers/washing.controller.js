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

        // ✅ Find "Not Cleaned" or "Partially Cleaned" costumes
        const washingCostumes = await Washing.find({
            date: { $gte: startOfDay, $lt: endOfDay },
            id: { $in: costumes },
            status: { $in: ["Not Cleaned", "Partially Cleaned"] }
        });

        if (washingCostumes.length === 0) {
            return res.json({ message: "Already cleaned" });
        }

        // ✅ Loop through each washing item to update cleanedQuantity correctly
        for (const item of washingCostumes) {
            const remainingQuantity = item.quantity - item.cleanedQuantity; // Calculate uncleaned quantity

            await Washing.updateOne(
                { id: item.id },
                { 
                    $set: { status: "Fully Cleaned" },
                    $inc: { cleanedQuantity: remainingQuantity }  // ✅ Only add remaining quantity
                },
                {new:true,runValidators:true}
            );

            // ✅ Restore only the remaining uncleaned quantity in Details
            if (remainingQuantity > 0) {
                await Details.findOneAndUpdate(
                    { id: item.id },
                    { $inc: { quantity: remainingQuantity } }, // ✅ Add back only uncleaned quantity
                    { new: true, runValidators: true }
                );
            }
        }

        // ✅ Emit socket event
        getIO().emit("washingClean", {
            message: "Costumes marked as cleaned",
            costumes: washingCostumes.map(c => c.id),
            date,
            status: "Fully Cleaned"
        });

        return res.json({ message: "Selected costumes marked as cleaned successfully." });

    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

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
            status: "Fully Cleaned"  // ✅ Only delete if already cleaned
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



exports.partialClean = async (req, res) => {
    const { date, costumeId, cleanedQuantity } = req.body;

    try {
        if (!date || !costumeId || !cleanedQuantity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find existing wash record
        let washRecord = await Washing.findOne({ id: costumeId });

        if (!washRecord) {
            return res.status(404).json({ success: false, message: "Washing record not found" });
        }

        // Ensure cleaned quantity does not exceed total given quantity
        if (washRecord.cleanedQuantity + cleanedQuantity > washRecord.quantity) {
            return res.status(400).json({ success: false, message: "Cleaned quantity exceeds total given quantity" });
        }

        // Update cleaned quantity and status
        if (cleanedQuantity === washRecord.quantity) {
            washRecord.status = "Fully Cleaned";
            washRecord.cleanedQuantity = washRecord.quantity;
        } else if (cleanedQuantity === (washRecord.quantity - washRecord.cleanedQuantity)) {
            washRecord.status = "Fully Cleaned";
            washRecord.cleanedQuantity += cleanedQuantity;
        } else {
            washRecord.status = "Partially Cleaned";
            washRecord.cleanedQuantity += cleanedQuantity;
            washRecord.date = date || new Date();
        }

        // ✅ Save washing record
        await washRecord.save();

        // ✅ Restore quantity in Details collection
        await Details.findOneAndUpdate(
            { id: costumeId },
            { $inc: { quantity: cleanedQuantity } }, // Add back the cleaned quantity
            { new: true }
        );

        res.status(200).json({ success: true, message: "Partial clean recorded successfully", washRecord });

    } catch (error) {
        console.error("Error in partialClean:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

