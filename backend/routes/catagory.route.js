const express = require('express');
const { addCatagory, getCatagories } = require('../controllers/catagoryController');
const router = express.Router();


router.post('/addCatagory',addCatagory);
router.get('/getCatagory',getCatagories);




module.exports = router;