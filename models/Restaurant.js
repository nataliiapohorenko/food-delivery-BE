const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    imgUrl: { 
        type: String 
    },
    categories: [
        { 
            type: String 
        }
    ],
    delivery: {
        cost: { 
            type: Number, 
            required: true 
        },
        time: { 
            type: Number, 
            required: true 
        }
    },
    feedbacks: { 
        type: Number, 
        default: 0 
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    isFavourite: { 
        type: Boolean, 
        default: false 
    },
    verified: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);