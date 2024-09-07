const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();
const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const FIRST_NAME = 'Super', LAST_NAME = 'Admin',ADMIN_PHONE_NO = '09834125321', EMERGENCY_CONTACT_NAME = 'Emergency Contact', EMERGENCY_CONTACT_NO = '0987654321', ROLE = 'superadmin', EMPLOYEE_ID = 'EMP001', STATUS = 'active';

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const superAdmin = new User({
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phoneNo: ADMIN_PHONE_NO,
      emergencyContactName: EMERGENCY_CONTACT_NAME,
      emergencyContactNo: EMERGENCY_CONTACT_NO,
      role: ROLE,
      employeeId: EMPLOYEE_ID,
      status: STATUS,
    });

    await superAdmin.save();

    console.log('Superadmin user created successfully!');
  } catch (error) {
    console.error('Error seeding superadmin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedSuperAdmin();
