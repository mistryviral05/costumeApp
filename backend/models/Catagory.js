const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
   catagory:{
    type:String
   },
   date: {
    type: String,
    default: () => new Date().toISOString(), 
},
});

//Export the model
module.exports = mongoose.model('Catagory', userSchema);