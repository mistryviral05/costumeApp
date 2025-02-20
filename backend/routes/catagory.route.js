const express = require('express');
const { addCatagory, getCatagories, deleteCatagoryById, updateCatagory } = require('../controllers/catagoryController');
const router = express.Router();


router.post('/addCatagory',addCatagory);
router.get('/getCatagory',getCatagories);
router.delete('/deleteCatagory/:id',deleteCatagoryById)
router.put('/updateCatagory',updateCatagory)




module.exports = router;