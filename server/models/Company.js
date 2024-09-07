const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name for this company.'],
        },
    address: {
        type: String,
        required: [true, 'Please provide an address for this company.'],
        },
    phone: { 
        type: String,
        required: [true, 'Please provide a phone number for this company.'],
        },
    UEN: {
        type: String,
        unique: true,
        required: [true, 'Please provide a UEN for this company.'],
        },
    // employeeCount: {
    //     type: String,
    //     enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'],
    //     required: [true, 'Please provide an employee count for this company.'],
    //     },
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: [true, 'Please provide a subscription plan for this company.'],
    },
    industry: {
        type: String,
        required: [true, 'Please provide an industry for this company.'],
        },
    website: {
        type: String,
        },
    message: {
        type: String,
        required: [true, 'Please provide a message for this company.'],
        },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user who created this company.'],
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        required: [true, 'Please provide a status for this company.'],
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;