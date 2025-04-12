import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { login } from '../services/api';
import { LoginFormData, UserRole } from '../types/auth';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [formData, setFormData] = useState<LoginFormData>({
    regno: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      role: activeTab,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(formData);
      const displayName = 'name' in response.user ? response.user.name : response.user.student_regno;
      toast.success(`Welcome back, ${displayName}!`);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const tabClasses = (tab: UserRole) =>
    `px-6 py-3 text-sm font-medium transition-all duration-200 ${
      activeTab === tab
        ? 'bg-white text-blue-700 shadow-sm rounded-t-xl'
        : 'text-white/80 hover:text-white hover:bg-white/10 rounded-t-xl'
    }`;

  const inputClasses = 
    "w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex bg-gray-50">
          {(['student', 'teacher', 'parent'] as UserRole[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData(prev => ({ ...prev, role: tab, password: '' }));
              }}
              className={tabClasses(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="regno" className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'parent' ? 'Student Registration Number' : 'Registration Number'}
              </label>
              <input
                type="text"
                id="regno"
                name="regno"
                value={formData.regno}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder={`Enter ${activeTab} registration number`}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
