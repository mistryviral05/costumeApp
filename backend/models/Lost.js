const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const lostSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    recived:{
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

//Export the model
module.exports = mongoose.model('Lost', lostSchema);