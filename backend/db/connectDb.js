const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const connectDb = async () => {
    const dbName = 'costumes';
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDb;