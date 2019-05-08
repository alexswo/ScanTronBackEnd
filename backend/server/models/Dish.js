// server/models/Dish.js
const mongoose = require('mongoose');
const mongooseTypes = mongoose.Schema.Types;

let DishSchema = new mongoose.Schema(
    {
        name: {
            type: mongooseTypes.String,
            required: true,
        },
        tags: {
            type: [{
                tag: mongooseTypes.String
            }],
            required: true,
        },
    }
);

DishSchema.methods.getSchema = function (_name) {
    Event.find({'name': _name}).then((dish) => {
        return dish
    })
};

module.exports = mongoose.model('Dish', DishSchema);
