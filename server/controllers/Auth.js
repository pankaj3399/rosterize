const User = require('../models/User');
const Company = require('../models/Company');
const sendMail = require('../helpers/Mail/sendMail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).send({ error: 'User not found' });
            }
            // if user is type company or department, check if they are approved
            if (userExists.role === 'companyadmin' || userExists.role === 'department' || userExists.role === 'user') {
                // find the company
                const company = await Company.findById(userExists.company);
                if(!company) {
                    return res.status(400).send({ error: 'Company not found' });
                }
                if (company.status !== 'approved') {
                    return res.status(400).send({ error: 'Company not approved' });
                }
            }

            if (!await bcrypt.compare(password, userExists.password)) {
                return res.status(400).send({ error: 'Invalid password' });
            }
            userExists.password = undefined;
            const token = jwt.sign({ id: userExists._id, company: userExists.company, department: userExists.department }, process.env.TOKEN_SECRET, {
                expiresIn: 86400
            });
            res.send({ user: userExists, token });
        }
        catch (err) {
            return res.status(401).send({ error: err.message || 'Login failed' }); 
        }
        
    },
    async register(req, res) {
        try {
            const { email } = req.body;
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'User already exists' });
            }
            const newUser = await User.create(req.body);
            newUser.password = undefined;
            const token = jwt.sign({ id: newUser.id }, process.env.SECRET, {
                expiresIn: 86400
            });
            res.send({ newUser, token });
        }
        catch (err) {
            return res.status(400).send({ error: 'Registration failed' });
        }
    },
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }
            const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
            user.resetCode = resetCode;
            await user.save();

            const subject = 'Password Reset';
            const message = `Your password reset code is ${resetCode}`;
            const isSendMail = await sendMail(email, subject, message);
            if(isSendMail?.error) throw new Error(isSendMail.message || 'Error sending email');

            return res.send({ message: 'Reset link sent to email' });
        }
        catch (err) {
            return res.status(400).send({ error: err.message || 'Password reset failed' });
        }
    },
    async resetPassword(req, res) {
        try {
            const { email, password, code } = req.body;
            if(!email || !password || !code) {
                return res.status(400).send({ error: 'Please provide email, password and code' });
            }
            const user = await User.findOne({ email }); 
            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }
            if(!user.resetCode) {
                return res.status(400).send({ error: 'Please initiate forgot password request first.' });
            }
            if(user.resetCode !== code) {
                return res.status(400).send({ error: 'Invalid code' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.resetCode = null;
            await user.save();
            return res.send({ message: 'Password reset successful' });

        }
        catch (err) {
            return res.status(400).send({ error: err.message || 'Failed to reset password' });
        }
    }

    


}