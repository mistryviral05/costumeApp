
const bcrypt = require('bcrypt');
const Client = require('../models/Client');
const BlackListToken = require('../models/BlackListToken');
const Cart = require('../models/Cart');
const Details = require('../models/Details');
require('dotenv').config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const OTP = require('../models/OTP');

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
        const isUsername = await Client.findOne({ email: email }).select('+password');

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
exports.getUserDetailsById = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "User nathi maydo" })
    }

    res.status(200).json({ success: true, message: req.user });
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
exports.getCartDetailsById = async (req, res) => {

    try {
        const { phonenumber } = req.params;
        // console.log(phonenumber)
        let cart = await Cart.findOne({ phonenumber });
        if (!cart || cart.costumes.length === 0) {
            return res.json({ message: "Cart is Empty" });
        }

        const cartId = cart._id;

        // Extract costume IDs from the cart
        const costumeIds = cart.costumes.map(item => item.id);

        // Fetch costume details from the Details model
        const costumeDetails = await Details.find({ id: { $in: costumeIds } });

        // Merge costume details with their respective quantities from the cart
        const mergedCart = costumeDetails.map(costume => {
            const cartItem = cart.costumes.find(item => item.id === costume.id);
            return {
                ...costume.toObject(), // Convert Mongoose object to plain object
                quantity: cartItem ? cartItem.quantity : 1 // Assign quantity from cart
            };
        });


        res.json({ success: true, cartId: cartId, message: mergedCart });
        // res.status(200).json({success:true})


    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err });
    }

}
exports.changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ message: "Un Authorized" })
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "Old password and new password cannot same" })
        }
        if (newPassword < 6) {
            return res.status(400).json({ message: "password character must be 6 or more" })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New passwords do not match" })
        }

        const user = await Client.findById(userId).select("+password");
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save()

        res.status(200).json({ message: "Password Updated" })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }

}
exports.forgotPass = async (req, res) => {

    const { email } = req.body;


    try {

        
        if (!email) {
            res.status(400).json({ message: "Email required" })
        }
        const isAvailable = await Client.findOne({ email });
        if (!isAvailable) {
            res.status(400).json({ message: "Invalid Email" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await OTP.create({ email, otp, expiresAt });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // or your SMTP service provider
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "OTP Varification", // Subject line
            text: `You OTP is : ${otp},NOTE:Do not share this otp to others it is valid upto 1 minutes`,
        });


        res.status(200).json({ success: true, message: "Otp send in you email" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}
exports.verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "OTP required" })
        }
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ email, otp });
            return res.status(400).json({ message: "OTP expired" });
        }

        const generatePassword = () => {
            const length = 10; // Password length
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let password = "";
            for (let i = 0; i < length; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return password;
        };

        const randomPassword = generatePassword()
        const hashedPassword = await bcrypt.hash(randomPassword, 10); 

        await Client.findOneAndUpdate({ email }, { password: hashedPassword });
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // or your SMTP service provider
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "New Password Generated",
            text: `Your new password is: ${randomPassword}. Please change it after login. Do not share other`,
        });
        await OTP.deleteOne({ email, otp });
        res.status(200).json({ message: "OTP verified" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}