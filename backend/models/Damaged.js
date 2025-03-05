const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const damagedSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    inrepairedquantity:{
        type:Number,
        default:0,
    },
    repairedquantity:{
        type:Number,
        default:0,
    },
    cosumername:{
        type:String,
    },
    status:{
        type:String,
        default:"Damaged",
        enum:["Damaged","In Repair","Repaired"],
    },
    createdAt: {
        type: Date,
        default: Date.now
       
    }
});

// Export the model
module.exports = mongoose.model('Damaged', damagedSchema);