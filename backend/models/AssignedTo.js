const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    costumes: [
        {
            id: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 0,
            },
            good:{
                type:Number
            },
            damaged:{
                type:Number
            },
            lost:{
                type:Number
            },
            pending:{
                type:Number
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["not returned", "partially returned", "returned"],
                default: "not returned",
            },
        },
    ],
    assignedTo: {
        personname: { type: String },
        contact: { type: String },
        Refrence: { type: String },
        deadline: {
            type: Date,
        },
    },
    date: {
        type: String,
        default: () => new Date().toISOString(),
    },
});




module.exports = mongoose.model('AssignedTo', userSchema);
