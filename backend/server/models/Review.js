// server/models/Review.js
const mongoose = require('mongoose');
const mongooseTypes = mongoose.Schema.Types;

let ReviewSchema = new mongoose.Schema(
    {
        rating: Number,
        reviewer: Number,
        reviewee: Number
    }
);

ReviewSchema.methods.getReview = function (_event) {
    Review.find({'event': _event}).then((review) => {
        return review;
    })
};

module.exports = mongoose.model('Review', ReviewSchema);
