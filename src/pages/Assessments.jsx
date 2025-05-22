import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const Assessments = () => {
  // Mock data for assessments
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: "Midterm Examination",
      type: "exam",
      course: "CS101 - Introduction to Computer Science",
      dueDate: "2023-10-15T14:00:00",
      status: "completed",
      totalPoints: 100,
      averageScore: 78.5,
      passingRate: 92,
      description: "Comprehensive exam covering chapters 1-5 of the textbook and all lecture materials.",
      questions: 25,
      duration: 120,
      gradingComplete: true,
      gradeDistribution: {
        "A": 12,
        "B": 18, 
        "C": 8,
        "D": 2,
        "F": 0
      }
    },
    {
      id: 2,
      title: "Programming Assignment 2",
      type: "assignment",
      course: "CS101 - Introduction to Computer Science",
      dueDate: "2023-10-25T23:59:00",
      status: "active",
      totalPoints: 50,
      averageScore: null,
      passingRate: null,
      description: "Implement a basic sorting algorithm and analyze its time complexity.",
      questions: 5,
      duration: 0,
      gradingComplete: false,
      gradeDistribution: null
    },
    {
      id: 3,
      title: "Weekly Quiz 3",
      type: "quiz",
      course: "MATH201 - Calculus II",
      dueDate: "2023-10-10T10:30:00",
      status: "completed",
      totalPoints: 20,
      averageScore: 16.7,
      passingRate: 95,
      description: "Short quiz on integration techniques.",
      questions: 10,
      duration: 15,
      gradingComplete: true,
      gradeDistribution: {
        "A": 20,
        "B": 5, 
        "C": 3,
        "D": 1,
        "F": 1
      }
    },
    {
      id: 4,
      title: "Research Project Proposal",
      type: "project",
      course: "BIO150 - Fundamentals of Biology",
      dueDate: "2023-11-05T23:59:00",
      status: "active",
      totalPoints: 100,
      averageScore: null,
      passingRate: null,
      description: "Submit a research proposal on a topic related to cell biology.",
      questions: 1,
      duration: 0,
      gradingComplete: false,
      gradeDistribution: null
    },
    {
      id: 5,
      title: "Lab Report 2",
      type: "assignment",
      course: "PHYS210 - Mechanics & Waves",
      dueDate: "2023-10-20T16:00:00",
      status: "active",
      totalPoints: 50,
      averageScore: null,
      passingRate: null,
      description: "Write a report on the pendulum experiment conducted in lab.",
      questions: 8,
      duration: 0,
      gradingComplete: false,
      gradeDistribution: null
    },
    {
      id: 6,
      title: "Final Examination",
      type: "exam",
      course: "ENG102 - Academic Writing",
      dueDate: "2023-12-15T09:00:00",
      status: "upcoming",
      totalPoints: 150,
      averageScore: null,
      passingRate: null,
      description: "Comprehensive examination covering all course materials.",
      questions: 50,
      duration: 180,
      gradingComplete: false,
      gradeDistribution: null
    }
  ]);

  // State for new assessment form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedAssessment, setExpandedAssessment] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    type: "quiz",
    course: "",
    dueDate: "",
    status: "upcoming",
    totalPoints: 20,
    description: "",
    questions: 10,
    duration: 15
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssessment(prev => ({
      ...prev,
      [name]: ["totalPoints", "questions", "duration"].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  // Add new assessment
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAssessment.title || !newAssessment.course || !newAssessment.dueDate) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    if (isEditMode) {
      // Update existing assessment
      setAssessments(prev => prev.map(item => 
        item.id === newAssessment.id ? newAssessment : item
      ));
      toast.success("Assessment updated successfully!");
    } else {
      // Add new assessment
      const newId = assessments.length > 0 ? Math.max(...assessments.map(a => a.id)) + 1 : 1;
      
      setAssessments(prev => [
        ...prev,
        { 
          ...newAssessment, 
          id: newId,
          averageScore: null,
          passingRate: null,
          gradingComplete: false,
          gradeDistribution: null
        }
      ]);
      toast.success("Assessment created successfully!");
    }
    
    // Reset form and close
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setNewAssessment({
      title: "",
      type: "quiz",
      course: "",
      dueDate: "",
      status: "upcoming",
      totalPoints: 20,
      description: "",
      questions: 10,
      duration: 15
    });
    setIsFormOpen(false);
    setIsEditMode(false);
  };

  // Edit assessment
  const handleEdit = (assessment) => {
    setNewAssessment(assessment);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Delete assessment
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
      toast.success("Assessment deleted successfully!");
      
      // If the deleted assessment was expanded, collapse it
      if (expandedAssessment === id) {
        setExpandedAssessment(null);
      }
    }
  };

  // Toggle assessment details
  const toggleAssessmentDetails = (id) => {
    setExpandedAssessment(expandedAssessment === id ? null : id);
  };

  // Mark assessment as complete
  const markAsComplete = (id) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === id 
        ? {...assessment, status: "completed", gradingComplete: true} 
        : assessment
    ));
    toast.success("Assessment marked as completed!");
  };

  // Publish grades
  const publishGrades = (id) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === id 
        ? {...assessment, gradingComplete: true} 
        : assessment
    ));
    toast.success("Grades published successfully!");
  };

  // Clone assessment
  const cloneAssessment = (assessment) => {
    const newId = assessments.length > 0 ? Math.max(...assessments.map(a => a.id)) + 1 : 1;
    const clonedAssessment = {
      ...assessment,
      id: newId,
      title: `Copy of ${assessment.title}`,
      status: "upcoming",
      averageScore: null,
      passingRate: null,
      gradingComplete: false,
      gradeDistribution: null
    };
    
    setAssessments(prev => [...prev, clonedAssessment]);
    toast.success("Assessment cloned successfully!");
  };

  // Filter and sort assessments
  const filteredAssessments = assessments
    .filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.course.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || assessment.type === typeFilter;
      
      const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return sortDirection === 'asc' 
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      } else if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'totalPoints') {
        return sortDirection === 'asc'
          ? a.totalPoints - b.totalPoints
          : b.totalPoints - a.totalPoints;
      }
      return 0;
    });

  // Calculate assessment statistics
  const assessmentStats = {
    total: assessments.length,
    active: assessments.filter(a => a.status === 'active').length,
    completed: assessments.filter(a => a.status === 'completed').length,
    upcoming: assessments.filter(a => a.status === 'upcoming').length,
    needsGrading: assessments.filter(a => a.status === 'active' && !a.gradingComplete).length
  };

  // Get assessment type counts for distribution
  const typeDistribution = assessments.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  // Icons
  const SearchIcon = getIcon('search');
  const PlusIcon = getIcon('plus');
  const ClipboardIcon = getIcon('clipboard-check');
  const XIcon = getIcon('x');
  const EditIcon = getIcon('edit');
  const TrashIcon = getIcon('trash-2');
  const CalendarIcon = getIcon('calendar');
  const BookOpenIcon = getIcon('book-open');
  const ClockIcon = getIcon('clock');
  const HelpCircleIcon = getIcon('help-circle');
  const FileTextIcon = getIcon('file-text');
  const AwardIcon = getIcon('award');
  const CopyIcon = getIcon('copy');
  const ChevronDownIcon = getIcon('chevron-down');
  const ChevronUpIcon = getIcon('chevron-up');
  const CheckIcon = getIcon('check');
  const AlertCircleIcon = getIcon('alert-circle');
  const BarChartIcon = getIcon('bar-chart');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Assessments</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage quizzes, exams, assignments and other student assessments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
              <ClipboardIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total</p>
              <p className="text-xl font-semibold text-surface-900 dark:text-white">{assessmentStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Active</p>
              <p className="text-xl font-semibold text-surface-900 dark:text-white">{assessmentStats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <AwardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
              <p className="text-xl font-semibold text-surface-900 dark:text-white">{assessmentStats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Upcoming</p>
              <p className="text-xl font-semibold text-surface-900 dark:text-white">{assessmentStats.upcoming}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <AlertCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Needs Grading</p>
              <p className="text-xl font-semibold text-surface-900 dark:text-white">{assessmentStats.needsGrading}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="card mb-6">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <ClipboardIcon className="h-5 w-5 text-primary" />
            <span>Assessment Management</span>
          </h2>
          
          <button 
            onClick={() => {
              setIsEditMode(false);
              setIsFormOpen(true);
            }}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Assessment</span>
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
                placeholder="Search assessments..."
                className="form-input pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                className="form-input bg-white dark:bg-surface-800"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="quiz">Quizzes</option>
                <option value="exam">Exams</option>
                <option value="assignment">Assignments</option>
                <option value="project">Projects</option>
              </select>
              
              <select
                className="form-input bg-white dark:bg-surface-800"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                className="form-input bg-white dark:bg-surface-800"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [newSortBy, newSortDirection] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortDirection(newSortDirection);
                }}
              >
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="totalPoints-desc">Points (Highest)</option>
                <option value="totalPoints-asc">Points (Lowest)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Assessments List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Assessment</th>
                <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Course</th>
                <th className="py-3 px-4 text-center font-semibold">Type</th>
                <th className="py-3 px-4 text-center font-semibold hidden lg:table-cell">Due Date</th>
                <th className="py-3 px-4 text-center font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Points</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <>
                    <motion.tr 
                      key={assessment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleAssessmentDetails(assessment.id)}
                            className="mr-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300"
                          >
                            {expandedAssessment === assessment.id ? 
                              <ChevronUpIcon className="h-4 w-4" /> : 
                              <ChevronDownIcon className="h-4 w-4" />
                            }
                          </button>
                          <div>
                            <div className="font-medium text-surface-900 dark:text-white">{assessment.title}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                              {assessment.questions} {assessment.questions === 1 ? 'question' : 'questions'}
                              {assessment.duration > 0 && ` • ${assessment.duration} min`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-surface-700 dark:text-surface-300 hidden md:table-cell">{assessment.course}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.type === 'quiz' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                            : assessment.type === 'exam'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : assessment.type === 'assignment'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          <span className="capitalize">{assessment.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-surface-600 dark:text-surface-400 hidden lg:table-cell">
                        {new Date(assessment.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : assessment.status === 'upcoming'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          <span className="capitalize">{assessment.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-surface-900 dark:text-white">
                        {assessment.totalPoints}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(assessment)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            aria-label="Edit assessment"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => cloneAssessment(assessment)}
                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                            aria-label="Clone assessment"
                          >
                            <CopyIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(assessment.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            aria-label="Delete assessment"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    
                    {/* Expanded Details */}
                    {expandedAssessment === assessment.id && (
                      <tr>
                        <td colSpan="7" className="bg-surface-50 dark:bg-surface-800/30 px-4 py-3">
                          <div className="border-l-4 border-primary pl-4">
                            <div className="mb-4">
                              <h4 className="font-semibold text-surface-900 dark:text-white mb-2">Description</h4>
                              <p className="text-surface-700 dark:text-surface-300 text-sm">
                                {assessment.description || "No description provided."}
                              </p>
                            </div>
                            
                            {assessment.status === 'completed' && assessment.averageScore !== null && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-surface-900 dark:text-white mb-2">Performance</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-white dark:bg-surface-800 rounded-lg p-3 text-center">
                                    <p className="text-sm text-surface-500 dark:text-surface-400">Average Score</p>
                                    <p className="text-xl font-semibold text-surface-900 dark:text-white">
                                      {assessment.averageScore.toFixed(1)}
                                    </p>
                                  </div>
                                  <div className="bg-white dark:bg-surface-800 rounded-lg p-3 text-center">
                                    <p className="text-sm text-surface-500 dark:text-surface-400">Passing Rate</p>
                                    <p className="text-xl font-semibold text-surface-900 dark:text-white">
                                      {assessment.passingRate}%
                                    </p>
                                  </div>
                                  <div className="bg-white dark:bg-surface-800 rounded-lg p-3 text-center">
                                    <p className="text-sm text-surface-500 dark:text-surface-400">Grade Distribution</p>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                      {assessment.gradeDistribution && Object.entries(assessment.gradeDistribution).map(([grade, count]) => (
                                        <div 
                                          key={grade}
                                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium
                                            ${selectedGrade === grade ? 'ring-2 ring-primary' : ''}
                                            ${grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                              grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                              grade === 'C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                              grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                                          onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                                        >
                                          {grade}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 justify-end">
                              {assessment.status === 'active' && !assessment.gradingComplete && (
                                <button
                                  onClick={() => publishGrades(assessment.id)}
                                  className="btn btn-outline text-sm"
                                >
                                  Publish Grades
                                </button>
                              )}
                              
                              {assessment.status === 'active' && (
                                <button
                                  onClick={() => markAsComplete(assessment.id)}
                                  className="btn btn-primary text-sm"
                                >
                                  Mark as Complete
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-surface-500 dark:text-surface-400">
                    No assessments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* New Assessment Form Modal */}
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
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {isEditMode ? 'Edit Assessment' : 'Create New Assessment'}
                </h3>
                <button 
                  onClick={resetForm}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 form-label-required">
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Midterm Examination"
                    className="form-input"
                    value={newAssessment.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 form-label-required">
                      Assessment Type
                    </label>
                    <select
                      name="type"
                      className="form-input"
                      value={newAssessment.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="quiz">Quiz</option>
                      <option value="exam">Exam</option>
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 form-label-required">
                      Status
                    </label>
                    <select
                      name="status"
                      className="form-input"
                      value={newAssessment.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 form-label-required">
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    placeholder="CS101 - Introduction to Computer Science"
                    className="form-input"
                    value={newAssessment.course}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 form-label-required">
                    Due Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    className="form-input"
                    value={newAssessment.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Total Points
                    </label>
                    <input
                      type="number"
                      name="totalPoints"
                      min="1"
                      className="form-input"
                      value={newAssessment.totalPoints}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Questions
                    </label>
                    <input
                      type="number"
                      name="questions"
                      min="1"
                      className="form-input"
                      value={newAssessment.questions}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="0"
                      className="form-input"
                      value={newAssessment.duration}
                      onChange={handleInputChange}
                      placeholder="0 for no time limit"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-input"
                    placeholder="Provide details about this assessment..."
                    value={newAssessment.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isEditMode ? 'Update Assessment' : 'Create Assessment'}
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

export default Assessments;