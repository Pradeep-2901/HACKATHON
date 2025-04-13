import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Helper function to validate 8-digit date format (DDMMYYYY)
export const isValidDateFormat = (dateStr: string): boolean => {
  const dateRegex = /^\d{8}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const day = parseInt(dateStr.substring(0, 2));
  const month = parseInt(dateStr.substring(2, 4));
  const year = parseInt(dateStr.substring(4, 8));
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};

// Base schema for common fields
const baseSchema = {
  name: {
    type: String,
    required: true,
  },
  regno: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
};

// Student Schema
const studentSchema = new mongoose.Schema({
  ...baseSchema,
  dob: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return isValidDateFormat(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid date in DDMMYYYY format!`
    }
  }
}, {
  timestamps: true
});

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  ...baseSchema
}, {
  timestamps: true
});

// Parent Schema
const parentSchema = new mongoose.Schema({
  student_regno: {
    type: String,
    required: true,
  },
  student_dob: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return isValidDateFormat(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid date in DDMMYYYY format!`
    }
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

// Hash password middleware for Student
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    // If password is not modified but dob is, set password to dob
    if (this.isModified('dob')) {
      this.password = this.dob;
    } else {
      return next();
    }
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password middleware for Teacher
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password middleware for Parent
parentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    // If password is not modified but student_dob is, set password to student_dob
    if (this.isModified('student_dob')) {
      this.password = this.student_dob;
    } else {
      return next();
    }
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add comparePassword method to all schemas
const comparePassword = async function(this: any, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.comparePassword = comparePassword;
teacherSchema.methods.comparePassword = comparePassword;
parentSchema.methods.comparePassword = comparePassword;

// Create models
export const Student = mongoose.model('Student', studentSchema);
export const Teacher = mongoose.model('Teacher', teacherSchema);
export const Parent = mongoose.model('Parent', parentSchema);

// Types
export interface IStudent extends mongoose.Document {
  name: string;
  regno: string;
  dob: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITeacher extends mongoose.Document {
  name: string;
  regno: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IParent extends mongoose.Document {
  student_regno: string;
  student_dob: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', userSchema);
