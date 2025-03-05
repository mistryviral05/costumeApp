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
    cleanedQuantity: {  // Number of costumes cleaned so far
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
        default: "Not Cleaned",
        enum: ["Not Cleaned", "Partially Cleaned", "Fully Cleaned"],
    },


    date: { type: Date, default:Date.now, }



});

//Export the model
module.exports = mongoose.model('Washing', userSchema);