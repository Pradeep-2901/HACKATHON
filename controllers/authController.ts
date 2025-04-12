import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Student, Teacher, Parent, isValidDateFormat, IStudent, ITeacher, IParent } from '../models/User';

const generateToken = (userId: string, role: 'Student' | 'Teacher' | 'Parent') => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '1d',
  });
};

interface LoginRequest {
  regno: string;
  password: string;
  role: 'Student' | 'Teacher' | 'Parent';
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { regno, password, role } = req.body;
    console.log('Login attempt:', { regno, password, role });

    // Validate input
    if (!regno || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate date format for student and parent logins
    if ((role === 'Student' || role === 'Parent') && !isValidDateFormat(password)) {
      return res.status(400).json({ message: 'Invalid date format. Please use DDMMYYYY format (e.g., 08052005)' });
    }

    let user: IStudent | ITeacher | IParent | null = null;
    
    if (role === 'Parent') {
      // For parent login, first find the student
      const student = await Student.findOne({ regno });
      console.log('Found student:', student);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Then find the parent linked to this student
      user = await Parent.findOne({ student_regno: regno });
      console.log('Found parent:', user);
      if (!user) {
        return res.status(404).json({ message: 'Parent not found' });
      }

    } else if (role === 'Student') {
      user = await Student.findOne({ regno });
      console.log('Found student:', user);
      if (!user) {
        return res.status(404).json({ message: 'Student not found' });
      }

    } else {
      // Teacher login
      user = await Teacher.findOne({ regno });
      console.log('Found teacher:', user);
      if (!user) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
    }

    // For debugging
    console.log('Comparing password:', password);
    console.log('With hashed password:', user.password);

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id, role);

    // Prepare response based on role
    const userResponse = role === 'Parent' 
      ? {
          id: user.id,
          student_regno: (user as IParent).student_regno,
          role
        }
      : {
          id: user.id,
          name: (user as IStudent | ITeacher).name,
          regno: (user as IStudent | ITeacher).regno,
          role
        };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
