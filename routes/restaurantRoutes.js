const express = require('express');
const restaurantController = require('../controllers/restaurantController');

const router = express.Router();

router.get('/restaurants', restaurantController.getRestaurants);

router.get('/restaurants/:id', restaurantController.getRestaurant);

router.get('/food-items', restaurantController.getFoodItems);

router.get('/food-items/:id', restaurantController.getFoodItem);

module.exports = router;
