const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CupboardSchema = new Schema({
    id: String,
    name: String,
    date: {
        type: String,
        default: () => new Date().toISOString(), // ISO string format for consistent results
    },
});

module.exports = mongoose.model('Cupboard', CupboardSchema);
