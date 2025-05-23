/**
 * Student Service - Handles all CRUD operations for students
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for student table
const STUDENT_TABLE = 'student1';
const STUDENT_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'studentId',
  'email',
  'program',
  'yearLevel',
  'gpa',
  'credits',
  'status',
  'photo',
  'attendance'
];

// Get all students with optional filtering
export const getStudents = async (filters = {}) => {
  try {
    const client = initClient();
    
    const params = {
      fields: STUDENT_FIELDS,
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([fieldName, value]) => ({
        fieldName,
        operator: 'ExactMatch',
        values: [value]
      }));
    }
    
    const response = await client.fetchRecords(STUDENT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Get a single student by ID
export const getStudentById = async (studentId) => {
  try {
    const client = initClient();
    const params = {
      fields: STUDENT_FIELDS
    };
    
    const response = await client.getRecordById(STUDENT_TABLE, studentId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student with ID ${studentId}:`, error);
    throw error;
  }
};

// Create a new student
export const createStudent = async (studentData) => {
  try {
    const client = initClient();
    
    // Filter out any non-updateable fields
    const updateableData = { ...studentData };
    
    const params = {
      records: [updateableData]
    };
    
    const response = await client.createRecord(STUDENT_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Update an existing student
export const updateStudent = async (studentId, studentData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [{ ...studentData, Id: studentId }]
    };
    
    const response = await client.updateRecord(STUDENT_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error(`Error updating student with ID ${studentId}:`, error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (studentId) => {
  try {
    const client = initClient();
    const params = { RecordIds: [studentId] };
    const response = await client.deleteRecord(STUDENT_TABLE, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting student with ID ${studentId}:`, error);
    throw error;
  }
};