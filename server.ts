import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mock user database
const users = [
  { id: 1, regNumber: '123456789', password: 'student123', type: 'student' },
  { id: 2, regNumber: 'TECH001', password: 'teacher123', type: 'teacher' },
  { id: 3, regNumber: 'PAR001', password: 'parent123', type: 'parent' },
];

// Login validation schema
const loginSchema = z.object({
  registerNumber: z.string().min(1, 'Registration number is required'),
  password: z.string().min(1, 'Password is required'),
  userType: z.enum(['student', 'teacher', 'parent']),
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  try {
    const { registerNumber, password, userType } = loginSchema.parse(req.body);
    
    const user = users.find(u => 
      u.regNumber === registerNumber && 
      u.password === password && 
      u.type === userType
    );

    if (!user) {
      console.log('Invalid credentials for:', registerNumber);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('Login successful for user:', user.id);
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        type: user.type,
      },
      token: 'mock-jwt-token'
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
}); 