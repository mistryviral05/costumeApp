const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DetailsSchema = new Schema({
    cpid:String,
    id: String,
    costumename: String,
    description: String,
    fileUrl:String,
    date: {
        type: String,
        default: () => new Date().toISOString(), 
    },
});

module.exports = mongoose.model('Details', DetailsSchema);