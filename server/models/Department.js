const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name for this department.'],
        },
    company: {
        //reference to company
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide a company for this department.'],
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

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;