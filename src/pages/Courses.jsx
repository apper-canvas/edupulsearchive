import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { getCourses } from '../services/courseService';

const Courses = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    departments: 0,
    averageEnrollment: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Icons
  const BookOpenIcon = getIcon('book-open');
  const CheckCircleIcon = getIcon('check-circle');
  const BuildingIcon = getIcon('building');
  const UsersIcon = getIcon('users');

  // Fetch course statistics on component mount
  useEffect(() => {
    fetchCourseStats();
  }, []);

  // Fetch course statistics from database
  const fetchCourseStats = async () => {
    setIsLoading(true);
    try {
      const coursesData = await getCourses();
      
      // Calculate statistics
      const activeCourses = coursesData.filter(course => course.status === 'active');
      const departmentsSet = new Set(coursesData.filter(course => course.department).map(course => course.department));
      const totalEnrollment = coursesData.reduce((sum, course) => sum + (course.enrolled || 0), 0);
      const averageEnrollment = coursesData.length ? Math.round(totalEnrollment / coursesData.length) : 0;
      
      // Update stats
      setStats({
        totalCourses: coursesData.length,
        activeCourses: activeCourses.length,
        departments: departmentsSet.size,
        averageEnrollment: averageEnrollment
      });
      
      toast.success("Course statistics refreshed!");
    } catch (error) {
      console.error("Error fetching course statistics:", error);
      toast.error("Failed to refresh course statistics");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh course statistics
  const refreshCourseStats = async () => {
    try {
      await fetchCourseStats();
    } catch (error) {
      console.error("Error refreshing course statistics:", error);
      toast.error("Failed to refresh course statistics");
    }
    toast.success("Course statistics refreshed!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Course Management</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            View and manage all courses, enrollments, and academic offerings. 
            {isLoading && <span className="ml-2 text-sm italic">Loading statistics...</span>}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={refreshCourseStats}
            className={`btn btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? <span className="animate-spin mr-2">⟳</span> : null}
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