const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name:{type:String,require:true},
    username: {type:String,require:true},
    email: {type:String,require:true},
    phonenumber:{type:String,require:true},
    password: {type:String,require:true},
    date: {
        type: String,
        default: () => new Date().toISOString(), 
    },
});

module.exports = mongoose.model('Users', UserSchema);