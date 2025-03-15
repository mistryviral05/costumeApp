const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailsSchema = new Schema({
    cpid: String,
    id: String,
    cpname: String,
    catagory: String,
    place: String,
    costumename: String,
    description: String,
    fileUrl: String,
    quantity: { type: Number, required: true },
    status: { type: String, default: "In Stock" },
    date: {
        type: String,
        default: () => new Date().toISOString(),
    },
});

// Pre-hook for findOneAndUpdate (handles $inc and direct updates)
DetailsSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const update = this.getUpdate();
        const doc = await this.model.findOne(this.getQuery());

        if (!doc) {
            console.log('Document not found');
            return next();
        }

        let newQuantity = doc.quantity;

        // Handle $inc updates
        if (update.$inc && update.$inc.quantity !== undefined) {
            newQuantity += update.$inc.quantity;
        }
        // Handle direct quantity updates
        else if (update.quantity !== undefined) {
            newQuantity = Number(update.quantity);
        }

        // Update status if quantity changes
        if (newQuantity !== doc.quantity) {
            const newStatus = newQuantity <= 0 ? "Out of Stock" : "In Stock";
            this.setUpdate({
                ...update,
                quantity: newQuantity,
                status: newStatus,
            });
        }

        next();
    } catch (error) {
        console.error('Error in findOneAndUpdate pre-hook:', error);
        next(error);
    }
});

// Pre-hook for save (handles a.quantity += e.quantity)
DetailsSchema.pre('save', function(next) {
    try {
        // Check if quantity has been modified
        if (this.isModified('quantity')) {
            this.status = this.quantity <= 0 ? "Out of Stock" : "In Stock";
        }
        next();
    } catch (error) {
        console.error('Error in save pre-hook:', error);
        next(error);
    }
});

module.exports = mongoose.model('Details', DetailsSchema);