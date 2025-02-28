const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login, getUserDetails, deleteUserDetailsById, logOut } = require('../controllers/clientController');
const authProtected = require('../middlewares/authProtected.middleware');

connectDb();
router.post('/signup',signup);
router.post('/login', login);
router.get('/userDetails',getUserDetails);
router.post('/logout',authProtected,logOut)
router.delete('/deleteUserDetails',deleteUserDetailsById);
module.exports = router;
