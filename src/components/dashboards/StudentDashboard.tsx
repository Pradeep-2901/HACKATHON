import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { lectureSummaryService, LectureSummary } from '../../services/lectureSummaryService';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lectureSummaries, setLectureSummaries] = useState<LectureSummary[]>([]);

  useEffect(() => {
    loadLectureSummaries();
  }, []);

  const loadLectureSummaries = async () => {
    try {
      const summaries = await lectureSummaryService.getStudentSummaries();
      setLectureSummaries(summaries);
    } catch (error) {
      console.error('Error loading lecture summaries:', error);
    }
  };

  // Mock data for attendance
  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance %',
        data: [95, 88, 92, 85, 90, 87],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Mock data for marks
  const marksData = {
    labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English'],
    datasets: [
      {
        label: 'Marks',
        data: [85, 92, 78, 95, 88],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
              <p className="text-3xl font-bold text-blue-600">89.5%</p>
              <p className="text-sm text-gray-500">Last 6 months average</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Marks</h3>
              <p className="text-3xl font-bold text-green-600">87.6%</p>
              <p className="text-sm text-gray-500">Current semester</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Quizzes</h3>
              <p className="text-3xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-gray-500">Due this week</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Lecture Notes</h3>
              <p className="text-3xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-500">AI-generated summaries</p>
            </div>
          </div>
        );
      case 'lecture-notes':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Lecture Summaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectureSummaries.map((summary) => (
                <div key={summary._id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">{summary.title}</h3>
                  <p className="text-gray-600">{summary.subject}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Summary</h4>
                    <p className="text-gray-600">{summary.summary.overview}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Key Points</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {summary.summary.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Published: {new Date(summary.publishedAt!).toLocaleDateString()}</span>
                    <button
                      onClick={() => window.open(summary.audioFile.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Listen to Recording
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
                <div className="h-[300px]">
                  <Bar data={attendanceData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
                <div className="h-[300px]">
                  <Pie
                    data={{
                      labels: ['Present', 'Absent'],
                      datasets: [
                        {
                          data: [89.5, 10.5],
                          backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)'],
                          borderColor: ['rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right' as const,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'marks':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Marks & Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Subject-wise Marks</h3>
                <div className="h-[300px]">
                  <Bar data={marksData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                      <span className="text-sm font-medium text-gray-700">87.6%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '87.6%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Class Average</span>
                      <span className="text-sm font-medium text-gray-700">82.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '82.3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'quizzes':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pending Quizzes */}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Pending Quizzes</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800">Physics Quiz</h4>
                    <p className="text-sm text-gray-600">Due: Tomorrow</p>
                    <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      Start Quiz
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800">Chemistry Quiz</h4>
                    <p className="text-sm text-gray-600">Due: Next Week</p>
                    <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
              {/* Completed Quizzes */}
              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Completed Quizzes</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800">Math Quiz</h4>
                    <p className="text-sm text-gray-600">Score: 85%</p>
                    <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      View Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">15</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800">Physics Exam</h4>
                      <p className="text-sm text-gray-600">10:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">18</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800">Chemistry Quiz</h4>
                      <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Assignment Deadlines</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">20</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800">Math Assignment</h4>
                      <p className="text-sm text-gray-600">Due: 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard; 