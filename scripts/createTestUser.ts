import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/school_management');
    console.log('Connected to MongoDB');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('sowmiya08', salt);

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: '12345678',
      password: hashedPassword,
      role: 'teacher',
    });

    // Save user
    await testUser.save();
    console.log('Test user created successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser(); 