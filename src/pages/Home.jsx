import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 245,
    totalCourses: 34,
    activeEnrollments: 683,
    averageGrade: 3.6
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Course Created", details: "Introduction to Computer Science", timestamp: "2 hours ago", icon: "book-plus" },
    { id: 2, action: "Student Enrolled", details: "Emma Thompson in Advanced Mathematics", timestamp: "3 hours ago", icon: "user-plus" },
    { id: 3, action: "Grade Updated", details: "Physics Final Exam - 18 students graded", timestamp: "4 hours ago", icon: "clipboard-check" },
    { id: 4, action: "Attendance Recorded", details: "Biology 101 - 28 students present", timestamp: "5 hours ago", icon: "check-circle" }
  ]);

  // Icons
  const UserIcon = getIcon('user');
  const BookOpenIcon = getIcon('book-open');
  const UsersIcon = getIcon('users');
  const TrendingUpIcon = getIcon('trending-up');
  
  const fetchRandomData = () => {
    // Simulate fetching updated data
    const newStats = {
      totalStudents: Math.floor(Math.random() * 100) + 200,
      totalCourses: Math.floor(Math.random() * 20) + 20,
      activeEnrollments: Math.floor(Math.random() * 300) + 500,
      averageGrade: (Math.random() * 1.5 + 2.5).toFixed(1)
    };
    
    setStats(newStats);
    toast.success("Dashboard data refreshed successfully!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Welcome to EduPulse. Here's your academic overview.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={fetchRandomData}
            className="btn btn-primary"
          >
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Total Students</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.totalStudents}</h3>
            </div>
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
            <span className="mr-1">↑ 12%</span>
            <span className="text-surface-500 dark:text-surface-400">from last semester</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Total Courses</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.totalCourses}</h3>
            </div>
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BookOpenIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
            <span className="mr-1">↑ 5%</span>
            <span className="text-surface-500 dark:text-surface-400">from last semester</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Active Enrollments</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.activeEnrollments}</h3>
            </div>
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
            <span className="mr-1">↑ 8%</span>
            <span className="text-surface-500 dark:text-surface-400">from last semester</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Average GPA</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.averageGrade}</h3>
            </div>
            <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <TrendingUpIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
            <span className="mr-1">↑ 3%</span>
            <span className="text-surface-500 dark:text-surface-400">from last semester</span>
          </div>
        </motion.div>
      </div>
      
      {/* Main Feature */}
      <div className="mb-8">
        <MainFeature />
      </div>
      
      {/* Recent Activity */}
      <div className="card">
        <div className="p-5 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {recentActivity.map((activity) => {
            const ActivityIcon = getIcon(activity.icon);
            
            return (
              <div key={activity.id} className="p-4 md:px-5 flex items-start gap-4">
                <div className="rounded-full p-2 bg-surface-100 dark:bg-surface-700 text-primary">
                  <ActivityIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 dark:text-white truncate">{activity.action}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{activity.details}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 text-center border-t border-surface-200 dark:border-surface-700">
          <button className="text-primary font-medium hover:text-primary-dark dark:hover:text-primary-light transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;