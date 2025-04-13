import axios from 'axios';
import { LoginFormData, LoginResponse } from '../types/auth';

const API_URL = 'http://localhost:5000/api';

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};
