const Damaged = require("../models/Damaged");
const Details = require("../models/Details");
const Log = require("../models/Logs")

exports.chageStatusDamaged = async (req, res) => {
    const { costumeIds, newStatus } = req.body;

    if (!costumeIds || !newStatus) {
        return res.status(400).json({ message: "costumeIds and status are required" });
    }

    try {
        const logs = [];
        if (newStatus === "In Repair") {
            await Promise.all(costumeIds.map(async (e) => {
                await Damaged.findByIdAndUpdate(
                    e.id,
                    { $set: { status: newStatus }, $inc: { inrepairedquantity: e.quantity } },
                    { new: true }
                );

                // Create a log entry
                logs.push({
                    timestamp: new Date(),
                    level: "info",
                    service: "DamageManagement",
                    action: "Change Status",
                    message: `Costume ID ${e.id} marked as 'In Repair'`,
                    details: { statusCode: 200, additionalInfo: `Quantity in repair increased by ${e.quantity}` },
                });
            }));
        } else if (newStatus === "Repaired") {
            const errors = [];

            await Promise.all(costumeIds.map(async (e) => {
                const costume = await Damaged.findById(e.id);
                if (!costume) {
                    errors.push(`Costume with ID ${e.id} not found`);
                    return;
                }

                if (e.quantity > costume.inrepairedquantity) {
                    errors.push(`Repaired quantity cannot exceed in-repaired quantity for costume ID ${e.id}`);
                    return;
                }

                const newRepairedQuantity = (costume.repairedquantity || 0) + e.quantity;
                if (newRepairedQuantity > costume.quantity) {
                    errors.push(`Your quantity is invalid`);
                    return;
                }

                const updatedStatus = (newRepairedQuantity === costume.quantity) ? "Repaired" : "In Repair";

                await Damaged.findByIdAndUpdate(
                    e.id,
                    {
                        $set: { status: updatedStatus },
                        $inc: { repairedquantity: e.quantity, inrepairedquantity: -e.quantity }
                    },
                    { new: true }
                );
                await Details.findOneAndUpdate(
                    { id: e.cid }, // Ensure you're using the correct field
                    { $inc: { quantity: e.quantity } },
                    { new: true }
                );

                // Create a log entry
                logs.push({
                    timestamp: new Date(),
                    level: "info",
                    service: "DamageManagement",
                    action: "Change Status",
                    message: `Costume ID ${e.cid} marked as '${updatedStatus}'`,
                    details: { statusCode: 200, additionalInfo: `Repaired quantity updated by ${e.quantity}` },
                });
            }));

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join(", ") });
            }
        } else {
            return res.status(400).json({ message: "Please select a valid status" });
        }

        // Insert all logs into the database
        if (logs.length > 0) {
            await Log.insertMany(logs);
        }

        res.status(200).json({ success: true, message: "Status changed successfully" });
    } catch (error) {
        await Log.create({
            timestamp: new Date(),
            level: "error",
            service: "DamageManagement",
            action: "Change Status",
            message: "Internal server error",
            details: { statusCode: 500, additionalInfo: error.message },
        });

        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.deleteDamagedCostumes = async (req, res) => {

    try {

        const { costumeIds } = req.body;

        // Validate input
        if (!costumeIds || !Array.isArray(costumeIds) || costumeIds.length === 0) {
            return res.status(400).json({ message: "costumeIds must be a non-empty array" });
        }

        // Delete multiple documents where the ID is in the given array
        const result = await Damaged.deleteMany({ _id: { $in: costumeIds } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No matching costumes found to delete" });
        }

        res.status(200).json({ success: true, message: "Selected Costumes successfully deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }

}


exports.fetchLogs = async (req, res) => {

    try {

        const logs = await Log.find();
        if (!logs) {
            return res.status(400).json({ message: "logs not found" })
        }
        res.status(200).json({ success: true, message: logs })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }


}