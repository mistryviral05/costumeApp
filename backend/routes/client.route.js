const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login, getUserDetails } = require('../controllers/clientController');

connectDb();
router.post('/signup',signup);
router.post('/login', login);
// router.post('/logout',logOut)
router.get('/userDetails',getUserDetails);
module.exports = router;
