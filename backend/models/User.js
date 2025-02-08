const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

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


UserSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({ username: this.username, email: this.email, name: this.name }, process.env.JWT_SECRET, { expiresIn: '1h' })

    return token

}

module.exports = mongoose.model('Users', UserSchema);