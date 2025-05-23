import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourses, createCourse, deleteCourse } from '../services/courseService';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  // State for managing courses
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for new course form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    instructor: "",
    department: "",
    credits: 3,
    status: "active",
    enrolled: 0,
    capacity: 30
  });
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);
  
  // Fetch courses from database
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get unique departments for filter dropdown
  const departments = ["all", ...new Set(courses.filter(c => c.department).map(course => course.department))];
    
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: name === "credits" || name === "capacity" ? parseInt(value) || 0 : value
    }));
  };
  
  // Add new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newCourse.code || !newCourse.name || !newCourse.instructor || !newCourse.department) {
      toast.error("Please fill out all required fields.");
      return;
    }
    
    try {
      setIsLoading(true);
      // Format the data for API - convert course name to Name field
      const courseData = {
        Name: newCourse.name,
        ...newCourse
      };
      
      await createCourse(courseData);
      
      // Reset form
      setNewCourse({
        code: "",
        name: "",
        instructor: "",
        department: "",
        credits: 3,
        status: "active",
        enrolled: 0,
        capacity: 30
      });
      
      await fetchCourses(); // Refresh courses
      setIsFormOpen(false);
      toast.success("Course added successfully!");
    } catch (error) {
      toast.error("Failed to add course: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete course
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteCourse(id);
      await fetchCourses(); // Refresh courses
      toast.success("Course removed successfully!");
    } catch (error) {
      toast.error("Failed to delete course: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesDepartment = departmentFilter === "all" || course.department?.toLowerCase() === departmentFilter?.toLowerCase();
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Icons
  const SearchIcon = getIcon('search');
  const PlusIcon = getIcon('plus');
  const BookOpenIcon = getIcon('book-open');
  const XCircleIcon = getIcon('x-circle');
  const CheckCircleIcon = getIcon('check-circle');
  const UserIcon = getIcon('user');
  const BuildingIcon = getIcon('building');
  const HashIcon = getIcon('hash');
  const TrashIcon = getIcon('trash-2');
  const XIcon = getIcon('x');
  
  return (
    <div className="card overflow-visible">
      <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-primary" />
          <span>Course Management</span>
          {isLoading && <span className="ml-2 text-sm text-surface-500 animate-pulse">Loading...</span>}
        </h2>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className={`btn btn-primary inline-flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⟳</span>
          ) : <PlusIcon className="h-4 w-4" />}
          <span>Add Course</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="form-input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="form-input bg-white dark:bg-surface-800"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== "all").map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            
            <select
              className="form-input bg-white dark:bg-surface-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
      
      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Code</th>
              <th className="py-3 px-4 text-left font-semibold">Course Name</th>
              <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Instructor</th>
              <th className="py-3 px-4 text-left font-semibold hidden lg:table-cell">Department</th>
              <th className="py-3 px-4 text-center font-semibold hidden md:table-cell">Credits</th>
              <th className="py-3 px-4 text-center font-semibold">Enrollment</th>
              <th className="py-3 px-4 text-center font-semibold">Status</th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <motion.tr 
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-surface-900 dark:text-white">{course.code}</td>
                  <td className="py-3 px-4 text-sm text-surface-700 dark:text-surface-300">{course.name}</td>
                  <td className="py-3 px-4 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">{course.instructor}</td>
                  <td className="py-3 px-4 text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">{course.department || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-center text-surface-600 dark:text-surface-400 hidden md:table-cell">{course.credits}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className={`font-medium ${
                        course.enrolled / course.capacity > 0.9 
                          ? 'text-red-600 dark:text-red-400' 
                          : course.enrolled / course.capacity > 0.7 
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-green-600 dark:text-green-400'
                      }`}>
                        {course.enrolled}
                      </span>
                      <span className="text-surface-500 dark:text-surface-500">/ {course.capacity}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : course.status === 'inactive'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300'
                    }`}>
                      {course.status === 'active' ? (
                        <CheckCircleIcon className="h-3 w-3" />
                      ) : course.status === 'inactive' ? (
                        <XCircleIcon className="h-3 w-3" />
                      ) : null}
                      <span className="capitalize">{course.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <button
                      onClick={() => handleDelete(course.Id)}
                      className={`text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Delete course"
                      disabled={isLoading}
                    >
                      {isLoading ? <span className="animate-spin">⟳</span> : <TrashIcon className="h-4 w-4" />}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-surface-500 dark:text-surface-400">
                  {isLoading ? "Loading courses..." : "No courses found matching your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* New Course Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-lg"
            >
              <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Add New Course</h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Course Code*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HashIcon className="h-4 w-4 text-surface-400" />
                      </div>
                      <input
                        type="text"
                        name="code"
                        placeholder="CS101"
                        className="form-input pl-9"
                        value={newCourse.code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Department*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingIcon className="h-4 w-4 text-surface-400" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        placeholder="Computer Science"
                        className="form-input pl-9"
                        value={newCourse.department}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Course Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpenIcon className="h-4 w-4 text-surface-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Introduction to Computer Science"
                      className="form-input pl-9"
                      value={newCourse.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Instructor*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-surface-400" />
                    </div>
                    <input
                      type="text"
                      name="instructor"
                      placeholder="Dr. Jane Smith"
                      className="form-input pl-9"
                      value={newCourse.instructor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      name="credits"
                      min="1"
                      max="6"
                      className="form-input"
                      value={newCourse.credits}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      className="form-input"
                      value={newCourse.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      className="form-input"
                      value={newCourse.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >Cancel</button>
                  <button
                    type="submit" 
                    disabled={isLoading}
                    className="btn btn-primary"
                  >Add Course
                  </button> 
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;