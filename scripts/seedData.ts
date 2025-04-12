import mongoose from 'mongoose';
import { Student, Teacher, Parent } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/education_platform';
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Parent.deleteMany({});

    // Create test users
    const student1 = await Student.create({
      name: 'SOUNTHAR',
      regno: '23619233',
      dob: '08052005',
      password: '08052005' // Will be overwritten by pre-save hook
    });
    const student2 = await Student.create({
      name: 'VARSHA',
      regno: '23619235',
      dob: '21102005',
      password: '21102005' // Will be overwritten by pre-save hook
    });
    const student3 = await Student.create({
      name: 'PRADEEP',
      regno: '23619236',
      dob: '09052005',
      password: '09052005' // Will be overwritten by pre-save hook
    });
    const student4 = await Student.create({
      name: 'GAYISHA',
      regno: '23619237',
      dob: '10052005',
      password: '10052005' // Will be overwritten by pre-save hook
    });

    const teacher1 = await Teacher.create({
      name: 'SOWMIYA',
      regno: '12345678',
      password: 'sowmiya08'
    });
    const teacher2 = await Teacher.create({
      name: 'SANTHI',
      regno: '12345679',
      password: 'santhi08'
    });

    const parent1 = await Parent.create({
      student_regno: '23619233',
      student_dob: '08052005',
      password: '08052005' // Will be overwritten by pre-save hook
    });
    const parent2 = await Parent.create({
      student_regno: '23619235',
      student_dob: '21102005',
      password: '21102005' // Will be overwritten by pre-save hook
    });
    const parent3 = await Parent.create({
      student_regno: '23619236',
      student_dob: '09052005',
      password: '09052005' // Will be overwritten by pre-save hook
    });
    const parent4 = await Parent.create({
      student_regno: '23619237',
      student_dob: '10052005',
      password: '10052005' // Will be overwritten by pre-save hook
    });

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
