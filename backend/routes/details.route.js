const express = require('express')
const router = express.Router();
const connectDb = require('../db/connectDb')
const detailControllers = require("../controllers/detailsController")
connectDb();
router.post('/addCostume', detailControllers.addCostume);
router.delete('/deleteCostume/:id',detailControllers.deleteCostumeById );
router.get('/getCostume/:cpid', detailControllers.getCostumeByid );
router.get('/getCostume', detailControllers.getCostume);
router.get('/getCostumesCount',detailControllers.getCostumeCount);
router.get('/searchCostume',detailControllers.searchCostume);;
router.put('/updateCostume',detailControllers.updateCostume );
router.put('/trasferCostume', detailControllers.trasferCostume);
router.delete('/removeToCart',detailControllers.removeToCart);
router.get('/getCostumeById/:id',detailControllers.getCostumeById);
router.post('/assignTo',detailControllers.assignTo);
router.post('/addToCart',detailControllers.addToCart);
router.get('/getCartDetails',detailControllers.getCartDetails);
router.get('/getHolders',detailControllers.getHolders);
router.patch('/incrementQuantity',detailControllers.incrementQuantity);
router.patch('/decrementQuantity',detailControllers.decrementQuantity);
router.get('/getAssignedDetailsById/:id',detailControllers.getAssignedDetailsById);
router.get('/costumes/:id',detailControllers.getCostumeByCostumeId);
router.delete('/deleteHolderDetails',detailControllers.deleteHolderDetails);
router.put('/updateHolderDetails',detailControllers.updateHolderDetails);



module.exports = router;