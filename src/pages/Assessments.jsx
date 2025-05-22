import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  CalendarClock,
  BookOpen,
  CheckCircle,
  FileText,
  BarChart3,
  AlertCircle,
  X,
  Save
} from 'lucide-react';

// Sample assessment data
const assessmentsData = [
  {
    id: 1,
    title: 'Midterm Examination',
    type: 'Exam',
    course: 'Introduction to Programming',
    dueDate: new Date(2023, 9, 15),
    status: 'Upcoming',
    totalPoints: 100,
    description: 'Comprehensive examination covering modules 1-5 including practical coding exercises.',
    questions: 20,
    duration: 120
  },
  {
    id: 2,
    title: 'Database Design Project',
    type: 'Project',
    course: 'Database Systems',
    dueDate: new Date(2023, 9, 20),
    status: 'Published',
    totalPoints: 150,
    description: 'Design and implement a normalized database for a business case scenario.',
    questions: null,
    duration: null
  },
  {
    id: 3,
    title: 'Weekly Quiz 5',
    type: 'Quiz',
    course: 'Web Development',
    dueDate: new Date(2023, 9, 5),
    status: 'Completed',
    totalPoints: 20,
    description: 'Quick assessment on HTML, CSS and basic JavaScript concepts.',
    questions: 10,
    duration: 30
  },
  {
    id: 4,
    title: 'Final Project Presentation',
    type: 'Presentation',
    course: 'Software Engineering',
    dueDate: new Date(2023, 11, 10),
    status: 'Upcoming',
    totalPoints: 200,
    description: 'Team presentation of the final software project including demo and code review.',
    questions: null,
    duration: 45
  },
  {
    id: 5,
    title: 'Research Paper',
    type: 'Assignment',
    course: 'Computer Networks',
    dueDate: new Date(2023, 10, 28),
    status: 'Draft',
    totalPoints: 100,
    description: 'Research paper on emerging networking technologies and their applications.',
    questions: null,
    duration: null
  }
];

