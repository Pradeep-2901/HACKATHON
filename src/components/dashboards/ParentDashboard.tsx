import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for academic performance
  const performanceData = {
    labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English'],
    datasets: [
      {
        label: 'Current Marks',
        data: [85, 92, 78, 95, 88],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Previous Marks',
        data: [82, 88, 75, 92, 85],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  // Mock data for attendance
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance',
        data: [1, 1, 1, 1, 1],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  // Update the attendance chart options
  const attendanceOptions = {
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

  // Update the performance chart options
  const performanceOptions = {
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

  // Update the attendance distribution chart options
  const attendanceDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Grade</h3>
        <p className="text-3xl font-bold text-blue-600">A</p>
        <p className="text-sm text-gray-500">Current Semester</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
        <p className="text-3xl font-bold text-green-600">95%</p>
        <p className="text-sm text-gray-500">This month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Assignments</h3>
        <p className="text-3xl font-bold text-yellow-600">3</p>
        <p className="text-sm text-gray-500">Due this week</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Exams</h3>
        <p className="text-3xl font-bold text-purple-600">2</p>
        <p className="text-sm text-gray-500">Next 2 weeks</p>
      </div>
    </div>
  );

  const renderAcademicPerformance = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Academic Performance</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          View Report Card
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
          <div className="h-[300px]">
            <Bar data={performanceData} options={performanceOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
          <div className="space-y-4">
            {performanceData.datasets[0].data.map((mark, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{performanceData.labels[index]}</span>
                  <span>{mark}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      mark >= 80 ? 'bg-green-500' : mark >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${mark}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-700">Top Performer</h4>
            <p className="text-sm text-gray-500">Physics - Class A</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-700">Perfect Attendance</h4>
            <p className="text-sm text-gray-500">Last Week</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-700">Assignment Excellence</h4>
            <p className="text-sm text-gray-500">Chemistry Project</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Attendance Tracking</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Download Report
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <div className="h-[300px]">
            <Bar data={attendanceData} options={attendanceOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
          <div className="h-[300px]">
            <Pie
              data={{
                labels: ['Present', 'Absent', 'Late'],
                datasets: [
                  {
                    data: [95, 3, 2],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.5)',
                      'rgba(239, 68, 68, 0.5)',
                      'rgba(234, 179, 8, 0.5)',
                    ],
                    borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(234, 179, 8)'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={attendanceDistributionOptions}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Attendance Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-31</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Present
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">On time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Assignments & Homework</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-700">Physics Project</h3>
              <p className="text-sm text-gray-500">Due: Apr 5, 2024</p>
            </div>
            <div className="space-x-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Project on Quantum Mechanics</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Subject: Physics</span>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-700">Chemistry Lab Report</h3>
              <p className="text-sm text-gray-500">Due: Apr 3, 2024</p>
            </div>
            <div className="space-x-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Lab experiment on Chemical Reactions</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Subject: Chemistry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamSchedules = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Exam Schedules & Results</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          View Calendar
        </button>
      </div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-700">Physics Mid-Term</h3>
              <p className="text-sm text-gray-500">Apr 10, 2024 • 9:00 AM</p>
            </div>
            <div className="space-x-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Upcoming
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Topics: Quantum Mechanics, Thermodynamics</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Duration: 2 hours</span>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-700">Chemistry Quiz</h3>
              <p className="text-sm text-gray-500">Apr 5, 2024 • 10:30 AM</p>
            </div>
            <div className="space-x-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Score: 92%</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">Topics: Chemical Bonding, Periodic Table</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-md rounded-lg p-4 mr-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('academic-performance')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'academic-performance' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Academic Performance
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'attendance' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'assignments' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('exam-schedules')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'exam-schedules' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Exam Schedules
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'academic-performance' && renderAcademicPerformance()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'exam-schedules' && renderExamSchedules()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
