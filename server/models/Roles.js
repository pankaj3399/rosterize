const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this role.'],
        },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide a company for this role.'],
        
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

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;