
const bcrypt = require('bcrypt');
const Client = require('../models/Client');
const BlackListToken = require('../models/BlackListToken');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.json({ message: "Please enter the data" });
        }

        const { password, cpassword, username, name, email, phonenumber } = data;
        if (password !== cpassword) {
            return res.json({ message: "Passwords do not match" });
        }

        const isUsername = await Client.findOne({ username });
        if (isUsername) {
            return res.json({ message: "Invalid User" });
        }

        // Use await to hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new Client({
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
}
exports.login = async (req, res) => {

    const { email, password } = req.body;
    try {
        //   console.log(email,password)
        const isUsername = await Client.findOne({ email: email });

        if (!isUsername) {
            return res.status(400).json({ error: "Username or password invalid" }); 
        }

        const isPassword = await bcrypt.compare(password, isUsername.password);

        if (!isPassword) {
            return res.status(400).json({ error: "Username or password invalid" }); 
        }

        const clientToken = isUsername.generateAuthToken();
        res.cookie("token", clientToken);

        res.json({ success: true, clientToken: clientToken });



    } catch (err) { console.log(err); return res.json({ succes: false, message: "error comes" }) }




}
exports.getUserDetails = async (req, res) => {
    try {
        const userDetails = await Client.find();
        if (!userDetails) {
            return res.json({ message: "Username or password invalid" })
        }
        return res.json({ succes: true, message: userDetails });
    } catch (error) {
        return res.json({ succes: false })
    }
}
exports.deleteUserDetailsById = async (req, res) => {

    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ message: 'Id must be required' });
        }
        const user = await Client.findById(id);
        if (!user) {
            return res.json({ message: "Invalid" });
        }
        await Client.findByIdAndDelete(id);
        return res.json({ succes: true, message: "success full deleted" });
    } catch (error) {
        return res.json({ succes: false })
    }
}
exports.logOut = async (req, res) => {
    try {
        res.clearCookie("clientToken")
        const clientToken = req.cookies.token || req.headers.authorization.split(' ')[1];
        // console.log(clientToken)
        await BlackListToken.create({ token: clientToken });
        res.json({ success: true, message: "Logout" })
    } catch (error) {
        res.json({ success: false })
    }
}