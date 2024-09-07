const monogoose = require('mongoose');

const leaveSchema = new monogoose.Schema({
    user: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user for this leave.'],
    },
    company: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide a company for this leave.'],
    },
    department: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Please provide a department for this leave.'],
    },
    leaveType: {
        type: String,
        enum: ['medical', 'annual'],
        required: [true, 'Please provide a leave type for this leave.'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date for this leave.'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date for this leave.'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: [true, 'Please provide a status for this leave.'],
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

const Leave = monogoose.model('Leave', leaveSchema);

module.exports = Leave;