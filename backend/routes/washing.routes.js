const express = require('express')
const { addWashingClothes,getWashingClothes, markAsClean, deleteWashingClothes, partialClean } = require('../controllers/washing.controller')
const router = express.Router()
    
router.post('/addWashingCostumes',addWashingClothes)
router.get('/getWashingCostumes',getWashingClothes)
router.put('/markAsClean',markAsClean)
router.delete('/deleteWashingClothe',deleteWashingClothes)
router.put('/partialClean',partialClean)

module.exports = router