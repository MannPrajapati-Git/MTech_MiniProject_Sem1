const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const adminEmail = 'admintest@gmail.com';
    const adminPassword = 'admintest';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('✅ Admin already exists! Role ensured as "admin".');
    } else {
      await User.create({
        name: 'Platform Super Admin',
        email: adminEmail,
        phone: '9876543210',
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        address: {
          street: 'Admin HQ',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        }
      });
      console.log('✅ Master Admin Account Created Successfully!');
    }

    console.log('\n--- ADMIN LOGIN CREDENTIALS ---');
    console.log(`Email    : ${adminEmail}`);
    console.log(`Password : ${adminPassword}`);
    console.log('-------------------------------\n');

    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();