const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({

    phonenumber:{
        type:String,
        required: true,
        unique: true,

    },

    costumes: [
        {
            id: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1, 
                min: 1, 
            },
            addedAt: {
                type: Date,
                default: Date.now,
            }
        },

    ],

  
    date: {
        type: String,
        default: () => new Date().toISOString(),
    },

});
module.exports = mongoose.model('Cart', userSchema);