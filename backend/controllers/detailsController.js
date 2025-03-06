const Details = require('../models/Details')
const Cupboard = require('../models/Cupboard');
const Catagory = require('../models/Catagory')
const path = require('path');
const fs = require('fs');
const Cart = require('../models/Cart');
const AssignedTo = require('../models/AssignedTo');
const { getIO } = require('../socket');
const Damaged = require('../models/Damaged');
const Lost = require('../models/Lost');
const Log = require('../models/Logs');


exports.addCostume = async (req, res) => {
    try {


        const data = await req.body;
        if (!data.cpid) {
            return res.json({ success: false })
        }
        const cupDet = await Cupboard.findOne({ id: data.cpid });
        const catDet = await Catagory.findOne({ _id: data.catagory })
        const cupDetName = cupDet.name.trim();

        const newDetails = new Details({
            cpid: data.cpid,
            id: data.id,
            cpname: cupDetName,
            catagory: catDet.catagory,
            place: cupDet.place,
            costumename: data.costumename,
            description: data.description,
            fileUrl: data.fileUrl,
            quantity: data.quantity,
        });
        await newDetails.save();
        getIO().emit("addNewCostumes", { success: true, newDetails })
        res.json({ success: true, message: "Costume Added" })
    } catch (err) {
        console.log(err);
        res.json({ success: false })
    }
}
exports.deleteCostumeById = async (req, res) => {
    try {
        const { id } = await req.params;

        const isAvailableId = await Details.findOne({ id: id });
        if (isAvailableId) {
            const img = isAvailableId.fileUrl;
            const filePath = path.join(__dirname, '../', img.replace('http://localhost:3002/', ''));
            await Details.findOneAndDelete({ id: id });
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    console.log(err);
                })
            }

            getIO().emit("deleteGallary", { success: true, message: id })
            res.json({ success: true, message: "Data Deleted" })
        } else {
            res.json({ success: false })
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false })

    }
}
exports.getCostumeByid = async (req, res) => {
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


}
exports.getCostumeByCostumeId = async (req, res) => {
    try {
        const { id } = await req.params;
        if (!id) {
            res.json({ success: false })
        }
        const data = await Details.find({ id: id });
        if (data) {
            res.json({ success: true, data });
        }

    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }


}
exports.getCostumeCount = async (req, res) => {

    try {
        const count = await Details.countDocuments();

        res.json({ success: true, message: { count: count } })

    } catch (err) {
        res.json({ success: false, message: "error in controller" })
    }

}
exports.getCostume = async (req, res) => {
    try {


        const data = await Details.find();

        if (data) {
            res.json({ success: true, data });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }


}
exports.updateCostume = async (req, res) => {
    try {

        const { description, costumename, id } = await req.body;
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

}
exports.trasferCostume = async (req, res) => {
    try {
        const { id, cpid, newCpid } = req.body;

        const detail = await Cupboard.findOne({ id: newCpid });
        if (!detail) {
            await Log.create({
                timestamp: new Date(),
                level: "warning",
                service: "DataTransfer",
                action: "Transfer Data",
                message: `Cupboard with ID ${newCpid} not found`,
                details: { statusCode: 404, additionalInfo: "Invalid newCpid provided" },
            });

            return res.status(404).json({ error: "Target cupboard not found" });
        }

        const data = await Details.findOneAndUpdate(
            { id: id, cpid: cpid },
            { $set: { cpid: newCpid, cpname: detail.name, place: detail.place } },
            { new: true }
        );

        if (data) {
            await Log.create({
                timestamp: new Date(),
                level: "info",
                service: "DataTransfer",
                action: "Transfer Data",
                message: `Successfully transferred data for costume ID ${id} to new cupboard ${newCpid}`,
                details: { statusCode: 200, additionalInfo: "Cupboard details updated successfully" },
            });

            return res.json({ success: true, message: "Data Transferred" });
        } else {
            await Log.create({
                timestamp: new Date(),
                level: "warning",
                service: "DataTransfer",
                action: "Transfer Data",
                message: `No matching document found for costume ID ${id} and cupboard ID ${cpid}`,
                details: { statusCode: 404, additionalInfo: "No document matched the update criteria" },
            });

            return res.status(404).json({ error: "No document found with the given id" });
        }
    } catch (err) {
        console.error(err);

        await Log.create({
            timestamp: new Date(),
            level: "error",
            service: "DataTransfer",
            action: "Transfer Data",
            message: "Internal server error during data transfer",
            details: { statusCode: 500, additionalInfo: err.message },
        });

        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};
exports.searchCostume = async (req, res) => {

    try {
        const { query } = req.query;
        const searchResult = await Details.find({
            $or: [
                { costumename: { $regex: query, $options: 'i' } },
                { catagory: { $regex: query, $options: 'i' } },
            ]
        })

        res.json({ success: true, data: searchResult });



    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err })
    }



}

exports.addToCart = async (req, res) => {


    const { id, ids, userphonenumber } = req.body;
    console.log(userphonenumber)

    if (!userphonenumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
        return res.status(400).json({ message: "No costume IDs provided" });
    }

    try {
        let cart = await Cart.findOne({ phonenumber: userphonenumber });
        // console.log(cart)
        if (!cart) {
            // **Agar cart exist nahi karta, naya cart banao user ke phonenumber ke saath**
            cart = new Cart({ phonenumber: userphonenumber, costumes: [] });
        }

        if (id) {
            // **Single item processing**
            const costume = await Details.findOne({ id: id });

            if (!costume) return res.status(404).json({ message: "Costume Not Found" });
            if (costume.quantity <= 0) return res.status(400).json({ message: "Costume is out of stock" });

            const existingItemIndex = cart.costumes.findIndex(item => item.id === id);

            if (existingItemIndex !== -1) {
                cart.costumes[existingItemIndex].quantity += 1;
            } else {
                cart.costumes.push({ id: id, quantity: 1 });
            }
            costume.quantity -= 1;
            await costume.save();

            getIO().emit("updateCostumeQuantity", { id: costume.id, newQuantity: costume.quantity, status: costume.status });
        }

        if (ids) {
            // **Multiple items processing**
            const costumes = await Details.find({ id: { $in: ids } });

            if (costumes.length === 0) return res.status(404).json({ message: "No valid costumes found" });

            for (const costume of costumes) {
                if (costume.quantity <= 0) return res.status(400).json({ message: `Costume ${costume.id} is out of stock` });

                const existingItemIndex = cart.costumes.findIndex(item => item.id === costume.id);

                if (existingItemIndex !== -1) {
                    cart.costumes[existingItemIndex].quantity += 1;
                } else {
                    cart.costumes.push({ id: costume.id, quantity: 1 });
                }
                costume.quantity -= 1;
                await costume.save();

                getIO().emit("updateCostumeQuantity", { id: costume.id, newQuantity: costume.quantity });
            }
        }

        await cart.save();

        // Fetch updated cart details
        const cartId = cart._id;
        const costumeIds = cart.costumes.map(item => item.id);
        const costumeDetails = await Details.find({ id: { $in: costumeIds } });

        const mergedCart = costumeDetails.map(costume => {
            const cartItem = cart.costumes.find(item => item.id === costume.id);
            return {
                ...costume.toObject(),
                quantity: cartItem ? cartItem.quantity : 1
            };
        });

        // Emit updated cart details via Socket.IO
        getIO().emit("CartDetails", { success: true, cartId, message: mergedCart,userphonenumber });

        res.json({ success: true, message: `${id ? "1" : ids.length} costume(s) added to cart` });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error adding costume(s) to cart" });
    }
};
exports.removeToCart = async (req, res) => {
    try {
        const { id,userphonenumber } = req.body;
       
        // Find the cart
        let cart = await Cart.findOne({phonenumber:userphonenumber});
        if (!cart) {
            return res.json({ message: "Cart is not available" });
        }

        // Check if the item exists in the cart
        const itemIndex = cart.costumes.findIndex((prv) => prv.id === id);
        if (itemIndex === -1) {
            return res.json({ message: "Costume not in cart" });
        }

        // Get the quantity of the item being removed
        const removedItem = cart.costumes[itemIndex];
        const removedQuantity = removedItem.quantity || 1; // Default to 1 if quantity is undefined

        // Remove the item from the cart
        cart.costumes = cart.costumes.filter((prv) => prv.id !== id);

        // Find the costume in Details collection
        const costume = await Details.findOne({ id });
        if (costume) {
            costume.quantity += removedQuantity; // Add back the quantity
            await costume.save();
        }

        // Save the updated cart
        await cart.save();
        getIO().emit("removeToCart", { success: true,removedQuantity:removedQuantity, message: id,userphonenumber,status:"In Stock"})
        res.json({ success: true, message: "Costume removed from cart and quantity updated" });




    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err })
    }
}
exports.getCartDetails = async (req, res) => {
    try {
        let cart = await Cart.findOne();
        if (!cart || cart.costumes.length === 0) {
            return res.json({ message: "Cart is Empty" });
        }

        const cartId = cart._id;

        // Extract costume IDs from the cart
        const costumeIds = cart.costumes.map(item => item.id);

        // Fetch costume details from the Details model
        const costumeDetails = await Details.find({ id: { $in: costumeIds } });

        // Merge costume details with their respective quantities from the cart
        const mergedCart = costumeDetails.map(costume => {
            const cartItem = cart.costumes.find(item => item.id === costume.id);
            return {
                ...costume.toObject(), // Convert Mongoose object to plain object
                quantity: cartItem ? cartItem.quantity : 1 // Assign quantity from cart
            };
        });


        res.json({ success: true, cartId: cartId, message: mergedCart });


    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err });
    }
}
exports.getCostumeById = async (req, res) => {

    try {
        const { id } = await req.params;

        const costumeById = await Details.findOne({ id: id });

        if (!costumeById) {
            return res.json({ message: "Costume Not found" });
        }

        res.json({ success: true, data: costumeById });



    } catch (err) {
        console.log(err);
        res.json({ success: false })

    }

}
exports.assignTo = async (req, res) => {
    try {

        const { cartId, personname, contact, Refrence, deadline,userphonenumber} = req.body;

        const cart = await Cart.findById(cartId)
        if (!cart) return res.status(404).json({ message: "Cart not exits" })

        const assignedCart = new AssignedTo({
            costumes: cart.costumes,
            assignedTo: { personname, contact, Refrence, deadline: new Date(deadline) },

        })
        await assignedCart.save();

        await Cart.findByIdAndDelete(cartId);
        getIO().emit("GiveOther", { success: true,userphonenumber });
        res.json({ success: true, message: "Costumes assigned with deadline" })


    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
}
exports.getHolders = async (req, res) => {


    try {
        const allDetails = await AssignedTo.find();
        if (!allDetails || allDetails.length === 0) {
            return res.json({ message: "Not Available any holder" });
        }

        let holderDetails = allDetails.map((e) => ({
            id: e._id,
            assignedTo: e.assignedTo
        }));

        res.status(200).json({ success: true, data: holderDetails });

    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

}

exports.incrementQuantity = async (req, res) => {

    try {

        const { id, quantity,userphonenumber } = req.body;
        const costume = await Details.findOne({ id: id });
        if (!costume) {
            return res.json({ message: "Costume Not Found" });
        }
        if (costume.quantity <= 0) {
            return res.json({ message: "Costume is out of stock" });
        }

        let cart = await Cart.findOne({phonenumber:userphonenumber})
        if (!cart) {
            return res.json({ message: "cart not found" });
        }
        const itemIndex = cart.costumes.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return res.json({ message: "Not found item in cart" })
        }
        cart.costumes[itemIndex].quantity = quantity;
        costume.quantity -= 1;
        await costume.save();
        await cart.save();
        getIO().emit("incrementQuantity", { id, quantity,userphonenumber })
        res.status(200).json({ success: true, message: "Quantity increment" });



    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false })
    }

}
exports.decrementQuantity = async (req, res) => {

    try {

        const { id, quantity,userphonenumber } = req.body;
        const costume = await Details.findOne({ id: id });
        if (!costume) {
            return res.json({ message: "Costume Not Found" });
        }
        // if (costume.quantity <= 0) {
        //     return res.json({ message: "Costume is out of stock" });
        // }

        let cart = await Cart.findOne({phonenumber:userphonenumber})
        if (!cart) {
            return res.json({ message: "cart not found" });
        }
        const itemIndex = cart.costumes.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return res.json({ message: "Not found item in cart" })
        }
        if (cart.costumes[itemIndex].quantity === 1) {
            return res.json({ message: "Costume require one if want delte directly remove it " });
        }
        cart.costumes[itemIndex].quantity = quantity;
        costume.quantity += 1;
        await costume.save();
        await cart.save();
        getIO().emit("decrementQuantity", { id, quantity,userphonenumber })
        res.status(200).json({ success: true, message: "Quantity decremented" });

    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false })
    }

}


