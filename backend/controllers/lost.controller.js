const Lost = require("../models/Lost");
const Details = require("../models/Details");
const Damaged = require("../models/Damaged");

exports.updateLostCostumeStatus = async (req, res) => {
    const { costumeIds, newStatus } = req.body;

    if (!costumeIds || !newStatus) {
        return res.status(400).json({ message: "costumeIds and status are required" });
    }

    try {
        if (newStatus === "Restored") {
            await Promise.all(
                costumeIds.map(async (e) => {
                    // Find the lost costume entry
                    const lostCostume = await Lost.findById(e.id);
                    if (!lostCostume) {
                        return;
                    }

                    // Calculate the remaining quantity that can be restored
                    const remainingQuantity = lostCostume.quantity - lostCostume.recived;

                    // Validate if the quantity to be restored is greater than the remaining quantity
                    if (e.quantity > remainingQuantity) {
                        throw new Error(`Invalid restore quantity   ${remainingQuantity===0?"All are restored":" Max allowed:"+remainingQuantity}`);
                    }

                    // Update status and received count in Lost collection
                    await Lost.findByIdAndUpdate(
                        e.id,
                        { 
                            $set: { status: newStatus }, 
                            $inc: { recived: e.quantity } 
                        },
                        { new: true }
                    );

                    // Update the Details collection (increase available stock)
                    await Details.findOneAndUpdate(
                        { id: e.cid }, // Match the correct costume
                        { $inc: { quantity: e.quantity } },
                        { new: true, upsert: true }
                    );
                })
            );
        } else if(newStatus === "Damaged"){


            await Promise.all(
                costumeIds.map(async (e) => {
                    // Find the lost costume entry
                    const lostCostume = await Lost.findById(e.id);
                    if (!lostCostume) {
                        return;
                    }
                    
                    // Calculate available quantities
                    const undamagedQuantity = lostCostume.quantity - lostCostume.damaged; // Items not yet marked damaged
                    const unreceived = lostCostume.quantity - lostCostume.recived; // Items not yet received
                    
                    // Validate the quantity to restore
                    if (e.quantity > undamagedQuantity) {
                        throw new Error(`Invalid restore quantity. ${undamagedQuantity === 0 ? 
                            "All items are already marked as damaged" : 
                            "Maximum allowed: " + undamagedQuantity}`);
                    }


                    if(unreceived === 0 ){
                        throw new Error(`All costumes are already recived`);
                    }
                    
                    // // Define update fields for Lost collection
                    // const updateFields = {};
                    let isDamaged = true;
                    
                    // // Determine if we're marking as damaged or received
                    // if (e.damaged) {
                    //     // User is explicitly marking as damaged
                    //     updateFields.damaged = e.quantity;
                    //     isDamaged = true;
                    // } else {
                    //     // User is marking as received
                    //     if (e.quantity > unreceived) {
                    //         throw new Error(`Cannot receive more than ${unreceived} items as only ${unreceived} are pending reception.`);
                    //     }
                      
                    // }
                    
                    // Update the Lost collection with either received or damaged count
                    await Lost.findByIdAndUpdate(
                        e.id,
                        {
                            $set: { status: newStatus },
                            $inc: {damaged:e.quantity}
                        },
                        { new: true }
                    );
                    
                    // If the item is marked as damaged, create a new entry in Damaged collection
                    if (isDamaged) {
                        const newDamagedEntry = new Damaged({
                            id: e.cid,
                            quantity: e.quantity,
                            inrepairedquantity: 0,
                            repairedquantity: 0,
                            cosumername: e.cosumername || "", // Ensure consumer name is set
                            createdAt: new Date()
                        });
                        
                        await newDamagedEntry.save();
                    }
                })
            );
            







        }else {
            return res.status(400).json({ message: "Please select a valid status" });
        }

        res.status(200).json({ success: true, message: "Status changed successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message || "Internal server error" });
    }
};
