import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Student, Teacher, Parent, IStudent, ITeacher, IParent } from '../models/User';

const router = express.Router();

// Debug route to check user details
router.get('/debug-user/:regno', async (req, res) => {
  try {
    const { regno } = req.params;
    const student = await Student.findOne({ regno });
    
    if (student) {
      return res.json({
        exists: true,
        data: {
          name: student.name,
          regno: student.regno,
          dob: student.dob,
          password: student.password // This will show the hashed password
        }
      });
    }
    
    res.json({ exists: false, message: 'User not found' });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Error checking user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { regno, password, role } = req.body;

    let user: IStudent | ITeacher | IParent | null = null;
    let userRole: string;

    // Find user based on role
    if (role === 'student') {
      user = await Student.findOne({ regno }) as IStudent;
      userRole = 'student';
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ regno }) as ITeacher;
      userRole = 'teacher';
    } else if (role === 'parent') {
      user = await Parent.findOne({ student_regno: regno }) as IParent;
      userRole = 'parent';
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid registration number or password' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid registration number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: userRole,
        name: 'name' in user ? user.name : 'Parent'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: 'name' in user ? user.name : 'Parent',
        regno: role === 'parent' ? (user as IParent).student_regno : (user as IStudent | ITeacher).regno,
        role: userRole,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: string;
    };

    let user: IStudent | ITeacher | IParent | null = null;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).select('-password') as IStudent;
    } else if (decoded.role === 'teacher') {
      user = await Teacher.findById(decoded.id).select('-password') as ITeacher;
    } else if (decoded.role === 'parent') {
      user = await Parent.findById(decoded.id).select('-password') as IParent;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
