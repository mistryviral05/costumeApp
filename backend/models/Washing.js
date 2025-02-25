const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({


    id: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    status:{
        type:String,
        default:"Not cleaned",
    },


    date: { type: Date, default:Date().now, }



});

//Export the model
module.exports = mongoose.model('Washing', userSchema);