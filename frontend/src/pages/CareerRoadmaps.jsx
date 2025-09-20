import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Brain,
  Sparkles,
  RefreshCw,
  Download,
  Share,
  Settings,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import RoadmapMindmap from "../components/RoadmapMindmap";
import RoadmapLoader from "../components/RoadmapLoader";
import roadmapService from "../services/roadmapService";

const CareerRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showRoadmapList, setShowRoadmapList] = useState(true);

  // Load existing roadmaps on component mount
  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await roadmapService.getRoadmaps();
      
      // Handle the response - backend returns a single roadmap, not an array
      if (response.roadmap) {
        const roadmapArray = [response.roadmap];
        setRoadmaps(roadmapArray);
        setCurrentRoadmap(response.roadmap);
        setShowRoadmapList(false);
      } else {
        // No roadmap found
        setRoadmaps([]);
        setCurrentRoadmap(null);
        setShowRoadmapList(true);
      }
    } catch (err) {
      console.error("Error loading roadmaps:", err);
      // If error is 404 (no roadmap found), show the generate button
      if (err.response?.status === 404) {
        setRoadmaps([]);
        setCurrentRoadmap(null);
        setShowRoadmapList(true);
      } else {
        setError("Failed to load roadmaps. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewRoadmap = async () => {
    try {
      setGenerating(true);
      setError(null);
      const response = await roadmapService.generateRoadmap();

      // Check if the response contains a roadmap (successful generation)
      if (response.roadmap) {
        setCurrentRoadmap(response.roadmap);
        setShowRoadmapList(false);
        // Refresh the roadmaps list
        await loadRoadmaps();
      } else {
        throw new Error(response.message || "Failed to generate roadmap");
      }
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate roadmap. Please ensure you have completed your onboarding."
      );
    } finally {
      setGenerating(false);
    }
  };

  const regenerateRoadmap = async () => {
    if (!currentRoadmap) return;

    try {
      setGenerating(true);
      setError(null);
      const response = await roadmapService.regenerateRoadmap(
        currentRoadmap._id,
        "User requested regeneration"
      );

      if (response.roadmap) {
        setCurrentRoadmap(response.roadmap);
        await loadRoadmaps();
      } else {
        throw new Error(response.message || "Failed to regenerate roadmap");
      }
    } catch (err) {
      console.error("Error regenerating roadmap:", err);
      setError(err.response?.data?.message || "Failed to regenerate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  const handleMilestoneUpdate = async (milestoneId, completed) => {
    if (!currentRoadmap) return;

    try {
      const response = await roadmapService.updateMilestone(
        currentRoadmap._id,
        milestoneId,
        completed
      );
      if (response.roadmap) {
        setCurrentRoadmap(response.roadmap);
      }
    } catch (err) {
      console.error("Error updating milestone:", err);
      setError("Failed to update milestone");
    }
  };

  const selectRoadmap = (roadmap) => {
    setCurrentRoadmap(roadmap);
    setShowRoadmapList(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RoadmapLoader message="Our AI is analyzing your profile and generating a personalized career roadmap tailored to your goals and preferences..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Career Roadmaps
                </h1>
                <p className="text-gray-600">
                  Personalized learning paths powered by artificial intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {currentRoadmap && (
                <>
                  <button
                    onClick={() => setShowRoadmapList(true)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Map className="w-4 h-4" />
                    <span>All Roadmaps</span>
                  </button>
                  <button
                    onClick={regenerateRoadmap}
                    disabled={generating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
                    />
                    <span>Regenerate</span>
                  </button>
                </>
              )}
              <button
                onClick={generateNewRoadmap}
                disabled={generating}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-800">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap List View */}
        {showRoadmapList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* No roadmaps state */}
            {!loading && roadmaps.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Roadmaps Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Generate your first AI-powered career roadmap to get
                  personalized guidance for your career journey.
                </p>
                <button
                  onClick={generateNewRoadmap}
                  disabled={generating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center space-x-2 mx-auto disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Generate My First Roadmap</span>
                </button>
              </div>
            )}

            {/* Roadmap cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {roadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => selectRoadmap(roadmap)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {roadmap.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <Target className="w-3 h-3" />
                        <span>{roadmap.matchScore}%</span>
                      </div>
                    </div>

                    {/* Primary career path */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-900">
                          {roadmap.primaryCareerPath?.title}
                        </span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        {roadmap.primaryCareerPath?.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {roadmap.phases?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Phases</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {roadmap.phases?.reduce(
                            (total, phase) =>
                              total + (phase.milestones?.length || 0),
                            0
                          ) || 0}
                        </div>
                        <div className="text-xs text-gray-500">Milestones</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {Math.round(roadmap.analytics?.averageProgress || 0)}%
                        </div>
                        <div className="text-xs text-gray-500">Progress</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Created {formatDate(roadmap.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {roadmap.analytics?.completedMilestones > 0 && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm">
                              {roadmap.analytics.completedMilestones} completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mindmap View */}
        {!showRoadmapList && currentRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="h-full">
              <RoadmapMindmap
                roadmapData={currentRoadmap}
                onMilestoneUpdate={handleMilestoneUpdate}
              />
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading roadmaps...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmaps;
