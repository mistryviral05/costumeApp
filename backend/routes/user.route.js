const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login, logOut, getAdminDetails } = require('../controllers/userController');
const { authProtectedAdmin } = require('../middlewares/authProtected.middleware');
connectDb();
router.post('/signup',signup);
router.post('/login', login)
router.post('/logout',logOut)
router.get('/getAdminDetails',authProtectedAdmin,getAdminDetails)
module.exports = router;
