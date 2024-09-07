const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide a user for this notification.'],
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Please provide a company for this notification.'],
        },
        message: {
            type: String,
            required: [true, 'Please provide a message.'],
        },
        read: {
            type: Boolean,
            default: false
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

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;