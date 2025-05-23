/**
 * Enrollment Service - Handles all CRUD operations for course enrollments
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for enrollment table
const ENROLLMENT_TABLE = 'enrollment';
const ENROLLMENT_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'enrolledDate',
  'status',
  'term',
  'student',
  'course'
];

// Get all enrollments
export const getAllEnrollments = async () => {
  try {
    const client = initClient();
    
    const params = {
      fields: ENROLLMENT_FIELDS,
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await client.fetchRecords(ENROLLMENT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

// Get enrollments by student ID
export const getEnrollmentsByStudent = async (studentId) => {
  try {
    const client = initClient();
    
    const params = {
      fields: ENROLLMENT_FIELDS,
      where: [{
        fieldName: 'student',
        operator: 'ExactMatch',
        values: [studentId]
      }],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await client.fetchRecords(ENROLLMENT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching enrollments for student ${studentId}:`, error);
    throw error;
  }
};

// Get enrollments by course ID
export const getEnrollmentsByCourse = async (courseId) => {
  try {
    const client = initClient();
    
    const params = {
      fields: ENROLLMENT_FIELDS,
      where: [{
        fieldName: 'course',
        operator: 'ExactMatch',
        values: [courseId]
      }],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await client.fetchRecords(ENROLLMENT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    throw error;
  }
};

// Create a new enrollment
export const createEnrollment = async (enrollmentData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [enrollmentData]
    };
    
    const response = await client.createRecord(ENROLLMENT_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error creating enrollment record:', error);
    throw error;
  }
};

// Delete an enrollment
export const deleteEnrollment = async (enrollmentId) => {
  try {
    const client = initClient();
    const params = { RecordIds: [enrollmentId] };
    const response = await client.deleteRecord(ENROLLMENT_TABLE, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting enrollment with ID ${enrollmentId}:`, error);
    throw error;
  }
};