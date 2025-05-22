import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

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
  }
];

function Students() {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [activeTab, setActiveTab] = useState('academic');
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-4 md:mb-0">
          Student Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
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
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className="card">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleStudentExpand(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={student.photo} 
                      alt={student.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-surface-200 dark:border-surface-700"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-surface-900 dark:text-white">
                        {student.name}
                      </h3>
                      <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 space-x-3">
                        <span>{student.studentId}</span>
                        <span>•</span>
                        <span>{student.program}</span>
                        <span>•</span>
                        <span>Year {student.yearLevel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-1">
                      <GraduationCapIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium">GPA: {student.gpa}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                      <BadgeCheckIcon className="w-4 h-4 text-secondary" />
                      <span>{student.credits} Credits</span>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                      {student.status}
                    </div>
                    {expandedStudentId === student.id ? (
                      <ChevronUpIcon className="w-5 h-5 text-surface-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-surface-500" />
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
                    <div className="p-4">
                      {/* Tabs */}
                      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-4">
                        <button
                          className={`px-4 py-2 font-medium ${activeTab === 'academic' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
                          onClick={() => setActiveTab('academic')}
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>Academic History</span>
                          </div>
                        </button>
                        <button
                          className={`px-4 py-2 font-medium ${activeTab === 'performance' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
                          onClick={() => setActiveTab('performance')}
                        >
                          <div className="flex items-center space-x-2">
                            <BarChartIcon className="w-4 h-4" />
                            <span>Performance</span>
                          </div>
                        </button>
                      </div>

                      {/* Academic History Tab */}
                      {activeTab === 'academic' && (
                        <div className="space-y-6">
                          <div className="flex flex-wrap gap-3">
                            <button 
                              className="btn btn-primary"
                              onClick={() => viewTranscript(student)}
                            >
                              <FileTextIcon className="w-4 h-4 mr-2" />
                              View Transcript
                            </button>
                            <button 
                              className="btn btn-outline"
                              onClick={() => downloadTranscript(student)}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download Transcript
                            </button>
                            <button 
                              className="btn btn-outline"
                              onClick={() => notifyStudent(student)}
                            >
                              <MailIcon className="w-4 h-4 mr-2" />
                              Contact Student
                            </button>
                          </div>

                          <div className="space-y-4">
                            {student.academicHistory.map((term, index) => (
                              <div key={index} className="academic-term">
                                <h4 className="font-medium text-lg text-surface-800 dark:text-surface-200 mb-2">{term.semester}</h4>
                                <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="text-left text-sm text-surface-500 dark:text-surface-400">
                                        <th className="pb-2">Course</th>
                                        <th className="pb-2">Name</th>
                                        <th className="pb-2">Credits</th>
                                        <th className="pb-2">Grade</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                                      {term.courses.map((course, courseIndex) => (
                                        <tr key={courseIndex}>
                                          <td className="py-2 font-medium">{course.code}</td>
                                          <td className="py-2">{course.name}</td>
                                          <td className="py-2">{course.credits}</td>
                                          <td className="py-2">
                                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                                              course.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                              course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                              course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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
                          <div className="card p-4">
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
                          
                          <div className="card p-4">
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
                          
                          <div className="card p-4 md:col-span-2">
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="card p-6 text-center">
            <div className="text-surface-500 dark:text-surface-400 text-lg">
              No students found matching your search criteria.
            </div>
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {showTranscript && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}

export default Students;