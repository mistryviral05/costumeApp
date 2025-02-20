const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login, logOut } = require('../controllers/userController');
connectDb();
router.post('/signup',signup);
router.post('/login', login)
router.post('/logout',logOut)
module.exports = router;
