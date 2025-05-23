/**
 * Academic History Service - Handles all CRUD operations for academic history records
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for academic history table
const ACADEMIC_HISTORY_TABLE = 'academic_history';
const ACADEMIC_HISTORY_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'semester',
  'student'
];

// Get academic history by student ID
export const getAcademicHistoryByStudent = async (studentId) => {
  try {
    const client = initClient();
    
    const params = {
      fields: ACADEMIC_HISTORY_FIELDS,
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
    
    const response = await client.fetchRecords(ACADEMIC_HISTORY_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching academic history for student ${studentId}:`, error);
    throw error;
  }
};

// Get a single academic history record by ID
export const getAcademicHistoryById = async (historyId) => {
  try {
    const client = initClient();
    const params = {
      fields: ACADEMIC_HISTORY_FIELDS
    };
    
    const response = await client.getRecordById(ACADEMIC_HISTORY_TABLE, historyId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching academic history with ID ${historyId}:`, error);
    throw error;
  }
};

// Create a new academic history record
export const createAcademicHistory = async (historyData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [historyData]
    };
    
    const response = await client.createRecord(ACADEMIC_HISTORY_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error creating academic history record:', error);
    throw error;
  }
};

// Update an existing academic history record
export const updateAcademicHistory = async (historyId, historyData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [{ ...historyData, Id: historyId }]
    };
    
    const response = await client.updateRecord(ACADEMIC_HISTORY_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error(`Error updating academic history with ID ${historyId}:`, error);
    throw error;
  }
};

// Delete an academic history record
export const deleteAcademicHistory = async (historyId) => {
  try {
    const client = initClient();
    const params = { RecordIds: [historyId] };
    const response = await client.deleteRecord(ACADEMIC_HISTORY_TABLE, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting academic history with ID ${historyId}:`, error);
    throw error;
  }
};