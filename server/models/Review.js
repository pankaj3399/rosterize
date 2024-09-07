const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user for this review.'],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide a company for this review.'],
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for this review.'],
    },
    review: {
        type: String,
        required: [true, 'Please provide a review.'],
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        min: [1, 'Rating must be at least 1.'],
        required: [true, 'Please provide a rating.'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: [true, 'Please provide a status for this review.'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;