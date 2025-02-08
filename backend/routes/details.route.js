const express = require('express')
const router = express.Router();
const connectDb = require('../db/connectDb')
const detailControllers = require("../controllers/detailsController")
connectDb();


router.post('/addCostume', detailControllers.addCostume)
router.delete('/deleteCostume/:id',detailControllers.deleteCostumeById )


router.get('/getCostume/:cpid', detailControllers.getCostumeById )
router.get('/getCostume', detailControllers.getCostume)
router.put('/updateCostume',detailControllers.updateCostume )

router.put('/trasferCostume', detailControllers.trasferCostume)



module.exports = router;