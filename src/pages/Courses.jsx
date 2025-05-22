import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Courses = () => {
  const [stats, setStats] = useState({
    totalCourses: 34,
    activeCourses: 28,
    departments: 8,
    averageEnrollment: 25
  });

  // Icons
  const BookOpenIcon = getIcon('book-open');
  const CheckCircleIcon = getIcon('check-circle');
  const BuildingIcon = getIcon('building');
  const UsersIcon = getIcon('users');

  const refreshCourseStats = () => {
    // Simulate fetching updated course data
    const newStats = {
      totalCourses: Math.floor(Math.random() * 20) + 25,
      activeCourses: Math.floor(Math.random() * 15) + 20,
      departments: Math.floor(Math.random() * 5) + 5,
      averageEnrollment: Math.floor(Math.random() * 15) + 15
    };
    
    setStats(newStats);
    toast.success("Course statistics refreshed!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Course Management</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            View and manage all courses, enrollments, and academic offerings.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={refreshCourseStats}
            className="btn btn-primary"
          >
            Refresh Stats
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
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Total Courses</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.totalCourses}</h3>
            </div>
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BookOpenIcon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Active Courses</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.activeCourses}</h3>
            </div>
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Departments</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.departments}</h3>
            </div>
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BuildingIcon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Avg. Enrollment</p>
              <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{stats.averageEnrollment}</h3>
            </div>
            <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Course Management */}
      <div className="mb-8">
        <MainFeature />
      </div>
    </div>
  );
};

export default Courses;