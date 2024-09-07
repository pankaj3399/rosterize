const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name for this plan.'],
        },
    range: {
        type: String,
        required: [true, 'Please provide a range for this plan.'],
        },
    cost: {
        type: String,
        required: [true, 'Please provide a cost for this plan.'],
        },
    createdAt: {
        type: Date,
        default: Date.now
        },
    updatedAt: {
        type: Date,
        default: Date.now
        }
    }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;