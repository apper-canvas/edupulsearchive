/**
 * Assessment Service
 * Handles all assessment-related data operations
 * Uses activity_log table since it's the most appropriate for assessments
 */

// Format date to ISO string
const formatDateForApi = (date) => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
};

/**
 * Fetch assessments from the database
 * @param {Object} filters - Optional filters for the query
 * @param {Object} pagination - Optional pagination settings
 * @returns {Promise} Promise resolving to assessment data
 */
export const fetchAssessments = async (filters = {}, pagination = { limit: 20, offset: 0 }) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build where conditions based on filters
    const whereConditions = [];
    
    // Always filter for assessment type entries
    whereConditions.push({
      fieldName: "type",
      operator: "ExactMatch",
      values: ["assessment"]
    });

    // Add title/name search filter if provided
    if (filters.searchTerm) {
      whereConditions.push({
        fieldName: "Name",
        operator: "Contains",
        values: [filters.searchTerm]
      });
    }

    // Add course filter if provided
    if (filters.course && filters.course !== 'All Courses') {
      whereConditions.push({
        fieldName: "details",
        operator: "Contains",
        values: [filters.course]
      });
    }

    // Add status filter if provided
    if (filters.status && filters.status !== 'All Statuses') {
      whereConditions.push({
        fieldName: "action",
        operator: "ExactMatch",
        values: [filters.status]
      });
    }

    const params = {
      fields: [
        "Id", "Name", "type", "action", "details", "timestamp", "icon", "user", "Tags"
      ],
      where: whereConditions,
      pagingInfo: pagination,
      orderBy: [{ fieldName: "timestamp", SortType: "DESC" }]
    };

    const response = await apperClient.fetchRecords("activity_log", params);
    return response;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

/**
 * Get a single assessment by ID
 * @param {string} id - Assessment ID
 * @returns {Promise} Promise resolving to assessment data
 */
export const getAssessmentById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "type", "action", "details", "timestamp", "icon", "user", "Tags"]
    };

    const response = await apperClient.getRecordById("activity_log", id, params);
    return response;
  } catch (error) {
    console.error(`Error fetching assessment with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new assessment
 * @param {Object} assessment - Assessment data
 * @returns {Promise} Promise resolving to created assessment
 */
export const createAssessment = async (assessment) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare assessment data for API (only include Updateable fields)
    const assessmentData = {
      Name: assessment.title,
      type: "assessment",
      action: assessment.status,
      details: JSON.stringify({
        course: assessment.course,
        totalPoints: assessment.totalPoints,
        description: assessment.description,
        questions: assessment.questions,
        duration: assessment.duration,
        assessmentType: assessment.type
      }),
      timestamp: formatDateForApi(assessment.dueDate),
      icon: "clipboard-check"
    };

    const params = {
      records: [assessmentData]
    };

    const response = await apperClient.createRecord("activity_log", params);
    return response;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
};

/**
 * Update an existing assessment
 * @param {Object} assessment - Assessment data with ID
 * @returns {Promise} Promise resolving to updated assessment
 */
export const updateAssessment = async (assessment) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare assessment data for API (only include Updateable fields)
    const assessmentData = {
      Id: assessment.id,
      Name: assessment.title,
      action: assessment.status,
      details: JSON.stringify({
        course: assessment.course,
        totalPoints: assessment.totalPoints,
        description: assessment.description,
        questions: assessment.questions,
        duration: assessment.duration,
        assessmentType: assessment.type
      }),
      timestamp: formatDateForApi(assessment.dueDate),
      icon: "clipboard-check"
    };

    const params = {
      records: [assessmentData]
    };

    const response = await apperClient.updateRecord("activity_log", params);
    return response;
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
};

/**
 * Delete an assessment
 * @param {string} id - Assessment ID
 * @returns {Promise} Promise resolving to deletion result
 */
export const deleteAssessment = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord("activity_log", params);
    return response;
  } catch (error) {
    console.error(`Error deleting assessment with ID ${id}:`, error);
    throw error;
  }
};