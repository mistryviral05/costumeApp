const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login, getUserDetails, deleteUserDetailsById, logOut, getUserDetailsById, getCartDetailsById, changePassword, forgotPass, verifyOtp } = require('../controllers/clientController');
const authProtected = require('../middlewares/authProtected.middleware');

connectDb();
router.post('/signup',signup);
router.post('/login', login);
router.get('/userDetails',getUserDetails);
router.post('/logout',authProtected.authProtected,logOut)
router.delete('/deleteUserDetails',deleteUserDetailsById);
router.get('/getClientById',authProtected.authProtected,getUserDetailsById);
router.get('/getCartDetails/:phonenumber',getCartDetailsById)
router.post('/changePassword',authProtected.authProtected,changePassword)
router.post('/forgotPass',forgotPass)
router.post('/verifyOtp',verifyOtp)
module.exports = router;