exports.getAssignedDetailsById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const assignedUser = await AssignedTo.findById(id);

        if (!assignedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: assignedUser
        });
    } catch (error) {
        console.error("Error fetching assigned details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteHolderDetails = async (req, res) => {
    try {
        const { holderId } = req.body;
        if (!holderId) {
            return res.status(400).json({ message: "Id must be required" });
        }

        // Find the assigned holder before deleting
        const assignedHolder = await AssignedTo.findById(holderId);
        if (!assignedHolder) {
            return res.status(400).json({ message: "Holder not found" });
        }

        // Restore costumes back to Details collection
        for (const costume of assignedHolder.costumes) {


            if (costume.status === "not returned" || costume.status === "partially returned") {
                return res.status(400).json({ success: true, message: "Please first take the Costume then after delete" });
            }
        }

        // Delete the assigned holder
        const isDelete = await AssignedTo.findByIdAndDelete(holderId);
        if (!isDelete) {
            return res.json({ message: "Data cannot be deleted" });
        }

        return res.json({ success: true, message: "Holder Deleted and Costumes Restored" });

    } catch (error) {
        console.error("Error:", error);
        return res.json({ success: false, error: error.message });
    }

}

exports.updateHolderDetails = async (req, res) => {

    try {

        const { holderId, phonenumber, deadline } = req.body;
        if (!holderId) {
            return res.json({ message: "Id must be required" });
        }
        const updatedHolder = await AssignedTo.findByIdAndUpdate(
            holderId,
            {
                $set: {
                    "assignedTo.contact": phonenumber,
                    "assignedTo.deadline": deadline
                }
            },
            { new: true } // This returns the updated document
        );
        if (!updatedHolder) {
            return res.json({ message: "Holder not available" });
        }

        return res.json({ success: true, message: "Holder details updated" });


    } catch (error) {
        return res.json({ success: false });
    }


}

exports.updateReturnStatus = async (req, res) => {
    try {
        const { holderId, holderName, costumes,holderphonenumber } = req.body;
        if (!holderId || !Array.isArray(costumes) || costumes.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid request data" });
        }

        const assigned = await AssignedTo.findById(holderId);
        if (!assigned) {
            return res.status(404).json({ success: false, message: "Holder not found" });
        }

        const damagedCostumes = [];
        const lostCostumes = [];

        // ✅ Use for...of to properly handle async/await
        for (const costumeData of costumes) {
            const costumeIndex = assigned.costumes.findIndex(c => c.id === costumeData.id);
            if (costumeIndex !== -1) {
                const costume = assigned.costumes[costumeIndex];

                costume.good = costumeData.returnQuantities.good;
                costume.damaged = costumeData.returnQuantities.damaged;
                costume.lost = costumeData.returnQuantities.lost;
                costume.pending = costumeData.returnQuantities.pending;

                // ✅ Find and update the Details collection properly
                const cos = await Details.findOne({ id: costume.id });
                if (cos) {
                    if (costume.good > 0) {
                        cos.quantity += costume.good;
                        await cos.save(); // ✅ Save only if found
                    }
                }

                // ✅ Update costume status
                const totalReturned = costume.good + costume.damaged + costume.lost;
                if (costume.pending > 0) {
                    costume.status = "partially returned";
                } else if (totalReturned === costume.quantity) {
                    costume.status = "returned";
                } else {
                    costume.status = "partially returned";
                }

                // Store damaged costumes
                if (costume.damaged > 0) {
                    damagedCostumes.push({
                        id: costume.id,
                        quantity: costume.damaged,
                        cosumername: holderName,
                    });
                }

                // Store lost costumes
                if (costume.lost > 0) {
                    lostCostumes.push({
                        id: costume.id,
                        quantity: costume.lost,
                        cosumername: holderName,
                        phonenumber:holderphonenumber,
                    });
                }
            }
        }


        console.log(holderphonenumber)

        // ✅ Save assigned only after all updates
        await assigned.save();

        // ✅ Store damaged and lost costumes in the database
        if (damagedCostumes.length > 0) {
            await Damaged.insertMany(damagedCostumes);
        }

        if (lostCostumes.length > 0) {
            await Lost.insertMany(lostCostumes);
        }

        // ✅ Emit updated costumes with status
        const updatedCostumes = assigned.costumes.map(costume => ({
            id: costume.id,
            good: costume.good,
            damaged: costume.damaged,
            lost: costume.lost,
            pending: costume.pending,
            status: costume.status
        }));

        getIO().emit("updateCostumeStatus", { holderId, costumes: updatedCostumes });

        res.status(200).json({ success: true, message: "Successfully updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.getDamagedCostumes = async (req, res) => {
    try {

        const damagedCostumes = await Damaged.find();

        const Costumes = await Promise.all(damagedCostumes.map(async (e) => {

            const costume = await Details.findOne({ id: e.id })

            return {
                id: e._id,
                cid: e.id,
                cosumername: e.cosumername,
                status: e.status,
                inrepairedquantity: e.inrepairedquantity,
                repairedquantity: e.repairedquantity,
                fileUrl: costume.fileUrl,
                costumename: costume.costumename,
                catagory: costume.catagory,
                description: costume.description,
                quantity: e.quantity,
                date: e.createdAt,
            };

        }))
        

        res.status(200).json({ success: true, Costumes })
    } catch (error) {
        console.log(error)
        res.json({ success: false,message:error })
    }
}
exports.getLostCostumes = async (req, res) => {
    try {

        const LostCostumes = await Lost.find();

        const Costumes = await Promise.all(LostCostumes.map(async (e) => {

            const costume = await Details.findOne({ id: e.id })

            return {
                id: e._id,
                cid: e.id,
                cosumername: e.cosumername,
                status:e.status,
                fileUrl: costume.fileUrl,
                costumename: costume.costumename,
                catagory: costume.catagory,
                description: costume.description,
                phonenumber: e.phonenumber || 1234567890,
                quantity: e.quantity,
                recived:e.recived,
                damaged:e.damaged,
                date: e.createdAt,
            };

        }))

        res.status(200).json({ success: true, Costumes })
    } catch (error) {
        res.json({ success: false })
    }
}