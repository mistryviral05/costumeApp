
const bcrypt = require('bcrypt');
const Client = require('../models/Client');
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



exports.login = async(req,res)=>{

    const { email, password } = req.body;
        try {
    //   console.log(email,password)
    
            const isUsername = await Client.findOne({ email: email });
            if (!isUsername) {
                return res.json({ succes: false, message: "Username or password invalid" });
            }
    
            const isPassword = await bcrypt.compare(password, isUsername.password)
    
    
            if (!isPassword) {
                return res.json({ succes: false, message: "Username or password invalid" });
            }
            const clientToken = isUsername.generateAuthToken();
            res.cookie('token',clientToken);
          
            res.json({ succes: true, clientToken: clientToken });
    
    
        } catch (err) { console.log(err); return res.json({ succes: false, message: "error comes" }) }




}


exports.getUserDetails = async (req,res )=>{
    try {
        const userDetails  = await Client.find();
        if(!userDetails){
            return res.json({message: "Username or password invalid"})
        }
        return res.json({succes:true,message:userDetails});
    } catch (error) {
        return res.json({ succes: false}) 
    }
}