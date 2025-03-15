const User = require('../models/User');
const bcrypt = require('bcrypt');
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
}
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {


        const isUsername = await User.findOne({ username: username }).select('+password');
        if (!isUsername) {
            return res.status(400).json({ succes: false, error: "Username or password invalid" });
        }

        const isPassword = await bcrypt.compare(password, isUsername.password)


        if (!isPassword) {
            return res.status(400).json({ succes: false, error: "Username or password invalid" });
        }
        const token = isUsername.generateAuthToken();
        res.cookie('token',token);
      
        res.json({ succes: true, token: token })


    } catch (err) { console.log(err); return res.json({ succes: false, message: "error comes" }) }



}
exports.logOut = async (req, res) => {

    try {
        res.clearCookie('token')
     
        res.json({ success: true, message: "Logged out successfully" });

    } catch (err) {
        res.json({ success: false });
    }

}
exports.getAdminDetails = async(req,res)=>{
    res.status(200).json({success:true,message:req.admin})
}