const express = require('express');
const router = express.Router();
const User = require('../models/User');
const connectDb = require('../db/connectDb');
const bcrypt = require('bcrypt');

connectDb();

router.post('/', async (req, res) => {
    try {
        const data = req.body; // No need to await here
      

        if (!data) {
            return res.json({ message: "Please enter the data" });
        }

        const { password, cpassword, username, name, email, phonenumber } = data;

        if (password !== cpassword) {
            return res.json({ message: "Passwords do not match" });
        }

        const isUsername = await User.findOne({ username });
        if (isUsername) {
            return res.json({ message: "Invalid User" });
        }

        // Use await to hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            phonenumber,
            password: hashPassword,
        });

        await newUser.save();
        res.json({ success: true, message: "User created" });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error occurred" });
    }
});

module.exports = router;
