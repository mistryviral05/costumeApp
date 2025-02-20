const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({


    costumes: [
        {
            id: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1, // Default quantity set to 1
                min: 1, // Ensures quantity is at least 1
            },
            addedAt: {
                type: Date,
                default: Date.now,
            }
        },

    ],

    assignedTo: {
        personname: { type: String },
        email: { type: String },
        contact: { type: String },
        address: { type: String },
        deadline: {
            type: Date
        },
    },


    date: {
        type: String,
        default: () => new Date().toISOString(),
    },

});
module.exports = mongoose.model('AssignedTo', userSchema);