import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getStudents, createStudent } from '../services/studentService';
import { logActivity } from '../services/activityLogService';

// Mock student data with academic history and transcripts
const mockStudents = [
  {
    id: 1,
    name: "Emma Johnson",
    studentId: "ST20210001",
    email: "emma.johnson@example.com",
    program: "Computer Science",
    yearLevel: 3,
    gpa: 3.8,
    credits: 78,
    status: "Active",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
    academicHistory: [
      { semester: "Fall 2021", courses: [
        { code: "CS101", name: "Introduction to Programming", grade: "A", credits: 3 },
        { code: "MATH201", name: "Calculus I", grade: "A-", credits: 4 },
        { code: "ENG102", name: "Academic Writing", grade: "B+", credits: 3 },
      ]},
      { semester: "Spring 2022", courses: [
        { code: "CS201", name: "Data Structures", grade: "A", credits: 4 },
        { code: "PHYS101", name: "Physics I", grade: "B", credits: 4 },
        { code: "STAT201", name: "Statistics", grade: "A-", credits: 3 },
      ]},
      { semester: "Fall 2022", courses: [
        { code: "CS301", name: "Algorithms", grade: "A-", credits: 4 },
        { code: "CS240", name: "Computer Architecture", grade: "B+", credits: 3 },
        { code: "MATH303", name: "Discrete Mathematics", grade: "A", credits: 3 },
      ]},
      { semester: "Spring 2023", courses: [
        { code: "CS350", name: "Operating Systems", grade: "B+", credits: 4 },
        { code: "CS330", name: "Database Systems", grade: "A", credits: 3 },
        { code: "CS320", name: "Software Engineering", grade: "A-", credits: 4 },
      ]},
    ],
    attendance: 92,
    enrollments: [],
    enrollmentHistory: [],
    schedule: {}
  },
  {
    id: 2,
    name: "Michael Chen",
    studentId: "ST20210002",
    email: "michael.chen@example.com",
    program: "Electrical Engineering",
    yearLevel: 2,
    gpa: 3.5,
    credits: 54,
    status: "Active",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    academicHistory: [
      { semester: "Fall 2021", courses: [
        { code: "EE101", name: "Introduction to Electrical Engineering", grade: "B+", credits: 3 },
        { code: "MATH201", name: "Calculus I", grade: "A", credits: 4 },
        { code: "PHYS101", name: "Physics I", grade: "B+", credits: 4 },
      ]},
      { semester: "Spring 2022", courses: [
        { code: "EE201", name: "Circuit Analysis", grade: "A-", credits: 4 },
        { code: "MATH202", name: "Calculus II", grade: "B", credits: 4 },
        { code: "CHEM101", name: "General Chemistry", grade: "B+", credits: 3 },
      ]},
      { semester: "Fall 2022", courses: [
        { code: "EE250", name: "Digital Logic Design", grade: "A", credits: 3 },
        { code: "EE230", name: "Electronics I", grade: "B+", credits: 4 },
        { code: "PHYS202", name: "Physics II", grade: "B", credits: 4 },
      ]},
    ],
    attendance: 88,
    enrollments: [],
    enrollmentHistory: [],
    schedule: {}
  },
  {
    id: 3,
    name: "Sophia Martinez",
    studentId: "ST20210003",
    email: "sophia.martinez@example.com",
    program: "Business Administration",
    yearLevel: 4,
    gpa: 3.9,
    credits: 105,
    status: "Active",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    academicHistory: [
      { semester: "Fall 2020", courses: [
        { code: "BUS101", name: "Introduction to Business", grade: "A", credits: 3 },
        { code: "ECON101", name: "Microeconomics", grade: "A", credits: 3 },
        { code: "MATH150", name: "Business Mathematics", grade: "A-", credits: 3 },
      ]},
      { semester: "Spring 2021", courses: [
        { code: "BUS201", name: "Organizational Behavior", grade: "A", credits: 3 },
        { code: "ECON102", name: "Macroeconomics", grade: "A-", credits: 3 },
        { code: "ACCT101", name: "Financial Accounting", grade: "A", credits: 3 },
      ]},
      { semester: "Fall 2021", courses: [
        { code: "MKT301", name: "Marketing Principles", grade: "A", credits: 3 },
        { code: "FIN301", name: "Corporate Finance", grade: "A-", credits: 3 },
        { code: "MGMT301", name: "Human Resource Management", grade: "A", credits: 3 },
      ]},
      { semester: "Spring 2022", courses: [
        { code: "BUS401", name: "Business Strategy", grade: "A", credits: 3 },
        { code: "MKT401", name: "Marketing Research", grade: "A-", credits: 3 },
        { code: "BUS410", name: "Business Ethics", grade: "A", credits: 3 },
      ]},
    ],
    attendance: 95,
    enrollments: [],
    enrollmentHistory: [],
    schedule: {}
  }
];

