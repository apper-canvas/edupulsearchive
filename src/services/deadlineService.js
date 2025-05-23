/**
 * Deadline Service - Handles all CRUD operations for deadlines
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for deadline table
const DEADLINE_TABLE = 'deadline';
const DEADLINE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'title',
  'course',
  'dueDate',
  'priority',
  'status'
];

// Get all deadlines
export const getDeadlines = async (statusFilter = null) => {
  try {
    const client = initClient();
    
    const params = {
      fields: DEADLINE_FIELDS,
      orderBy: [
        {
          fieldName: 'dueDate',
          SortType: 'ASC'
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    // Add status filter if provided
    if (statusFilter) {
      params.where = [{
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [statusFilter]
      }];
    }
    
    const response = await client.fetchRecords(DEADLINE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    throw error;
  }
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (limit = 5) => {
  try {
    const client = initClient();
    
    const params = {
      fields: DEADLINE_FIELDS,
      where: [{
        fieldName: 'status',
        operator: 'ExactMatch',
        values: ['pending', 'upcoming']
      }],
      orderBy: [
        {
          fieldName: 'dueDate',
          SortType: 'ASC'
        }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };
    
    const response = await client.fetchRecords(DEADLINE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    throw error;
  }
};

// Create a new deadline
export const createDeadline = async (deadlineData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [deadlineData]
    };
    
    const response = await client.createRecord(DEADLINE_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error creating deadline:', error);
    throw error;
  }
};

// Update a deadline
export const updateDeadline = async (deadlineId, deadlineData) => {
  try {
    const client = initClient();
    
    const params = {
      records: [{ ...deadlineData, Id: deadlineId }]
    };
    
    const response = await client.updateRecord(DEADLINE_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error(`Error updating deadline with ID ${deadlineId}:`, error);
    throw error;
  }
};