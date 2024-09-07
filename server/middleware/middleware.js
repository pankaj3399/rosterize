
//implement middleware to check if the user is authenticated
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const Department = require('../models/Department');

module.exports = {

    checkAuth: async(req, res, next) => {

        //get the token from the header
        let token = req.header('Authorization');

        //check if the token is present
        if (!token) {
            return res.status(401).send('Access Denied');
        }

        try {
            //verify the token
            token = req.header('Authorization').replace('Bearer ', '');
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);

            //check if the user exists
            const user = await User.findById(verified.id);

            if (!user || user.status !== 'active') {
                return res.status(401).send('Access Denied');
            }

            if (req.path.includes('departmenthead') && user.role !== 'departmenthead') {
                return res.status(401).send('Access Denied'); 
            }

            if (req.path.includes('companyadmin') && user.role !== 'companyadmin') {
                return res.status(401).send('Access Denied');
            }

            if (req.path.includes('superadmin') && user.role !== 'superadmin') {
                return res.status(401).send('Access Denied');
            }

            const company = await Company.findById(user.company);
            const department = await Department.findById(user.department);
            req.user = user;
            req.company = company;
            req.department = department;
            next();

        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    }
}
