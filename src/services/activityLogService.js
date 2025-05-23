/**
 * Activity Log Service - Handles all operations for activity logging
 */

// Initialize the ApperClient
const initClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field definitions for activity log table
const ACTIVITY_LOG_TABLE = 'activity_log';
const ACTIVITY_LOG_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'type',
  'action',
  'details',
  'timestamp',
  'icon',
  'user'
];

// Get recent activity logs
export const getRecentActivity = async (limit = 10, type = null) => {
  try {
    const client = initClient();
    
    const params = {
      fields: ACTIVITY_LOG_FIELDS,
      orderBy: [
        {
          fieldName: 'timestamp',
          SortType: 'DESC'
        }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };
    
    // Add type filter if provided
    if (type) {
      params.where = [{
        fieldName: 'type',
        operator: 'ExactMatch',
        values: [type]
      }];
    }
    
    const response = await client.fetchRecords(ACTIVITY_LOG_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};

// Log a new activity
export const logActivity = async (activityData) => {
  try {
    const client = initClient();
    
    // Ensure timestamp is present
    const data = {
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    };
    
    const params = {
      records: [data]
    };
    
    const response = await client.createRecord(ACTIVITY_LOG_TABLE, params);
    return response.results && response.results[0] ? response.results[0].data : null;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error for logging failures to avoid disrupting the user experience
    return null;
  }
};