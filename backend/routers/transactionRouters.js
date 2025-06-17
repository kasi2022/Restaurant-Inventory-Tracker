const express = require('express');
const router = express.Router();
const forecastController = require('../controller/trancationController')
router.post('/consume/:id', forecastController.logConsumption);
router.get('/forecast', forecastController.predictDepletion);
router.get('/restock-calendar', forecastController.generateRestockCalendar);
module.exports = router;
