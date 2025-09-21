import api from "./api.js";

/**
 * Service for interacting with career roadmap APIs
 */
class RoadmapService {
  /**
   * Generate a new career roadmap using AI
   * @returns {Promise} - Promise resolving to roadmap data
   */
  async generateRoadmap() {
    try {
      const response = await api.post("/roadmap/generate");
      return response.data;
    } catch (error) {
      console.error("Error generating roadmap:", error);
      throw error;
    }
  }

  /**
   * Get user's existing roadmaps
   * @returns {Promise} - Promise resolving to array of roadmaps
   */
  async getRoadmaps() {
    try {
      const response = await api.get("/roadmap");
      return response.data;
    } catch (error) {
      // Don't log 404 errors for roadmaps since it's expected when user has no roadmaps
      if (error.response?.status !== 404) {
        console.error("Error fetching roadmaps:", error);
      }
      throw error;
    }
  }

  /**
   * Get all user's roadmaps (including archived)
   * @param {number} limit - Number of roadmaps to fetch
   * @param {number} page - Page number for pagination
   * @returns {Promise} - Promise resolving to paginated roadmaps
   */
  async getAllRoadmaps(limit = 10, page = 1) {
    try {
      const response = await api.get(
        `/roadmap/all?limit=${limit}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all roadmaps:", error);
      throw error;
    }
  }

  /**
   * Get a specific roadmap by ID
   * @param {string} roadmapId - The roadmap ID
   * @returns {Promise} - Promise resolving to roadmap data
   */
  async getRoadmapById(roadmapId) {
    try {
      const response = await api.get(`/roadmap/${roadmapId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      throw error;
    }
  }

  /**
   * Update milestone progress
   * @param {string} roadmapId - The roadmap ID
   * @param {string} phaseId - The phase ID
   * @param {string} milestoneId - The milestone ID
   * @param {boolean} completed - Whether the milestone is completed
   * @param {string} notes - Optional notes
   * @returns {Promise} - Promise resolving to updated roadmap
   */
  async updateMilestone(
    roadmapId,
    phaseId,
    milestoneId,
    completed,
    notes = ""
  ) {
    try {
      const response = await api.put(
        `/roadmap/${roadmapId}/milestone/${phaseId}/${milestoneId}`,
        {
          completed,
          notes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating milestone:", error);
      throw error;
    }
  }

  /**
   * Get roadmap analytics
   * @returns {Promise} - Promise resolving to analytics data
   */
  async getRoadmapAnalytics() {
    try {
      const response = await api.get(`/roadmap/analytics/progress`);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  /**
   * Regenerate an existing roadmap
   * @param {string} reason - Reason for regeneration
   * @returns {Promise} - Promise resolving to new roadmap data
   */
  async regenerateRoadmap(reason = "User requested") {
    try {
      const response = await api.post(`/roadmap/regenerate`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error regenerating roadmap:", error);
      throw error;
    }
  }

  /**
   * Get AI-powered next steps suggestions
   * @returns {Promise} - Promise resolving to suggestions data
   */
  async getNextStepsSuggestions() {
    try {
      const response = await api.get("/roadmap/suggestions/next-steps");
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new RoadmapService();
