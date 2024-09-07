const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    // name, email, company, subject, message
    name: {
        type: String,
        required: [true, 'Please provide a name for this enquiry.'],
        },
    email: {
        type: String,
        required: [true, 'Please provide an email for this enquiry.'],
        },
    company: {
        type: String,
        required: [true, 'Please provide a company for this enquiry.'],
        },
    subject: {
        type: String,
        required: [true, 'Please provide a subject for this enquiry.'],
        },
    message: {
        type: String,
        required: [true, 'Please provide a message for this enquiry.'],
        },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: [true, 'Please provide a status for this enquiry.'],
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

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;