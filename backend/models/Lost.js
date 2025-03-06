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
    damaged:{
        type:Number,
        default:0
    },
    cosumername:{
        type:String,
    },
    phonenumber:{
        type:String,
    },
    status:{
        type:String,
        default:"Lost",
        enum:["Damaged","Lost","Restored"],
    },
    createdAt: {
        type: Date,
        default: Date.now
       
    }
});

//Export the model
module.exports = mongoose.model('Lost', lostSchema);