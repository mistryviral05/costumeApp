const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectDb');
const { signup, login } = require('../controllers/userController');

connectDb();

router.post('/signup',signup);


router.post('/login', login)



module.exports = router;
