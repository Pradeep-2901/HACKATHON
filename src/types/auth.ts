export type UserRole = 'student' | 'teacher' | 'parent';

export interface LoginFormData {
  regno: string;
  password: string;
  role: UserRole;
}

export interface BaseUser {
  id: string;
  role: UserRole;
}

export interface StudentTeacher extends BaseUser {
  name: string;
  regno: string;
}

export interface ParentUser extends BaseUser {
  student_regno: string;
}

export type User = StudentTeacher | ParentUser;

export interface LoginResponse {
  token: string;
  user: User;
}
