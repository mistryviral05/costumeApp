const express = require('express');
const router = express.Router();
const cupboardControllers = require('../controllers/cupboardController')
const connectDb = require('../db/connectDb')
connectDb();


router.post('/addCupboard',cupboardControllers.addCupboard )
router.get('/getCupboard',cupboardControllers.getCupboard )

router.put('/updateCupboard',cupboardControllers.updateCupboard)



router.delete('/deleteCupboard/:id',cupboardControllers.deleteCupboards)

module.exports = router;