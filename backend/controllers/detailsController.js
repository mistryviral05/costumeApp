const Details = require('../models/Details')
const Cupboard = require('../models/Cupboard');
const Catagory = require('../models/Catagory')
const path = require('path')
const fs = require('fs');
const Cart = require('../models/Cart');
const AssignedTo = require('../models/AssignedTo');

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
            quantity:data.quantity,
        });
        await newDetails.save();
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
}
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

    const { id } = req.body;

    try {
        const costume = await Details.findOne({ id: id });
        if (!costume) {
            return res.json({ message: "Costume Not Found" });
        }
        if (costume.quantity <= 0) {
            return res.json({ message: "Costume is out of stock" });
        }
    
    
        let cart = await Cart.findOne();
        // let assignedTo = await AssignedTo.find();
    
        if (!cart) {
            cart = new Cart({ costumes: [] });
        }
    
        // Check if the costume is already in the cart
        const existingItemIndex = cart.costumes.findIndex((item) => item.id === id);
    
        // Check if the costume is already assigned to another person
        // const alreadyGivenPerson = assignedTo.some((person) =>
        //     person.costumes.some((prv) => prv.id === id)
        // );
    
        // if (alreadyGivenPerson) {
        //     return res.json({ message: "This costume is given to another person" });
        // }
    
        if (existingItemIndex !== -1) {
            // If item exists in cart, increase quantity
            cart.costumes[existingItemIndex].quantity += 1;

        } else {
            // If item does not exist, add it with quantity: 1
            cart.costumes.push({ id: id, quantity: 1 });
        }
        costume.quantity -= 1;
        await costume.save();
        await cart.save();
        res.json({ success: true, message: "Costume added to cart" });
    
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
    
}
exports.removeToCart = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the cart
        let cart = await Cart.findOne();
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

        const { cartId, personname, contact, email, address, deadline } = req.body;
        const cart = await Cart.findById(cartId)
        if (!cart) return res.status(404).json({ message: "Cart not exits" })
        const assignedCart = new AssignedTo({
            costumes: cart.costumes,
            assignedTo: { personname, contact, email, address,deadline: new Date(deadline) },
            
        })
        await assignedCart.save();

        await Cart.findByIdAndDelete(cartId);

        res.json({ success: true, message: "Costumes assigned with deadline" })


    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
}
exports.getHolders = async(req,res)=>{


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

exports.incrementQuantity = async(req,res)=>{

    try {

        const {id,quantity}= req.body;
        const costume = await Details.findOne({ id: id });
        if (!costume) {
            return res.json({ message: "Costume Not Found" });
        }
        if (costume.quantity <= 0) {
            return res.json({ message: "Costume is out of stock" });
        }
    
        let cart = await Cart.findOne()
        if(!cart){
            return res.json({message:"cart not found"});
        }
        const itemIndex = cart.costumes.findIndex(item=>item.id === id);
        if(itemIndex === -1){
            return res.json({message:"Not found item in cart"})
        }
        cart.costumes[itemIndex].quantity = quantity;
        costume.quantity -= 1;
        await costume.save();
        await cart.save();
        res.status(200).json({ success: true, message: "Quantity increment"});

    
        
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false})
    }

}
exports.decrementQuantity = async(req,res)=>{

    try {

        const {id,quantity}= req.body;
        const costume = await Details.findOne({ id: id });
        if (!costume) {
            return res.json({ message: "Costume Not Found" });
        }
        // if (costume.quantity <= 0) {
        //     return res.json({ message: "Costume is out of stock" });
        // }
    
        let cart = await Cart.findOne()
        if(!cart){
            return res.json({message:"cart not found"});
        }
        const itemIndex = cart.costumes.findIndex(item=>item.id === id);
        if(itemIndex === -1){
            return res.json({message:"Not found item in cart"})
        }
        if( cart.costumes[itemIndex].quantity === 1){
            return res.json({ message: "Costume require one if want delte directly remove it " });
        }
        cart.costumes[itemIndex].quantity = quantity;
        costume.quantity += 1;
        await costume.save();
        await cart.save();
        res.status(200).json({ success: true, message: "Quantity decremented"});
        
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false})
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

exports.deleteHolderDetails = async(req,res)=>{
    try {

        const {holderId}= req.body;
        if(!holderId){
            return res.json({message:"Id must be required"})
        }
       const isDelete =  await AssignedTo.findByIdAndDelete(holderId);

        if(!isDelete){
            return res.json({message:"Data can not be deleted"})
        }

        return res.json({success:true,message:"Holder Deleted"})


    } catch (error) {
        return res.json({success:false})
    }
}

exports.updateHolderDetails = async(req,res)=>{

    try {

        const {holderId,phonenumber,deadline}=req.body;
        if(!holderId){
            return res.json({message:"Id must be required"});
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
        
        return res.json({success:true,message:"Holder details updated"});

        
    } catch (error) {
        return res.json({success:false});
    }


}