const assessmentTypes = ['All Types', 'Exam', 'Quiz', 'Project', 'Assignment', 'Presentation'];
const statusOptions = ['All Statuses', 'Draft', 'Published', 'Upcoming', 'In Progress', 'Completed'];
const courseOptions = [
  'All Courses',
  'Introduction to Programming',
  'Database Systems',
  'Web Development',
  'Software Engineering',
  'Computer Networks',
  'Data Structures and Algorithms'
];

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Format date function
  const formatDate = (date) => {
    return format(date, 'MMM dd, yyyy');
  };

  // Load assessments
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssessments(assessmentsData);
      setFilteredAssessments(assessmentsData);
      setLoading(false);
    }, 800);
  }, []);

  // Filter assessments
  useEffect(() => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter(assessment => 
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'All Types') {
      filtered = filtered.filter(assessment => assessment.type === selectedType);
    }

    if (selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(assessment => assessment.status === selectedStatus);
    }

    if (selectedCourse !== 'All Courses') {
      filtered = filtered.filter(assessment => assessment.course === selectedCourse);
    }

    setFilteredAssessments(filtered);
  }, [searchTerm, selectedType, selectedStatus, selectedCourse, assessments]);

  // Handle assessment click to view details
  const handleAssessmentClick = (assessment) => {
    setCurrentAssessment(assessment);
    setIsViewModalOpen(true);
  };

  // Handle edit assessment
  const handleEditAssessment = (e, assessment) => {
    e.stopPropagation();
    setCurrentAssessment(assessment);
    setIsEditModalOpen(true);
  };

  // Handle delete assessment
  const handleDeleteAssessment = (e, assessment) => {
    e.stopPropagation();
    setCurrentAssessment(assessment);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete assessment
  const confirmDeleteAssessment = () => {
    const updatedAssessments = assessments.filter(a => a.id !== currentAssessment.id);
    setAssessments(updatedAssessments);
    toast.success(`Assessment "${currentAssessment.title}" has been deleted.`);
    setIsDeleteModalOpen(false);
  };

  // Save assessment (edit or create)
  const saveAssessment = (assessment, isNew = false) => {
    if (isNew) {
      // Add new assessment
      const newAssessment = {
        ...assessment,
        id: assessments.length + 1
      };
      setAssessments([...assessments, newAssessment]);
      toast.success(`New assessment "${assessment.title}" has been created.`);
      setIsCreateModalOpen(false);
    } else {
      // Update existing assessment
      const updatedAssessments = assessments.map(a => 
        a.id === assessment.id ? assessment : a
      );
      setAssessments(updatedAssessments);
      toast.success(`Assessment "${assessment.title}" has been updated.`);
      setIsEditModalOpen(false);
    }
  };

  // Create a new assessment
  const handleCreateAssessment = () => {
    setCurrentAssessment({
      id: null,
      title: '',
      type: 'Quiz',
      course: courseOptions[1],
      dueDate: new Date(),
      status: 'Draft',
      totalPoints: 0,
      description: '',
      questions: 0,
      duration: 0
    });
    setIsCreateModalOpen(true);
  };

  // Render assessment actions
  const renderAssessmentActions = (assessment) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleAssessmentClick(assessment);
        }}
        className="p-1 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
        title="View Details"
      >
        <Eye size={18} />
      </button>
      <button 
        onClick={(e) => handleEditAssessment(e, assessment)}
        className="p-1 text-surface-500 hover:text-secondary dark:text-surface-400 dark:hover:text-secondary-light"
        title="Edit Assessment"
      >
        <Edit size={18} />
      </button>
      <button 
        onClick={(e) => handleDeleteAssessment(e, assessment)}
        className="p-1 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400"
        title="Delete Assessment"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  // Render assessment status badge
  const renderStatusBadge = (status) => {
    const statusClasses = {
      Draft: "bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
      Published: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Upcoming: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      "In Progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Assessments</h1>
        <button
          onClick={handleCreateAssessment}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-1" />
          New Assessment
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Total Assessments</p>
              <p className="font-semibold text-xl">{assessments.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Completed</p>
              <p className="font-semibold text-xl">
                {assessments.filter(a => a.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-lg">
              <CalendarClock className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Upcoming</p>
              <p className="font-semibold text-xl">
                {assessments.filter(a => a.status === 'Upcoming').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
              <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Avg. Score</p>
              <p className="font-semibold text-xl">76.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-surface-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Assessment Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowStatusDropdown(false);
                  setShowCourseDropdown(false);
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter size={16} />
                <span>{selectedType}</span>
                <ChevronDown size={16} />
              </button>
              {showTypeDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
                  <ul className="py-1">
                    {assessmentTypes.map(type => (
                      <li key={type}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700"
                          onClick={() => {
                            setSelectedType(type);
                            setShowTypeDropdown(false);
                          }}
                        >
                          {type}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowTypeDropdown(false);
                  setShowCourseDropdown(false);
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter size={16} />
                <span>{selectedStatus}</span>
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
                  <ul className="py-1">
                    {statusOptions.map(status => (
                      <li key={status}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700"
                          onClick={() => {
                            setSelectedStatus(status);
                            setShowStatusDropdown(false);
                          }}
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Course Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCourseDropdown(!showCourseDropdown);
                  setShowTypeDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <BookOpen size={16} />
                <span className="truncate max-w-[120px]">{selectedCourse}</span>
                <ChevronDown size={16} />
              </button>
              {showCourseDropdown && (
                <div className="absolute z-10 mt-1 w-60 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
                  <ul className="py-1">
                    {courseOptions.map(course => (
                      <li key={course}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 truncate"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowCourseDropdown(false);
                          }}
                        >
                          {course}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-surface-200 dark:bg-surface-700 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-surface-200 dark:bg-surface-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => (
                    <motion.tr 
                      key={assessment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer"
                      onClick={() => handleAssessmentClick(assessment)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.course}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(assessment.dueDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{renderStatusBadge(assessment.status)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">{renderAssessmentActions(assessment)}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle size={36} className="text-surface-400" />
                        <span className="text-lg font-medium">No assessments found</span>
                        <p>Try adjusting your filters or create a new assessment</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Assessment Modal */}
      {isViewModalOpen && currentAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-2xl mx-4"
          >
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-semibold">{currentAssessment.title}</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Type</p>
                  <p className="font-medium">{currentAssessment.type}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Course</p>
                  <p className="font-medium">{currentAssessment.course}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Due Date</p>
                  <p className="font-medium">{formatDate(currentAssessment.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Status</p>
                  <div className="mt-1">{renderStatusBadge(currentAssessment.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total Points</p>
                  <p className="font-medium">{currentAssessment.totalPoints}</p>
                </div>
                {currentAssessment.questions && (
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Questions</p>
                    <p className="font-medium">{currentAssessment.questions}</p>
                  </div>
                )}
                {currentAssessment.duration && (
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Duration</p>
                    <p className="font-medium">{currentAssessment.duration} minutes</p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Description</p>
                <p>{currentAssessment.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-surface-200 dark:border-surface-700">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="btn btn-secondary"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-md mx-4"
          >
            <div className="p-4 flex flex-col items-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Delete Assessment</h2>
              <p className="text-center text-surface-600 dark:text-surface-300 mb-4">
                Are you sure you want to delete "{currentAssessment.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteAssessment}
                  className="btn flex-1 bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>

      {/* Create/Edit Assessment Modal */}
      {(isCreateModalOpen || isEditModalOpen) && currentAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-2xl mx-4"
          >
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-semibold">
                {isCreateModalOpen ? 'Create New Assessment' : 'Edit Assessment'}
              </h2>
              <button 
                onClick={() => isCreateModalOpen ? setIsCreateModalOpen(false) : setIsEditModalOpen(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                saveAssessment(currentAssessment, isCreateModalOpen);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Assessment Title
                    </label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={currentAssessment.title}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Type
                    </label>
                    <select
                      className="form-select w-full"
                      value={currentAssessment.type}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, type: e.target.value})}
                    >
                      {assessmentTypes.filter(type => type !== 'All Types').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Course
                    </label>
                    <select
                      className="form-select w-full"
                      value={currentAssessment.course}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, course: e.target.value})}
                    >
                      {courseOptions.filter(course => course !== 'All Courses').map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-input w-full"
                      value={format(currentAssessment.dueDate, 'yyyy-MM-dd')}
                      onChange={(e) => setCurrentAssessment({
                        ...currentAssessment, 
                        dueDate: new Date(e.target.value)
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      className="form-select w-full"
                      value={currentAssessment.status}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, status: e.target.value})}
                    >
                      {statusOptions.filter(status => status !== 'All Statuses').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Total Points
                    </label>
                    <input
                      type="number"
                      className="form-input w-full"
                      value={currentAssessment.totalPoints}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, totalPoints: parseInt(e.target.value, 10)})}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="form-textarea w-full"
                      rows="3"
                      value={currentAssessment.description}
                      onChange={(e) => setCurrentAssessment({...currentAssessment, description: e.target.value})}
                    ></textarea>
                  </div>
                  {currentAssessment.type === 'Exam' || currentAssessment.type === 'Quiz' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={currentAssessment.questions || 0}
                          onChange={(e) => setCurrentAssessment({...currentAssessment, questions: parseInt(e.target.value, 10)})}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={currentAssessment.duration || 0}
                          onChange={(e) => setCurrentAssessment({...currentAssessment, duration: parseInt(e.target.value, 10)})}
                          min="0"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button 
                    type="button"
                    onClick={() => isCreateModalOpen ? setIsCreateModalOpen(false) : setIsEditModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    <Save size={16} className="mr-1" />
                    {isCreateModalOpen ? 'Create Assessment' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
  );
};

export default Assessments;