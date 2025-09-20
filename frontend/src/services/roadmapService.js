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
      console.error("Error fetching roadmaps:", error);
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
   * @param {string} milestoneId - The milestone ID
   * @param {boolean} completed - Whether the milestone is completed
   * @returns {Promise} - Promise resolving to updated roadmap
   */
  async updateMilestone(roadmapId, milestoneId, completed) {
    try {
      const response = await api.put(
        `/roadmap/${roadmapId}/milestone/${milestoneId}`,
        {
          completed,
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
   * @param {string} roadmapId - The roadmap ID
   * @returns {Promise} - Promise resolving to analytics data
   */
  async getRoadmapAnalytics(roadmapId) {
    try {
      const response = await api.get(`/roadmap/${roadmapId}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  /**
   * Regenerate an existing roadmap
   * @param {string} roadmapId - The roadmap ID
   * @param {string} reason - Reason for regeneration
   * @returns {Promise} - Promise resolving to new roadmap data
   */
  async regenerateRoadmap(roadmapId, reason = "User requested") {
    try {
      const response = await api.post(`/roadmap/${roadmapId}/regenerate`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error regenerating roadmap:", error);
      throw error;
    }
  }

  /**
   * Get all available career paths (for reference)
   * @returns {Promise} - Promise resolving to career paths data
   */
  async getCareerPaths() {
    try {
      const response = await api.get("/roadmap/paths");
      return response.data;
    } catch (error) {
      console.error("Error fetching career paths:", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new RoadmapService();
