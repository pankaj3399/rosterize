const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { checkAuth } = require('./middleware/middleware');
const companyRoutes = require('./routes/Company');
const authRoutes = require('./routes/Auth');
const userRoutes = require('./routes/User');
const departmentRoutes = require('./routes/Department');
const roleRoutes = require('./routes/Role');
const adminRoutes = require('./routes/Admin');
const companyAdminRoutes = require('./routes/CompanyAdmin');
const departmentHeadRoutes = require('./routes/DepartmentHead');
const publicRoutes = require('./routes/Public');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Check if this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Ensure credentials are handled properly
}));

// Database Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Routes
        app.use('/api/company', checkAuth, companyRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/api/user', checkAuth, userRoutes);
        app.use('/api/department', departmentRoutes);
        app.use('/api/role', roleRoutes);
        app.use('/api/admin', checkAuth, adminRoutes);
        app.use('/api/companyadmin', checkAuth, companyAdminRoutes);
        app.use('/api/departmenthead', checkAuth, departmentHeadRoutes);
        app.use('/api/public', publicRoutes);


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    })
    .catch(err => console.error('Database connection error:', err));
