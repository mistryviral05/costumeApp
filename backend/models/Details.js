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
    status: { type: String, default: "In Stock" }, // Default status
    date: {
        type: String,
        default: () => new Date().toISOString(),
    },
});

// Middleware to update status before saving
DetailsSchema.pre('findOneAndUpdate', async function (next) {
    let update = this.getUpdate();

    if (update.$inc && update.$inc.quantity !== undefined) {
        const doc = await this.model.findOne(this.getQuery()); // Fetch current document
        if (!doc) return next(); // If document not found, skip update

        const newQuantity = doc.quantity + update.$inc.quantity; // Compute new quantity
        update.status = newQuantity === 0 ? "Out of Stock" : "In Stock"; // Update status

        this.setUpdate(update);
    }

    next();
});


// Middleware to update status when quantity is updated using findOneAndUpdate
DetailsSchema.pre('findOneAndUpdate', function (next) {
    let update = this.getUpdate();

    if (update.quantity !== undefined) {
        // Fetch the new quantity value correctly
        if (update.$inc && update.$inc.quantity !== undefined) {
            update.quantity = (this._update.quantity || 0) + update.$inc.quantity;
        }

        this.setUpdate({
            ...update,
            status: update.quantity === 0 ? "Out of Stock" : "In Stock", // ✅ Ensure status is updated
        });
    }
    next();
});


module.exports = mongoose.model('Details', DetailsSchema);
