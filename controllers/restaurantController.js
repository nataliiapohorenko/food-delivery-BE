const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getRestaurant = async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const foodItems = await FoodItem.find({restaurantId});
        const restaurant = await Restaurant.findById(restaurantId);
        res.json({restaurant, foodItems});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getFoodItems = async (req, res, next) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({error});
    }
}

exports.getFoodItem = async (req, res, next) => {
    const itemId = req.params.id;
    try {
        const foodItem = await FoodItem.findById(itemId);
        res.json(foodItem);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}