function Students() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [activeTab, setActiveTab] = useState('academic');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents(); 
  }, []);

  // Fetch students from database
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const studentsData = await getStudents();
      
      if (studentsData && studentsData.length > 0) {
        // For now, merge mock academic data with real student data
        // In a real app, we would fetch this data from the database
        const enhancedStudents = studentsData.map(student => {
          const mockData = mockStudents.find(mock => mock.studentId === student.studentId);
          return {
            ...student,
            id: student.Id,
            academicHistory: mockData?.academicHistory || [],
            attendance: student.attendance || mockData?.attendance || 90,
            enrollments: mockData?.enrollments || [],
            enrollmentHistory: mockData?.enrollmentHistory || [],
            schedule: mockData?.schedule || {}
          };
        });
      
        setStudents(enhancedStudents);
      } else {
        // Fall back to mock data if no data is returned
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
      setStudents(mockStudents); // Fallback to mock data on error
    } finally {
      setIsLoading(false);
    }
  };

  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    program: '',
    yearLevel: 1,
    status: 'Active',
    photo: ''
  });

  // Generate unique student ID
  const generateStudentId = () => {
    const maxId = students.length ? Math.max(...students.map(s => parseInt(s.studentId?.replace('ST', '') || '0'))) : 0;
    return `ST${String(maxId + 1).padStart(8, '0')}`;
  };

  // Icons
  const SearchIcon = getIcon('search');
  const UserIcon = getIcon('user');
  const GraduationCapIcon = getIcon('graduation-cap');
  const BarChartIcon = getIcon('bar-chart');
  const ClockIcon = getIcon('clock');
  const FileTextIcon = getIcon('file-text');
  const XIcon = getIcon('x');
  const DownloadIcon = getIcon('download');
  const MailIcon = getIcon('mail');
  const BookOpenIcon = getIcon('book-open');
  const AwardIcon = getIcon('award');
  const ClipboardListIcon = getIcon('clipboard-list');
  const ChevronDownIcon = getIcon('chevron-down');
  const ChevronUpIcon = getIcon('chevron-up');
  const BadgeCheckIcon = getIcon('badge-check');
  const PlusIcon = getIcon('plus');
  const UserPlusIcon = getIcon('user-plus');
  const MinusIcon = getIcon('minus');
  const AlertCircleIcon = getIcon('alert-circle');
  const AlertTriangleIcon = getIcon('alert-triangle');
  const CalendarIcon = getIcon('calendar');

  // Mock available courses
  const [availableCourses, setAvailableCourses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Alan Turing",
      department: "Computer Science",
      credits: 3,
      description: "An introduction to the fundamental concepts of computer science.",
      prerequisites: [],
      schedule: {
        days: ["Monday", "Wednesday"],
        timeStart: "10:00",
        timeEnd: "11:30",
        location: "Science Hall 101"
      },
      capacity: 40,
      enrolled: 32,
      term: "Fall 2023",
      program: "Computer Science",
      yearLevel: [1],
    },
    {
      id: 2,
      code: "MATH201",
      name: "Calculus II",
      instructor: "Dr. Katherine Johnson",
      department: "Mathematics",
      credits: 4,
      description: "A continuation of Calculus I, covering integration techniques, applications of integration, and infinite series.",
      prerequisites: ["MATH101"],
      schedule: {
        days: ["Tuesday", "Thursday"],
        timeStart: "13:00",
        timeEnd: "14:30",
        location: "Math Building 210"
      },
      capacity: 30,
      enrolled: 25,
      term: "Fall 2023",
      program: "Mathematics",
      yearLevel: [2],
    },
    {
      id: 3,
      code: "CS301",
      name: "Algorithms",
      instructor: "Dr. Donald Knuth",
      department: "Computer Science",
      credits: 4,
      description: "Design and analysis of algorithms. Algorithm complexity and efficiency.",
      prerequisites: ["CS201"],
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        timeStart: "14:00",
        timeEnd: "15:00",
        location: "Science Hall 203"
      },
      capacity: 35,
      enrolled: 30,
      term: "Fall 2023",
      program: "Computer Science",
      yearLevel: [3],
    },
    {
      id: 4,
      code: "BUS401",
      name: "Business Strategy",
      instructor: "Dr. Peter Drucker",
      department: "Business Administration",
      credits: 3,
      description: "Advanced concepts in business strategy and management.",
      prerequisites: ["BUS201", "BUS301"],
      schedule: {
        days: ["Tuesday", "Thursday"],
        timeStart: "10:00",
        timeEnd: "11:30",
        location: "Business Building 105"
      },
      capacity: 40,
      enrolled: 38,
      term: "Fall 2023",
      program: "Business Administration",
      yearLevel: [4],
    },
    {
      id: 5,
      code: "EE201",
      name: "Circuit Analysis",
      instructor: "Dr. Nikola Tesla",
      department: "Electrical Engineering",
      credits: 4,
      description: "Introduction to circuit analysis techniques and electrical components.",
      prerequisites: ["PHYS101"],
      schedule: {
        days: ["Monday", "Wednesday"],
        timeStart: "13:00",
        timeEnd: "14:30",
        location: "Engineering Hall 202"
      },
      capacity: 25,
      enrolled: 22,
      term: "Fall 2023",
      program: "Electrical Engineering",
      yearLevel: [2],
    }
  ]);

  // Check for course conflicts
  const checkScheduleConflict = (course, existingSchedule) => {
    // Check if the days overlap
    const conflictingDays = course.schedule.days.filter(day => 
      existingSchedule[day] && existingSchedule[day].some(slot => {
        const courseStart = parseInt(course.schedule.timeStart.replace(':', ''));
        const courseEnd = parseInt(course.schedule.timeEnd.replace(':', ''));
        const slotStart = parseInt(slot.timeStart.replace(':', ''));
        const slotEnd = parseInt(slot.timeEnd.replace(':', ''));
        
        // Check if time periods overlap
        return (courseStart <= slotEnd && courseEnd >= slotStart);
      })
    );
    
    return conflictingDays.length > 0;
  };

  // Check prerequisites
  const checkPrerequisites = (course, student) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true;
    }
    
    // Get all courses the student has taken
    const completedCourses = student.academicHistory.flatMap(term => 
      term.courses.map(c => c.code)
    );
    
    // Check if all prerequisites are in the completed courses
    const missingPrerequisites = course.prerequisites.filter(
      prereq => !completedCourses.includes(prereq)
    );
    
    return missingPrerequisites.length === 0 ? true : missingPrerequisites;
  };

  // Enroll in a course
  const enrollInCourse = (student, course) => {
    // Create updated student with new enrollment
    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        // Check if student already enrolled
        if (s.enrollments.some(enrollment => enrollment.courseId === course.id)) {
          toast.info("You are already enrolled in this course");
          return s;
        }
        
        // Check if course is at capacity
        if (course.enrolled >= course.capacity) {
          toast.error("This course has reached its enrollment capacity");
          return s;
        }
        
        // Initialize schedule if it doesn't exist
        const schedule = {...s.schedule};
        course.schedule.days.forEach(day => {
          if (!schedule[day]) {
            schedule[day] = [];
          }
        });
        
        // Check for schedule conflicts
        const hasConflict = checkScheduleConflict(course, schedule);
        if (hasConflict) {
          toast.error("This course conflicts with your current schedule");
          return s;
        }
        
        // Check prerequisites
        const prereqCheck = checkPrerequisites(course, s);
        if (prereqCheck !== true) {
          toast.error(`Missing prerequisites: ${prereqCheck.join(', ')}`);
          return s;
        }
        
        // Add course to schedule
        course.schedule.days.forEach(day => {
          schedule[day] = [
            ...schedule[day],
            {
              courseId: course.id,
              courseCode: course.code,
              courseName: course.name,
              timeStart: course.schedule.timeStart,
              timeEnd: course.schedule.timeEnd,
              location: course.schedule.location,
              color: `hsl(${Math.random() * 360}, 70%, 45%)`
            }
          ];
        });
        
        // Add enrollment record
        const newEnrollment = {
          id: Date.now(),
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          instructor: course.instructor,
          credits: course.credits,
          term: course.term,
          enrolledDate: new Date().toISOString(),
          status: 'enrolled'
        };
        
        toast.success(`Successfully enrolled in ${course.code}: ${course.name}`);
        
        return {
          ...s,
          schedule,
          enrollments: [...s.enrollments, newEnrollment],
          enrollmentHistory: [...s.enrollmentHistory, 
            {...newEnrollment, action: 'enrolled', date: new Date().toISOString()}
          ]
        };
      }
      return s;
    });
    
    setStudents(updatedStudents);
    
    // Update available courses with increased enrollment
    setAvailableCourses(availableCourses.map(c => 
      c.id === course.id ? {...c, enrolled: c.enrolled + 1} : c
    ));
  };

  // Drop a course
  const dropCourse = (student, enrollmentId) => {
    // Find the enrollment
    const studentToUpdate = students.find(s => s.id === student.id);
    const enrollment = studentToUpdate.enrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
      toast.error("Enrollment not found");
      return;
    }
    
    // Create updated student without this enrollment
    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        // Remove from enrollments
        const updatedEnrollments = s.enrollments.filter(e => e.id !== enrollmentId);
        
        // Remove from schedule
        const updatedSchedule = {...s.schedule};
        Object.keys(updatedSchedule).forEach(day => {
          updatedSchedule[day] = updatedSchedule[day].filter(
            slot => slot.courseId !== enrollment.courseId
          );
        });
        
        toast.success(`Successfully dropped ${enrollment.courseCode}: ${enrollment.courseName}`);
        
        return {
          ...s,
          schedule: updatedSchedule,
          enrollments: updatedEnrollments,
          enrollmentHistory: [...s.enrollmentHistory, 
            {...enrollment, action: 'dropped', date: new Date().toISOString()}
          ]
        };
      }
      return s;
    });
    
    setStudents(updatedStudents);
    
    // Update available courses with decreased enrollment
    setAvailableCourses(availableCourses.map(c => 
      c.id === enrollment.courseId ? {...c, enrolled: c.enrolled - 1} : c
    ));
  };

  // Filter students based on search and program filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = programFilter === '' || student.program === programFilter;
    
    return matchesSearch && matchesProgram;
  });

  // Get unique programs for filter dropdown
  const uniquePrograms = [...new Set(students.map(student => student.program))];

  // Toggle expanded student
  const toggleStudentExpand = (studentId) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
    } else {
      setExpandedStudentId(studentId);
    }
  };

  // View transcript
  const viewTranscript = (student) => {
    setSelectedStudent(student);
    setShowTranscript(true);
  };

  // Download transcript
  const downloadTranscript = (student) => {
    toast.info(`Transcript for ${student.name} is being downloaded...`);
    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast.success(`Transcript for ${student.name} has been downloaded successfully!`);
    }, 1500);
  };

  // Send notification to student
  const notifyStudent = (student) => {
    toast.info(`Sending notification to ${student.name}...`);
    setTimeout(() => {
      toast.success(`Notification sent to ${student.name} successfully!`);
    }, 1000);
  };

  // Handle new student form submission
  const handleNewStudentSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newStudentForm.name.trim()) {
      toast.error('Student name is required');
      return;
    }
    
    if (!newStudentForm.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudentForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!newStudentForm.program.trim()) {
      toast.error('Program is required');
      return;
    }
    
    // Check if email already exists
    if (students.some(s => s.email.toLowerCase() === newStudentForm.email.toLowerCase())) {
      toast.error('A student with this email already exists');
      return;
    }
    
    const studentData = {
      Name: newStudentForm.name.trim(),
      studentId: generateStudentId(),
      email: newStudentForm.email.trim(),
      program: newStudentForm.program.trim(),
      yearLevel: parseInt(newStudentForm.yearLevel),
      status: newStudentForm.status,
      photo: newStudentForm.photo.trim() || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
      gpa: 0,
      credits: 0,
      attendance: 100
    };
    
    try {
      setIsLoading(true);
      const newStudent = await createStudent(studentData);
      
      if (newStudent) {
        // Log activity for student creation
        await logActivity({
          type: "student",
          action: "Student Created",
          details: `New student ${studentData.Name} added to the system`,
          icon: "user-plus",
          user: "Admin User",
          timestamp: new Date().toISOString()
        });
        
        toast.success(`Student ${studentData.Name} has been added successfully!`);
      }
      
      await fetchStudents();
      setShowNewStudentModal(false);
      resetNewStudentForm();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetNewStudentForm = () => {
    setNewStudentForm({
      name: '',
      email: '',
      program: '',
      yearLevel: 1,
      status: 'Active',
      photo: ''
    });
  };

  const updateNewStudentForm = (field, value) => {
    setNewStudentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4 md:mb-0 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Student Management
        </h1>
        {isLoading && (
          <div className="text-sm text-surface-500 animate-pulse ml-2">
            Loading...
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">


            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4"
            />
          </div>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Programs</option>
            {uniquePrograms.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
          <button 
            className="btn btn-primary shadow-lg hover:shadow-xl"
            onClick={() => setShowNewStudentModal(true)}
            disabled={isLoading}
          > 
            <UserPlusIcon className="w-4 h-4 mr-2" />
            New Student
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.length > 0 ? (
          isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="student-card animate-pulse">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-full bg-surface-300 dark:bg-surface-600"></div>
                      <div className="space-y-3">
                        <div className="h-5 w-48 bg-surface-300 dark:bg-surface-600 rounded"></div>
                        <div className="h-4 w-72 bg-surface-200 dark:bg-surface-700 rounded"></div>
                      </div>
                    </div>
                    <div className="space-x-2 flex">
                      <div className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
                      <div className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleStudentExpand(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <img 
                      src={student.photo} 
                      alt={student.name} 
                      className="student-photo"
                    />
                    <div>
                      <h3 className="font-bold text-xl text-surface-900 dark:text-white">
                        {student.name}
                      </h3>
                      <div className="flex items-center text-sm text-surface-600 dark:text-surface-400 space-x-3 mt-1">
                        <span>{student.studentId}</span>
                        <span>•</span>
                        <span>{student.program}</span>
                        <span>•</span>
                        <span>Year {student.yearLevel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 px-3 py-2 rounded-lg">
                      <GraduationCapIcon className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-surface-900 dark:text-white">GPA: {student.gpa}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-secondary/10 dark:bg-secondary/20 px-3 py-2 rounded-lg">
                      <BadgeCheckIcon className="w-4 h-4 text-secondary" />
                      <span className="font-semibold text-surface-900 dark:text-white">{student.credits} Credits</span>
                    </div>
                    <div className="status-badge bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      {student.status}
                    </div>
                    {expandedStudentId === student.id ? (
                      <ChevronUpIcon className="w-6 h-6 text-surface-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6 text-surface-500 transition-transform duration-200" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Student Details */}
              <AnimatePresence>
                {expandedStudentId === student.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-surface-200 dark:border-surface-700"
                  >
                    <div className="p-6 bg-gradient-to-r from-surface-50 to-white dark:from-surface-800 dark:to-surface-750">
                      {/* Tabs */}
                      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6 bg-white dark:bg-surface-700 rounded-t-lg">
                        <button
                          className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`}
                          onClick={() => setActiveTab('academic')}
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>Academic History</span>
                          </div>
                        </button>
                        <button
                          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
                          onClick={() => setActiveTab('performance')}
                        >
                          <div className="flex items-center space-x-2">
                            <BarChartIcon className="w-4 h-4" />
                            <span>Performance</span>
                          </div>
                        </button>
                        <button
                          className={`tab-button ${activeTab === 'enrollment' ? 'active' : ''}`}
                          onClick={() => setActiveTab('enrollment')}
                        >
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Enrollment</span>
                          </div>
                        </button>
                      </div>

                      {/* Academic History Tab */}
                      {activeTab === 'academic' && (
                        <div className="space-y-6">
                          <div className="flex flex-wrap gap-3">
                            <button 
                              className="btn btn-primary shadow-md hover:shadow-lg"
                              onClick={() => viewTranscript(student)}
                            >
                              <FileTextIcon className="w-4 h-4 mr-2" />
                              View Transcript
                            </button>
                            <button 
                              className="btn btn-outline shadow-md hover:shadow-lg"
                              onClick={() => downloadTranscript(student)}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download Transcript
                            </button>
                            <button 
                              className="btn btn-outline shadow-md hover:shadow-lg"
                              onClick={() => notifyStudent(student)}
                            >
                              <MailIcon className="w-4 h-4 mr-2" />
                              Contact Student
                            </button>
                          </div>

                          <div className="space-y-4">
                            {student.academicHistory.map((term, index) => (
                              <div key={index} className="academic-term">
                                <h4 className="font-bold text-xl text-surface-800 dark:text-surface-200 mb-4 pl-4">{term.semester}</h4>
                                <div className="bg-white dark:bg-surface-700 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-600">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="text-left text-sm text-surface-600 dark:text-surface-400 border-b border-surface-200 dark:border-surface-600">
                                        <th className="pb-3 font-semibold">Course</th>
                                        <th className="pb-3 font-semibold">Name</th>
                                        <th className="pb-3 font-semibold">Credits</th>
                                        <th className="pb-3 font-semibold">Grade</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100 dark:divide-surface-600">
                                      {term.courses.map((course, courseIndex) => (
                                        <tr key={courseIndex} className="hover:bg-surface-50 dark:hover:bg-surface-600 transition-colors duration-150">
                                          <td className="py-4 font-semibold text-primary">{course.code}</td>
                                          <td className="py-4 text-surface-900 dark:text-surface-100">{course.name}</td>
                                          <td className="py-4 text-surface-700 dark:text-surface-300">{course.credits}</td>
                                          <td className="py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                              course.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                              course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                              course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                              {course.grade}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Performance Tab */}
                      {activeTab === 'performance' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="card p-6">
                            <h4 className="font-medium text-surface-800 dark:text-surface-200 mb-2">Academic Standing</h4>
                            <div className="flex items-center space-x-2">
                              <AwardIcon className="w-5 h-5 text-primary" />
                              <span className="text-lg font-semibold">
                                {student.gpa >= 3.7 ? 'Excellent' : 
                                 student.gpa >= 3.0 ? 'Good' : 
                                 student.gpa >= 2.0 ? 'Satisfactory' : 'Needs Improvement'}
                              </span>
                            </div>
                            <p className="text-surface-600 dark:text-surface-400 mt-2">
                              Current GPA: <span className="font-medium">{student.gpa}</span>
                            </p>
                          </div>
                          
                          <div className="card p-6">
                            <h4 className="font-medium text-surface-800 dark:text-surface-200 mb-2">Attendance</h4>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-5 h-5 text-secondary" />
                              <span className="text-lg font-semibold">{student.attendance}%</span>
                            </div>
                            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mt-2">
                              <div 
                                className="bg-secondary h-2.5 rounded-full" 
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="card p-6 md:col-span-2">
                            <h4 className="font-medium text-surface-800 dark:text-surface-200 mb-2">Degree Progress</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <ClipboardListIcon className="w-5 h-5 text-accent" />
                              <span className="text-lg font-semibold">
                                {student.credits} / 120 Credits Completed
                              </span>
                            </div>
                            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                              <div 
                                className="bg-accent h-2.5 rounded-full" 
                                style={{ width: `${(student.credits / 120) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-surface-600 dark:text-surface-400 mt-2">
                              {Math.round((student.credits / 120) * 100)}% complete toward degree
                            </p>
                          </div>
                        </div>
                      )}
                      {/* Enrollment Tab */}
                      {activeTab === 'enrollment' && (
                        <div className="space-y-6">
                          <div className="flex flex-col space-y-4">
                            <h3 className="text-lg font-semibold">Current Enrollments</h3>
                            
                            {student.enrollments.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {student.enrollments.map(enrollment => (
                                  <div key={enrollment.id} className="course-card course-card-enrolled">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium text-surface-900 dark:text-white">
                                          {enrollment.courseCode}: {enrollment.courseName}
                                        </h4>
                                        <p className="text-sm text-surface-600 dark:text-surface-400">
                                          {enrollment.instructor} • {enrollment.credits} credits
                                        </p>
                                        <div className="mt-2 flex items-center">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Enrolled
                                          </span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to drop ${enrollment.courseCode}?`)) {
                                            dropCourse(student, enrollment.id);
                                          }
                                        }}
                                        className="enrollment-action-btn bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                      >
                                        <MinusIcon className="w-3 h-3" />
                                        Drop
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 text-center">
                                <p className="text-surface-600 dark:text-surface-400">
                                  Not enrolled in any courses for the current term.
                                </p>
                              </div>
                            )}
                            
                            <h3 className="text-lg font-semibold mt-6">Schedule</h3>
                            {Object.keys(student.schedule).length > 0 ? (
                              <div className="schedule-grid">
                                <div className="time-slot"></div>
                                <div className="day-header">Monday</div>
                                <div className="day-header">Tuesday</div>
                                <div className="day-header">Wednesday</div>
                                <div className="day-header">Thursday</div>
                                <div className="day-header">Friday</div>
                                
                                {/* Time slots: 8AM to 5PM */}
                                {Array.from({length: 10}, (_, i) => {
                                  const hour = i + 8;
                                  return (
                                    <React.Fragment key={hour}>
                                      <div className="time-slot">{hour}:00</div>
                                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => {
                                        const courses = student.schedule[day] || [];
                                        const courseInThisSlot = courses.find(c => {
                                          const startHour = parseInt(c.timeStart.split(':')[0]);
                                          const endHour = parseInt(c.timeEnd.split(':')[0]);
                                          return startHour <= hour && endHour > hour;
                                        });
                                        
                                        if (courseInThisSlot) {
                                          return (
                                            <div
                                              key={day}
                                              className="course-slot"
                                              style={{ backgroundColor: courseInThisSlot.color }}
                                              title={`${courseInThisSlot.courseCode}: ${courseInThisSlot.courseName}\n${courseInThisSlot.timeStart} - ${courseInThisSlot.timeEnd}\n${courseInThisSlot.location}`}
                                            >
                                              {courseInThisSlot.courseCode}
                                            </div>
                                          );
                                        }
                                        return <div key={day} className="bg-white dark:bg-surface-700 rounded-lg"></div>;
                                      })}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 text-center">
                                <p className="text-surface-600 dark:text-surface-400">
                                  No courses scheduled for the current term.
                                </p>
                              </div>
                            )}
                            
                            <h3 className="text-lg font-semibold mt-6">Available Courses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {availableCourses
                                .filter(course => 
                                  course.program === student.program && 
                                  course.yearLevel.includes(student.yearLevel)
                                )
                                .map(course => {
                                  // Check if already enrolled
                                  const isEnrolled = student.enrollments.some(
                                    e => e.courseId === course.id
                                  );
                                  
                                  // Check prerequisites
                                  const prereqCheck = checkPrerequisites(course, student);
                                  const hasMissingPrereqs = prereqCheck !== true;
                                  
                                  // Check capacity
                                  const isAtCapacity = course.enrolled >= course.capacity;
                                  
                                  // Check for schedule conflicts
                                  const hasConflict = student.schedule && 
                                    Object.keys(student.schedule).length > 0 && 
                                    checkScheduleConflict(course, student.schedule);
                                  
                                  // Determine card class based on status
                                  let cardClass = "course-card ";
                                  if (isEnrolled) {
                                    cardClass += "course-card-enrolled";
                                  } else if (hasConflict) {
                                    cardClass += "course-card-conflict";
                                  } else if (hasMissingPrereqs) {
                                    cardClass += "course-card-prerequisites";
                                  } else if (!isAtCapacity) {
                                    cardClass += "course-card-available";
                                  }
                                  
                                  return (
                                    <div key={course.id} className={cardClass}>
                                      <div className="flex justify-between">
                                        <div>
                                          <h4 className="font-medium text-surface-900 dark:text-white">
                                            {course.code}: {course.name}
                                          </h4>
                                          <p className="text-sm text-surface-600 dark:text-surface-400">
                                            {course.instructor} • {course.credits} credits
                                          </p>
                                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                                            {course.schedule.days.join(', ')} • {course.schedule.timeStart} - {course.schedule.timeEnd} • {course.schedule.location}
                                          </p>
                                          <div className="mt-2 flex items-center gap-2 text-xs">
                                            <span className={`${course.enrolled >= course.capacity ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                              {course.enrolled}/{course.capacity} enrolled
                                            </span>
                                            {hasConflict && <span className="flex items-center text-red-600 dark:text-red-400"><AlertCircleIcon className="w-3 h-3 mr-1" /> Schedule Conflict</span>}
                                            {hasMissingPrereqs && <span className="flex items-center text-amber-600 dark:text-amber-400"><AlertTriangleIcon className="w-3 h-3 mr-1" /> Prerequisites</span>}
                                          </div>
                                        </div>
                                        {!isEnrolled && (
                                          <button
                                            onClick={() => enrollInCourse(student, course)}
                                            disabled={isEnrolled || isAtCapacity || hasConflict || hasMissingPrereqs}
                                            className={`enrollment-action-btn ${!isAtCapacity && !hasConflict && !hasMissingPrereqs ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400 cursor-not-allowed'}`}
                                          >
                                            <PlusIcon className="w-3 h-3" />
                                            Enroll
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            
                            <h3 className="text-lg font-semibold mt-6">Enrollment History</h3>
                            {student.enrollmentHistory.length > 0 ? (
                              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-surface-200 dark:bg-surface-700">
                                      <th className="py-2 px-4 text-left text-sm">Date</th>
                                      <th className="py-2 px-4 text-left text-sm">Course</th>
                                      <th className="py-2 px-4 text-left text-sm">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.enrollmentHistory
                                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                                      .map((record, index) => (
                                        <tr key={index} className="border-t border-surface-200 dark:border-surface-700">
                                          <td className="py-2 px-4 text-sm">
                                            {new Date(record.date).toLocaleDateString()}
                                          </td>
                                          <td className="py-2 px-4 text-sm">
                                            {record.courseCode}: {record.courseName}
                                          </td>
                                          <td className="py-2 px-4 text-sm">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                              record.action === 'enrolled' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                              {record.action === 'enrolled' ? 'Enrolled' : 'Dropped'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 text-center">
                                <p className="text-surface-600 dark:text-surface-400">
                                  No enrollment history available.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="card p-6 text-center">
            <div className="text-surface-500 dark:text-surface-400 text-lg font-medium">
              No students found matching your search criteria.
            </div>
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {showTranscript && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-bold">Official Transcript</h3>
              <button 
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => setShowTranscript(false)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
                <GraduationCapIcon className="w-12 h-12 text-primary mb-2" />
                <h2 className="text-2xl font-bold text-center">EduPulse University</h2>
                <p className="text-surface-600 dark:text-surface-400">Official Academic Transcript</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-surface-500 dark:text-surface-400 mb-1">Student Information</h4>
                  <p className="font-bold text-lg">{selectedStudent.name}</p>
                  <p>ID: {selectedStudent.studentId}</p>
                  <p>Program: {selectedStudent.program}</p>
                </div>
                <div>
                  <h4 className="font-medium text-surface-500 dark:text-surface-400 mb-1">Academic Standing</h4>
                  <p>Cumulative GPA: <span className="font-bold">{selectedStudent.gpa}</span></p>
                  <p>Credits Completed: <span className="font-bold">{selectedStudent.credits}</span></p>
                  <p>Status: <span className="font-bold">{selectedStudent.status}</span></p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-medium text-lg border-b border-surface-200 dark:border-surface-700 pb-2">Course History</h4>
                
                {selectedStudent.academicHistory.map((term, index) => (
                  <div key={index} className="transcript-term">
                    <h5 className="font-medium text-primary dark:text-primary-light mb-2">{term.semester}</h5>
                    <table className="w-full">
                      <thead className="bg-surface-100 dark:bg-surface-800">
                        <tr className="text-left">
                          <th className="py-2 px-3 rounded-tl-lg">Course Code</th>
                          <th className="py-2 px-3">Course Name</th>
                          <th className="py-2 px-3">Credits</th>
                          <th className="py-2 px-3 rounded-tr-lg">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                        {term.courses.map((course, courseIndex) => (
                          <tr key={courseIndex}>
                            <td className="py-3 px-3 font-medium">{course.code}</td>
                            <td className="py-3 px-3">{course.name}</td>
                            <td className="py-3 px-3">{course.credits}</td>
                            <td className="py-3 px-3 font-medium">{course.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700 text-center">
                <p className="text-surface-600 dark:text-surface-400 text-sm">
                  This is an official transcript of EduPulse University. If altered, it is considered void.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-surface-200 dark:border-surface-700">
              <button 
                className="btn btn-outline"
                onClick={() => setShowTranscript(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => downloadTranscript(selectedStudent)}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Student Modal */}
      {showNewStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-bold">Add New Student</h3>
              <button 
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => {
                  setShowNewStudentModal(false);
                  resetNewStudentForm();
                }}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleNewStudentSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.name}
                    onChange={(e) => updateNewStudentForm('name', e.target.value)}
                    className="form-input"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newStudentForm.email}
                    onChange={(e) => updateNewStudentForm('email', e.target.value)}
                    className="form-input"
                    placeholder="student@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Program *
                  </label>
                  <select
                    value={newStudentForm.program}
                    onChange={(e) => updateNewStudentForm('program', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Year Level *
                  </label>
                  <select
                    value={newStudentForm.yearLevel}
                    onChange={(e) => updateNewStudentForm('yearLevel', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Status
                  </label>
                  <select
                    value={newStudentForm.status}
                    onChange={(e) => updateNewStudentForm('status', e.target.value)}
                    className="form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newStudentForm.photo}
                    onChange={(e) => updateNewStudentForm('photo', e.target.value)}
                    className="form-input"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    Leave empty for random avatar
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-outline shadow-md hover:shadow-lg" onClick={() => {
                  setShowNewStudentModal(false);
                  resetNewStudentForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary shadow-md hover:shadow-lg">
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;