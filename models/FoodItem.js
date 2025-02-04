const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: true 
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    feedbacks: { 
        type: Number, 
        default: 0 
    },
    imgUrl: { 
        type: String 
    },
    ingredients: [
        { 
            type: String 
        }
    ],
    restaurantId: { 
        type: String, 
        required: true, 
    },
    addons: [
        {
            name: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            countable: { 
                type: Boolean, 
                default: false 
            }
        }
    ]
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);