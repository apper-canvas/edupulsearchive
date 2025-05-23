/**
 * Course Service - Handles all CRUD operations for courses
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for course table
const COURSE_TABLE = 'course1';
const COURSE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'code',
  'instructor',
  'department',
  'credits',
  'status',
  'capacity',
  'enrolled',
  'description',
  'term',
  'program',
  'yearLevel'
];

// Get all courses with optional filtering
export const getCourses = async (filters = {}) => {
  try {
    const client = initClient();
    
    const params = {
      fields: COURSE_FIELDS,
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
    
    const response = await client.fetchRecords(COURSE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Get a single course by ID
export const getCourseById = async (courseId) => {
  try {
    const client = initClient();
    const params = {
      fields: COURSE_FIELDS
    };
    
    const response = await client.getRecordById(COURSE_TABLE, courseId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const client = initClient();
    
    // Filter out any non-updateable fields
    const updateableData = { ...courseData };
    
    const params = {
      records: [updateableData]
    };
    
    const response = await client.createRecord(COURSE_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [{ ...courseData, Id: courseId }]
    };
    
    const response = await client.updateRecord(COURSE_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error(`Error updating course with ID ${courseId}:`, error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const client = initClient();
    const params = { RecordIds: [courseId] };
    const response = await client.deleteRecord(COURSE_TABLE, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting course with ID ${courseId}:`, error);
    throw error;
  }
};