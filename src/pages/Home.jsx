import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import DeadlineItem from '../components/dashboard/DeadlineItem';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 245,
    totalCourses: 34,
    activeEnrollments: 683,
    averageGrade: 3.6,
    attendanceRate: 92,
    completionRate: 88
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [filterActivity, setFilterActivity] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "course", action: "Course Created", details: "Introduction to Computer Science", timestamp: "2 hours ago", icon: "book-plus", user: "Dr. Alan Turing" },
    { id: 2, type: "student", action: "Student Enrolled", details: "Emma Thompson in Advanced Mathematics", timestamp: "3 hours ago", icon: "user-plus", user: "Admin System" },
    { id: 3, type: "assessment", action: "Grade Updated", details: "Physics Final Exam - 18 students graded", timestamp: "4 hours ago", icon: "clipboard-check", user: "Dr. Marie Curie" },
    { id: 4, type: "attendance", action: "Attendance Recorded", details: "Biology 101 - 28 students present", timestamp: "5 hours ago", icon: "check-circle", user: "Prof. Jane Goodall" },
    { id: 5, type: "course", action: "Course Updated", details: "Curriculum changes to Organic Chemistry", timestamp: "Yesterday", icon: "file-edit", user: "Dr. Rosalind Franklin" },
    { id: 6, type: "student", action: "Student Removed", details: "Thomas Wilson from Calculus II", timestamp: "Yesterday", icon: "user-minus", user: "Admin System" }
  ]);
  
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, title: "Mid-term Exam Submission", course: "Computer Science 101", dueDate: "Tomorrow", priority: "high", status: "pending" },
    { id: 2, title: "Course Registration Opens", course: "Fall Semester 2023", dueDate: "3 days", priority: "medium", status: "upcoming" },
    { id: 3, title: "Final Project Deadline", course: "Data Structures", dueDate: "1 week", priority: "high", status: "pending" },
    { id: 4, title: "Faculty Meeting", course: "Department Wide", dueDate: "2 days", priority: "low", status: "upcoming" }
  ]);

  // Icons
  const CalendarIcon = getIcon('calendar');
  const BellIcon = getIcon('bell');
  const UsersIcon = getIcon('users-2');
  const BookIcon = getIcon('book');
  const BarChartIcon = getIcon('bar-chart');
  const GraduationCapIcon = getIcon('graduation-cap');
  const PlusIcon = getIcon('plus');
  const FilterIcon = getIcon('filter');
  const RefreshIcon = getIcon('refresh-cw');
  const UserIcon = getIcon('user-circle');
  const StarIcon = getIcon('star');
  
  // Performance data for charts
  const [performanceData, setPerformanceData] = useState({
    enrollmentTrend: {
      options: {
        chart: {
          id: 'enrollment-trend',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          labels: {
            style: {
              colors: '#64748b'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#64748b'
            }
          }
        },
        colors: ['#4F46E5', '#06B6D4'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 5
        },
        markers: {
          size: 4,
          colors: ['#4F46E5', '#06B6D4'],
          strokeWidth: 0
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            colors: '#64748b'
          }
        }
      },
      series: [
        {
          name: 'Enrollments',
          data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
        },
        {
          name: 'Completions',
          data: [25, 35, 40, 45, 44, 55, 65, 85, 115]
        }
      ]
    },
    gradeDistribution: {
      options: {
        chart: {
          type: 'donut',
        },
        colors: ['#3730A3', '#4F46E5', '#818CF8', '#C7D2FE', '#EEF2FF'],
        labels: ['A', 'B', 'C', 'D', 'F'],
        legend: {
          position: 'bottom',
          labels: {
            colors: '#64748b'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '55%'
            }
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold'
          },
          dropShadow: {
            enabled: false
          }
        }
      },
      series: [35, 30, 20, 10, 5]
    },
    attendanceOverview: {
      options: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        colors: ['#06B6D4'],
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          labels: {
            style: {
              colors: '#64748b'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Attendance (%)',
            style: {
              color: '#64748b'
            }
          },
          labels: {
            style: {
              colors: '#64748b'
            }
          }
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 5
        }
      },
      series: [
        {
          name: 'Attendance',
          data: [94, 91, 88, 93, 90]
        }
      ]
    }
  });
  
  // Filter activity items based on selected filter
  const filteredActivity = filterActivity === 'all' 
    ? recentActivity 
    : recentActivity.filter(activity => activity.type === filterActivity);
  
  const fetchRandomData = () => {
    setIsLoading(true);
    
    // Simulate fetching updated data
    setTimeout(() => {
      const newStats = {
        totalStudents: Math.floor(Math.random() * 100) + 200,
        totalCourses: Math.floor(Math.random() * 20) + 20,
        activeEnrollments: Math.floor(Math.random() * 300) + 500,
        averageGrade: (Math.random() * 1.5 + 2.5).toFixed(1),
        attendanceRate: Math.floor(Math.random() * 10) + 85,
        completionRate: Math.floor(Math.random() * 15) + 80
      };
      
      // Update chart data
      setPerformanceData(prevData => ({
        ...prevData,
        enrollmentTrend: {
          ...prevData.enrollmentTrend,
          series: [
            {
              name: 'Enrollments',
              data: Array(9).fill().map(() => Math.floor(Math.random() * 100) + 30)
            },
            {
              name: 'Completions',
              data: Array(9).fill().map(() => Math.floor(Math.random() * 80) + 20)
            }
          ]
        },
        gradeDistribution: {
          ...prevData.gradeDistribution,
          series: [
            Math.floor(Math.random() * 20) + 25, // A
            Math.floor(Math.random() * 15) + 25, // B
            Math.floor(Math.random() * 10) + 15, // C
            Math.floor(Math.random() * 10) + 5,  // D
            Math.floor(Math.random() * 5) + 2    // F
          ]
        },
        attendanceOverview: {
          ...prevData.attendanceOverview,
          series: [
            {
              name: 'Attendance',
              data: Array(5).fill().map(() => Math.floor(Math.random() * 15) + 80)
            }
          ]
        }
      }));
      
      setStats(newStats);
      setIsLoading(false);
      toast.success("Dashboard data refreshed successfully!");
    }, 800);
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast.info(`Viewing data for the last ${range}`);
  };
  
  const handleQuickAction = (action) => {
    switch(action) {
      case 'addCourse':
        navigate('/courses?action=add');
        break;
      case 'addStudent':
        navigate('/students?action=add');
        break;
      case 'takeAttendance':
        navigate('/calendar?view=day');
        break;
      case 'recordGrades':
        navigate('/assessments?action=grade');
        break;
      default:
        toast.info(`Action "${action}" initiated`);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Welcome to EduPulse. Here's your academic overview.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleTimeRangeChange('week')} 
              className={`px-3 py-1.5 text-sm font-medium ${timeRange === 'week' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              Week
            </button>
            <button 
              onClick={() => handleTimeRangeChange('month')} 
              className={`px-3 py-1.5 text-sm font-medium ${timeRange === 'month' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              Month
            </button>
            <button 
              onClick={() => handleTimeRangeChange('year')} 
              className={`px-3 py-1.5 text-sm font-medium ${timeRange === 'year' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              Year
            </button>
          </div>
          
          <button 
            onClick={fetchRandomData}
            className={`btn btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <RefreshIcon className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <RefreshIcon className="h-4 w-4 mr-2" />
                Refresh
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
        <StatsCard 
          title="Total Students"
          value={stats.totalStudents}
          icon={UserIcon}
          iconColor="blue"
          trend={12}
          delay={0.1}
          className="xl:col-span-1"
        />
        
        <StatsCard 
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookIcon}
          iconColor="purple"
          trend={5}
          delay={0.2}
          className="xl:col-span-1"
        />
        
        <StatsCard 
          title="Active Enrollments"
          value={stats.activeEnrollments}
          icon={UsersIcon}
          iconColor="green"
          trend={8}
          delay={0.3}
          className="xl:col-span-1"
        />
        
        <StatsCard 
          title="Average GPA"
          value={stats.averageGrade}
          icon={GraduationCapIcon}
          iconColor="amber"
          trend={3}
          delay={0.4}
          className="xl:col-span-1"
        />
        
        <StatsCard 
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={CalendarIcon}
          iconColor="indigo"
          trend={2}
          delay={0.5}
          className="xl:col-span-1"
        />
        
        <StatsCard 
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={StarIcon}
          iconColor="pink"
          trend={4}
          delay={0.6}
          className="xl:col-span-1"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('addCourse')}
            className="card p-4 text-center hover:shadow-md transition-all duration-200 hover:border-primary flex flex-col items-center justify-center gap-2"
          >
            <div className="rounded-full p-3 bg-primary/10 text-primary">
              <BookIcon className="h-6 w-6" />
            </div>
            <span className="font-medium text-surface-800 dark:text-white">Add New Course</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('addStudent')}
            className="card p-4 text-center hover:shadow-md transition-all duration-200 hover:border-primary flex flex-col items-center justify-center gap-2"
          >
            <div className="rounded-full p-3 bg-secondary/10 text-secondary">
              <UsersIcon className="h-6 w-6" />
            </div>
            <span className="font-medium text-surface-800 dark:text-white">Add New Student</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('takeAttendance')}
            className="card p-4 text-center hover:shadow-md transition-all duration-200 hover:border-primary flex flex-col items-center justify-center gap-2"
          >
            <div className="rounded-full p-3 bg-green-500/10 text-green-500">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <span className="font-medium text-surface-800 dark:text-white">Take Attendance</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('recordGrades')}
            className="card p-4 text-center hover:shadow-md transition-all duration-200 hover:border-primary flex flex-col items-center justify-center gap-2"
          >
            <div className="rounded-full p-3 bg-amber-500/10 text-amber-500">
              <BarChartIcon className="h-6 w-6" />
            </div>
            <span className="font-medium text-surface-800 dark:text-white">Record Grades</span>
          </button>
        </div>
      </div>
      
      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Analytics */}
        <div className="lg:col-span-2">
          <div className="card overflow-visible">
            <div className="border-b border-surface-200 dark:border-surface-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Performance Analytics</h2>
                <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300'}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('grades')}
                    className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'grades' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300'}`}
                  >
                    Grades
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'attendance' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300'}`}
                  >
                    Attendance
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {activeTab === 'overview' && (
                <PerformanceChart
                  options={performanceData.enrollmentTrend.options}
                  series={performanceData.enrollmentTrend.series}
                  type="line"
                  height={350}
                />
              )}
              
              {activeTab === 'grades' && (
                <PerformanceChart
                  options={performanceData.gradeDistribution.options}
                  series={performanceData.gradeDistribution.series}
                  type="donut"
                  height={350}
                />
              )}
              
              {activeTab === 'attendance' && (
                <PerformanceChart
                  options={performanceData.attendanceOverview.options}
                  series={performanceData.attendanceOverview.series}
                  type="bar"
                  height={350}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="border-b border-surface-200 dark:border-surface-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Upcoming Deadlines</h2>
                <button className="text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <BellIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {upcomingDeadlines.map(deadline => (
                <DeadlineItem 
                  key={deadline.id}
                  title={deadline.title}
                  course={deadline.course}
                  dueDate={deadline.dueDate}
                  priority={deadline.priority}
                  status={deadline.status}
                />
              ))}
            </div>
            
            <div className="p-4 text-center border-t border-surface-200 dark:border-surface-700">
              <button className="text-primary font-medium hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center justify-center gap-1 w-full">
                <PlusIcon className="h-4 w-4" />
                <span>Add New Deadline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Feature */}
      <div className="mb-8 hidden">
        <MainFeature />
      </div>
      
      {/* Recent Activity */}
      <div className="card">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h2>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setFilterActivity('all')} 
                  className={`px-3 py-1.5 text-xs font-medium ${filterActivity === 'all' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterActivity('course')} 
                  className={`px-3 py-1.5 text-xs font-medium ${filterActivity === 'course' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  Courses
                </button>
                <button 
                  onClick={() => setFilterActivity('student')} 
                  className={`px-3 py-1.5 text-xs font-medium ${filterActivity === 'student' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  Students
                </button>
                <button 
                  onClick={() => setFilterActivity('assessment')} 
                  className={`px-3 py-1.5 text-xs font-medium ${filterActivity === 'assessment' ? 'bg-primary text-white' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  Assessments
                </button>
              </div>
              
              <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
                <FilterIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {filteredActivity.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-surface-600 dark:text-surface-400">No activity matches your filter.</p>
            </div>
          ) : (
            filteredActivity.map((activity) => (
              <ActivityItem 
                key={activity.id}
                action={activity.action}
                details={activity.details}
                timestamp={activity.timestamp}
                icon={activity.icon}
                user={activity.user}
                type={activity.type}
              />
            ))
          )}
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