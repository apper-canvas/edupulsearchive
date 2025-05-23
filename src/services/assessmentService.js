/**
 * Assessment Service
 * Handles all assessment-related data operations
 * Uses the dedicated assessment table for proper data structure
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
    
    // Add title/name search filter if provided
    if (filters.searchTerm) {
      whereConditions.push({
        fieldName: "title",
        operator: "Contains",
        values: [filters.searchTerm]
      });
      // Also search in Name field
      whereConditions.push({
        fieldName: "Name",
        operator: "Contains",
        values: [filters.searchTerm]
      });
    }

    // Add type filter if provided
    if (filters.type && filters.type !== 'All Types') {
      whereConditions.push({
        fieldName: "type",
        operator: "ExactMatch",
        values: [filters.type]
      });
    }

    // Add status filter if provided
    if (filters.status && filters.status !== 'All Statuses') {
      whereConditions.push({
        fieldName: "Tags",
        operator: "Contains",
        values: [filters.status]
      });
    }
    
    // Add course filter if provided
    if (filters.course && filters.course !== 'All Courses') {
      whereConditions.push({
        fieldName: "course",
        operator: "ExactMatch",
        values: [filters.course]
      });
    }

    const params = {
      fields: [
        "Id", "Name", "Tags", "title", "course", "type", "dueDate", "pointsPossible", "description"
      ],
      where: whereConditions,
      pagingInfo: pagination,
      orderBy: [{ fieldName: "dueDate", SortType: "ASC" }]
    };

    const response = await apperClient.fetchRecords("assessment", params);
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
      fields: ["Id", "Name", "Tags", "title", "course", "type", "dueDate", "pointsPossible", "description"]
    };

    const response = await apperClient.getRecordById("assessment", id, params);
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
      Tags: assessment.status,
      title: assessment.title,
      type: assessment.type,
      pointsPossible: assessment.totalPoints,
      description: assessment.description,
      dueDate: formatDateForApi(assessment.dueDate)
    };
    const params = { records: [assessmentData] };

    const response = await apperClient.createRecord("assessment", params);
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
      Tags: assessment.status,
      title: assessment.title,
      type: assessment.type,
      pointsPossible: assessment.totalPoints,
      description: assessment.description,
      dueDate: formatDateForApi(assessment.dueDate)
    };
    const params = { records: [assessmentData] };

    const response = await apperClient.updateRecord("assessment", params);
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

    const response = await apperClient.deleteRecord("assessment", params);
    return response;
  } catch (error) {
    console.error(`Error deleting assessment with ID ${id}:`, error);
    throw error;
  }
};