import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getTabs = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'lecture-notes', name: 'Lecture Notes', icon: '📚' },
          { id: 'attendance', name: 'Attendance', icon: '📅' },
          { id: 'marks', name: 'Marks & Performance', icon: '📈' },
          { id: 'quizzes', name: 'Quizzes', icon: '✍️' },
          { id: 'calendar', name: 'Calendar', icon: '🗓️' }
        ];
      case 'teacher':
        return [
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'lecture-management', name: 'Lecture Management', icon: '📚' },
          { id: 'attendance', name: 'Attendance', icon: '📅' },
          { id: 'marks', name: 'Marks & Performance', icon: '📈' },
          { id: 'assignments', name: 'Assignments', icon: '📝' },
          { id: 'quizzes', name: 'AI Quizzes', icon: '✍️' },
          { id: 'announcements', name: 'Announcements', icon: '📢' }
        ];
      case 'parent':
        return [
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'academic', name: 'Academic Performance', icon: '📚' },
          { id: 'attendance', name: 'Attendance', icon: '📅' },
          { id: 'assignments', name: 'Assignments', icon: '📝' },
          { id: 'exams', name: 'Exam Schedule', icon: '📅' }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {user?.role} Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 