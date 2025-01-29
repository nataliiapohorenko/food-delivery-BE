const express = require('express');
const restaurantController = require('../controllers/restaurantController');

const router = express.Router();

router.get('/restaurants', restaurantController.getRestaurants);

module.exports = router;
