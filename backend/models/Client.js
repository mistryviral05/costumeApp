const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    name:{type:String,required:true},
    username: {type:String,required:true},
    email: {type:String,required:true},
    phonenumber:{type:String,required:true},
    password: {type:String,required:true,select:false},
    date: {
        type: String,
        default: () => new Date().toISOString(), 
    },
});


UserSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({  _id: this._id  }, process.env.JWT_SECRET, { expiresIn: '24h' })

    return token

}

module.exports = mongoose.model('Client', UserSchema);