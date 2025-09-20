import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Target,
  Star,
  Users,
  ExternalLink,
  Play,
  Award,
  TrendingUp,
} from "lucide-react";

const RoadmapMindmap = ({ roadmapData, onMilestoneUpdate }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const treeContainerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Set initial translation to center the tree
  useEffect(() => {
    if (treeContainerRef.current) {
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4,
      });
    }
  }, []);

  // Transform roadmap data into tree structure
  const transformToTreeData = (roadmap) => {
    if (!roadmap) return null;

    return {
      name: roadmap.title,
      type: "root",
      data: {
        description: roadmap.description,
        matchScore: roadmap.matchScore,
        primaryCareer: roadmap.primaryCareerPath,
      },
      children: [
        // Primary Career Path Node
        {
          name: roadmap.primaryCareerPath?.title || "Primary Path",
          type: "career",
          data: roadmap.primaryCareerPath,
          children:
            roadmap.phases?.map((phase) => ({
              name: phase.title,
              type: "phase",
              data: phase,
              children: phase.milestones?.map((milestone) => ({
                name: milestone.title,
                type: "milestone",
                data: milestone,
                children:
                  milestone.resources?.length > 0
                    ? milestone.resources.map((resource) => ({
                        name: resource.title,
                        type: "resource",
                        data: resource,
                      }))
                    : undefined,
              })),
            })) || [],
        },
        // Alternative Paths Node (if exists)
        ...(roadmap.alternativeCareerPaths?.length > 0
          ? [
              {
                name: "Alternative Paths",
                type: "alternatives",
                data: { alternatives: roadmap.alternativeCareerPaths },
                children: roadmap.alternativeCareerPaths.map((alt) => ({
                  name: alt.title,
                  type: "alternative",
                  data: alt,
                })),
              },
            ]
          : []),
        // Recommendations Node
        ...(roadmap.personalizedRecommendations?.length > 0
          ? [
              {
                name: "Recommendations",
                type: "recommendations",
                data: { recommendations: roadmap.personalizedRecommendations },
                children: roadmap.personalizedRecommendations.map((rec) => ({
                  name: rec.type,
                  type: "recommendation",
                  data: rec,
                })),
              },
            ]
          : []),
      ],
    };
  };

  // Custom node component
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const isExpanded = expandedNodes.has(nodeDatum.name);
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

    const getNodeStyles = (type) => {
      switch (type) {
        case "root":
          return {
            fill: "#3B82F6",
            stroke: "#1E40AF",
            textColor: "white",
          };
        case "career":
          return {
            fill: "#10B981",
            stroke: "#059669",
            textColor: "white",
          };
        case "phase":
          return {
            fill: "#F59E0B",
            stroke: "#D97706",
            textColor: "white",
          };
        case "milestone":
          return {
            fill: nodeDatum.data?.progress?.completed ? "#22C55E" : "#6B7280",
            stroke: nodeDatum.data?.progress?.completed ? "#16A34A" : "#4B5563",
            textColor: "white",
          };
        case "resource":
          return {
            fill: "#8B5CF6",
            stroke: "#7C3AED",
            textColor: "white",
          };
        case "alternatives":
          return {
            fill: "#EF4444",
            stroke: "#DC2626",
            textColor: "white",
          };
        case "alternative":
          return {
            fill: "#F97316",
            stroke: "#EA580C",
            textColor: "white",
          };
        case "recommendations":
          return {
            fill: "#EC4899",
            stroke: "#DB2777",
            textColor: "white",
          };
        case "recommendation":
          return {
            fill: "#A855F7",
            stroke: "#9333EA",
            textColor: "white",
          };
        default:
          return {
            fill: "#6B7280",
            stroke: "#4B5563",
            textColor: "white",
          };
      }
    };

    const styles = getNodeStyles(nodeDatum.type);
    const getNodeSize = (type) => {
      switch (type) {
        case "root": return 50;
        case "career": return 45;
        case "phase": return 40;
        case "milestone": return 35;
        case "resource": return 30;
        case "alternatives": return 40;
        case "alternative": return 35;
        case "recommendations": return 40;
        case "recommendation": return 30;
        default: return 35;
      }
    };
    const nodeSize = getNodeSize(nodeDatum.type);

    return (
      <g>
        {/* Node circle */}
        <circle
          r={nodeSize}
          fill={styles.fill}
          stroke={styles.stroke}
          strokeWidth="3"
          onClick={() => {
            setSelectedNode(nodeDatum);
            if (hasChildren) {
              toggleNode();
              setExpandedNodes((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(nodeDatum.name)) {
                  newSet.delete(nodeDatum.name);
                } else {
                  newSet.add(nodeDatum.name);
                }
                return newSet;
              });
            }
          }}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
          className="transition-all duration-200 hover:opacity-80"
        />

        {/* Node icon */}
        <foreignObject x={-12} y={-12} width={24} height={24}>
          <div className="flex items-center justify-center w-full h-full">
            {nodeDatum.type === "root" && (
              <Target className="w-6 h-6 text-white" />
            )}
            {nodeDatum.type === "career" && (
              <TrendingUp className="w-5 h-5 text-white" />
            )}
            {nodeDatum.type === "phase" && (
              <BookOpen className="w-5 h-5 text-white" />
            )}
            {nodeDatum.type === "milestone" &&
              (nodeDatum.data?.progress?.completed ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Circle className="w-5 h-5 text-white" />
              ))}
            {nodeDatum.type === "resource" && (
              <ExternalLink className="w-4 h-4 text-white" />
            )}
            {nodeDatum.type === "alternatives" && (
              <Star className="w-5 h-5 text-white" />
            )}
            {nodeDatum.type === "alternative" && (
              <Award className="w-4 h-4 text-white" />
            )}
            {nodeDatum.type === "recommendations" && (
              <Users className="w-5 h-5 text-white" />
            )}
            {nodeDatum.type === "recommendation" && (
              <Play className="w-4 h-4 text-white" />
            )}
          </div>
        </foreignObject>

        {/* Expand/collapse indicator */}
        {hasChildren && (
          <foreignObject x={25} y={-8} width={16} height={16}>
            <div className="bg-white rounded-full shadow-md flex items-center justify-center w-4 h-4">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-600" />
              )}
            </div>
          </foreignObject>
        )}

        {/* Node label */}
        <foreignObject x={-70} y={nodeSize + 15} width={140} height={40}>
          <div className="text-center">
            <div
              className="text-sm font-semibold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200 truncate"
              title={nodeDatum.name}
            >
              {nodeDatum.name.length > 18
                ? `${nodeDatum.name.substring(0, 18)}...`
                : nodeDatum.name}
            </div>
            {/* Additional info for certain node types */}
            {nodeDatum.type === "milestone" && nodeDatum.data?.estimatedDuration && (
              <div className="text-xs text-gray-500 mt-1">
                {nodeDatum.data.estimatedDuration}
              </div>
            )}
            {nodeDatum.type === "phase" && nodeDatum.data?.estimatedDuration && (
              <div className="text-xs text-gray-500 mt-1">
                {nodeDatum.data.estimatedDuration}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  const treeData = transformToTreeData(roadmapData);

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>No roadmap data available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{roadmapData.title}</h2>
        <p className="text-sm text-gray-600">Click on nodes to explore your career path</p>
      </div>

      {/* Tree visualization */}
      <div
        ref={treeContainerRef}
        className="w-full h-full"
        style={{ minHeight: "700px" }}
      >
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc="diagonal"
          separation={{ siblings: 2.5, nonSiblings: 3 }}
          nodeSize={{ x: 280, y: 180 }}
          renderCustomNodeElement={renderCustomNode}
          collapsible={false}
          initialDepth={3}
          zoom={0.7}
          scaleExtent={{ min: 0.2, max: 1.2 }}
          enableLegacyTransitions={true}
          styles={{
            links: {
              stroke: "#94A3B8",
              strokeWidth: 2,
            },
          }}
        />
      </div>

      {/* Node details panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedNode.name}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Root node details */}
              {selectedNode.type === "root" && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Match Score: {selectedNode.data.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Career path details */}
              {(selectedNode.type === "career" ||
                selectedNode.type === "alternative") && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">
                        Industry
                      </div>
                      <div className="text-blue-800">
                        {selectedNode.data.industry}
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">
                        Level
                      </div>
                      <div className="text-green-800 capitalize">
                        {selectedNode.data.level}
                      </div>
                    </div>
                  </div>
                  {selectedNode.data.averageSalary && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">
                        Salary Range
                      </div>
                      <div className="text-purple-800">
                        ${selectedNode.data.averageSalary.min?.toLocaleString()}{" "}
                        - $
                        {selectedNode.data.averageSalary.max?.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phase details */}
              {selectedNode.type === "phase" && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedNode.data.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>Phase {selectedNode.data.order}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Milestone details */}
              {selectedNode.type === "milestone" && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedNode.data.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : selectedNode.data.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedNode.data.priority} priority
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        onMilestoneUpdate?.(
                          selectedNode.data.id,
                          !selectedNode.data.progress?.completed
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedNode.data.progress?.completed
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {selectedNode.data.progress?.completed
                        ? "Completed"
                        : "Mark Complete"}
                    </button>
                  </div>

                  {selectedNode.data.estimatedDuration && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        Duration: {selectedNode.data.estimatedDuration}
                      </span>
                    </div>
                  )}

                  {selectedNode.data.skills &&
                    selectedNode.data.skills.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Skills:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.data.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Resource details */}
              {selectedNode.type === "resource" && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedNode.data.type === "course"
                          ? "bg-blue-100 text-blue-800"
                          : selectedNode.data.type === "book"
                          ? "bg-green-100 text-green-800"
                          : selectedNode.data.type === "certification"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedNode.data.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedNode.data.cost}
                    </span>
                  </div>

                  {selectedNode.data.rating && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {selectedNode.data.rating}/5
                      </span>
                    </div>
                  )}

                  {selectedNode.data.url && (
                    <a
                      href={selectedNode.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit Resource</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              const treeContainer = treeContainerRef.current;
              if (treeContainer) {
                const svg = treeContainer.querySelector('svg');
                if (svg) {
                  const currentTransform = svg.style.transform;
                  const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
                  const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 0.7;
                  const newScale = Math.min(currentScale * 1.2, 1.2);
                  svg.style.transform = currentTransform.replace(/scale\([^)]+\)/, `scale(${newScale})`);
                }
              }
            }}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              const treeContainer = treeContainerRef.current;
              if (treeContainer) {
                const svg = treeContainer.querySelector('svg');
                if (svg) {
                  const currentTransform = svg.style.transform;
                  const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
                  const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 0.7;
                  const newScale = Math.max(currentScale * 0.8, 0.2);
                  svg.style.transform = currentTransform.replace(/scale\([^)]+\)/, `scale(${newScale})`);
                }
              }
            }}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Root/Main Goal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Career Path</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Phase</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span>Milestone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span>Resource</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapMindmap;
