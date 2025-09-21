import { GoogleGenerativeAI } from "@google/generative-ai";
import CareerRoadmap from "../models/CareerRoadmap.js";
import roadmapCacheService from "./RoadmapCacheService.js";

class RoadmapGenerationService {
  constructor() {
    // Debug environment variables
    console.log("🔧 RoadmapService Constructor Debug:");
    console.log("🔑 API Key in service:", !!process.env.GOOGLE_AI_API_KEY);
    console.log(
      "🔑 API Key preview:",
      process.env.GOOGLE_AI_API_KEY
        ? process.env.GOOGLE_AI_API_KEY.substring(0, 10) + "..."
        : "NOT FOUND"
    );
    console.log("🤖 Model from env:", process.env.GOOGLE_AI_MODEL);

    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    // Allow overriding the model via environment variable. Default to a supported Generative Language model.
    const modelFromEnv = process.env.GOOGLE_AI_MODEL || "gemini-1.5-pro";
    this.modelName = modelFromEnv;
    this.model = this.genAI.getGenerativeModel({ model: modelFromEnv });

    console.log("✅ RoadmapService initialized with model:", this.modelName);
  }

  /**
   * Generate a comprehensive career roadmap for a user
   */
  async generateRoadmap(user) {
    try {
      const userProfile = {
        currentLevel: user.onboardingData.currentLevel,
        careerStage: user.onboardingData.careerStage,
        interests: user.onboardingData.interests,
        goals: user.onboardingData.goals,
        preferredLearningStyle: user.onboardingData.preferredLearningStyle,
        timeCommitment: user.onboardingData.timeCommitment,
        currentSkills: user.profile?.currentSkills || [],
        experience: user.profile?.experience || "",
      };

      // Check for cached roadmap first
      const cachedRoadmap = await roadmapCacheService.findCachedRoadmap(
        userProfile,
        user._id
      );
      if (cachedRoadmap) {
        console.log("Using cached roadmap");
        // Update access tracking
        cachedRoadmap.accessCount = (cachedRoadmap.accessCount || 0) + 1;
        cachedRoadmap.lastAccessed = new Date();
        await cachedRoadmap.save();
        return cachedRoadmap;
      }

      console.log("Generating new roadmap with AI");
      // Generate new roadmap using AI
      const prompt = this.buildPrompt(user);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const roadmapData = this.parseAIResponse(response.text());

      // Create and save the roadmap
      const roadmap = await this.createRoadmap(user, roadmapData, prompt);

      // Cache the new roadmap
      const cacheKey = roadmapCacheService.generateCacheKey(userProfile);
      roadmapCacheService.setMemoryCache(cacheKey, roadmap);

      return roadmap;
    } catch (error) {
      console.error("Roadmap generation error:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5), // First 5 lines of stack trace
      });
      throw error; // Preserve the original error instead of generic message
    }
  }

  /**
   * Build comprehensive prompt for AI generation
   */
  buildPrompt(user) {
    const { onboardingData } = user;
    const currentYear = new Date().getFullYear();

    return `Generate a comprehensive, personalized career roadmap for a user with the following profile:

**USER PROFILE:**
- Current Level: ${onboardingData.currentLevel}
- Career Stage: ${onboardingData.careerStage}
- Interests: ${onboardingData.interests.join(", ")}
- Goals: ${onboardingData.goals.join(", ")}
- Learning Style: ${onboardingData.preferredLearningStyle}
- Time Commitment: ${onboardingData.timeCommitment} per week

**CURRENT MARKET CONTEXT (${currentYear}):**
- Include latest industry trends and emerging technologies
- Consider remote work opportunities and digital transformation
- Factor in AI/automation impact on careers
- Include sustainable and green career options
- Consider post-pandemic job market changes

**REQUIRED OUTPUT FORMAT (JSON):**
{
  "title": "Personalized Career Roadmap for [User Name]",
  "description": "Brief overview of the recommended career path",
  "primaryCareerPath": {
    "title": "Primary recommended career",
    "description": "Detailed description",
    "industry": "Industry name",
    "level": "entry|mid|senior|executive",
    "averageSalary": {
      "min": 50000,
      "max": 120000,
      "currency": "USD"
    },
    "growthOutlook": "excellent|very good|good|fair|poor",
    "keySkills": [
      {
        "name": "Skill name",
        "importance": "essential|important|nice-to-have"
      }
    ],
    "timeToEntry": "6-12 months"
  },
  "alternativeCareerPaths": [
    // 2-3 alternative paths with same structure as primary
  ],
  "phases": [
    {
      "id": "phase_1",
      "title": "Foundation Phase",
      "description": "Building fundamental skills",
      "estimatedDuration": "3-6 months",
      "order": 1,
      "milestones": [
        {
          "id": "milestone_1_1",
          "title": "Learn Programming Fundamentals",
          "description": "Master basic programming concepts",
          "category": "skill",
          "estimatedDuration": "2 months",
          "priority": "high",
          "prerequisites": [],
          "resources": [
            {
              "type": "course",
              "title": "Resource name",
              "url": "https://example.com",
              "description": "Resource description",
              "cost": "Free",
              "rating": 4.5
            }
          ],
          "skills": [
            {
              "name": "JavaScript",
              "level": "beginner"
            }
          ]
        }
      ]
    }
  ],
  "matchScore": 85,
  "personalizedRecommendations": [
    {
      "type": "Focus on visual learning resources given your preference",
      "category": "learning",
      "priority": "high"
    }
  ],
  "nextSteps": [
    {
      "action": "Enroll in a JavaScript fundamentals course",
      "deadline": "2025-10-01",
      "importance": "critical"
    }
  ]
}

**IMPORTANT VALIDATION RULES:**
- personalizedRecommendations.category MUST be one of: "learning", "networking", "projects", "certifications", "experience", "portfolio", "skills", "tools", "inspiration", "budget", "career", "personal", "resources", "planning"
- milestones.category MUST be one of: "skill", "education", "experience", "certification", "project", "networking", "career", "tool", "portfolio", "learning", "practice", "assessment"
- All priority fields MUST be: "high", "medium", or "low"
- All deadline dates MUST be in YYYY-MM-DD format
- All importance fields MUST be: "critical", "important", or "optional"
- For milestones: Use "project" (singular), "skill" (singular), "certification" (singular), "tool" (singular)
- For recommendations: Use "projects" (plural), "skills" (plural), "certifications" (plural), "tools" (plural)

**CUSTOMIZATION REQUIREMENTS:**
1. **Learning Style Adaptation:**
   - Visual: Include infographics, video courses, visual programming tools
   - Hands-on: Emphasize projects, labs, internships
   - Reading: Focus on books, documentation, written tutorials
   - Interactive: Include coding bootcamps, workshops, mentorship

2. **Time Commitment Optimization:**
   - 1-2 hours: Micro-learning, short courses, daily practice
   - 3-5 hours: Structured courses, part-time programs
   - 6-10 hours: Intensive bootcamps, accelerated programs
   - 10+ hours: Full-time education, immersive experiences

3. **Goal Alignment:**
   - High salary: Focus on high-demand skills, FAANG preparation, negotiation skills
   - Work-life balance: Remote-friendly careers, flexible industries
   - Job security: Evergreen skills, recession-proof industries
   - Creativity: Design, content creation, innovation roles
   - Impact: Non-profit, social good, sustainability careers
   - Flexibility: Freelancing, consulting, entrepreneurship

4. **Interest-Based Specialization:**
   - Technology: Software dev, data science, cybersecurity, AI/ML
   - Creative: UX/UI design, digital marketing, content creation
   - Business: Product management, consulting, finance, analytics
   - Science: Research, biotech, environmental science, data analysis
   - Healthcare: Health informatics, telemedicine, biomedical engineering

5. **Current Level Considerations:**
   - High School: Foundation courses, career exploration, internships
   - College: Major selection, internships, skill building, networking
   - Graduate: Specialization, advanced projects, industry connections
   - Professional: Career transition, skill updates, leadership development

**CRITICAL: Response must be complete, valid JSON only. No comments or incomplete sections.**

Create exactly 2 phases with 2 milestones each:
- Phase 1: Foundation (0-6 months) - Basic skills
- Phase 2: Application (6-12 months) - Practice and portfolio

Requirements:
- Maximum 2 career alternatives 
- Each milestone: max 2 resources
- Resource types must be one of: "course", "book", "website", "certification", "tool", "practice", "youtube", "video", "tutorial", "documentation", "platform", "guide"
- Complete all JSON arrays properly
- No "// Add more" comments
- Must be parseable JSON

Return ONLY the complete JSON object, no markdown or extra text.`;
  }

  /**
   * Parse AI response and validate structure
   */
  parseAIResponse(aiResponse) {
    try {
      // Clean the response (remove any markdown formatting)
      let cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Check if response is truncated and attempt to fix common issues
      if (!cleanedResponse.endsWith("}")) {
        console.warn("Response appears truncated, attempting to fix...");

        // Find the last complete array or object
        const lastCompleteIndex = Math.max(
          cleanedResponse.lastIndexOf("]}"),
          cleanedResponse.lastIndexOf('"}'),
          cleanedResponse.lastIndexOf("}]")
        );

        if (lastCompleteIndex > 0) {
          cleanedResponse =
            cleanedResponse.substring(0, lastCompleteIndex + 2) + "\n}";
        }
      }

      const roadmapData = JSON.parse(cleanedResponse);

      // Validate required fields
      this.validateRoadmapData(roadmapData);

      return roadmapData;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw AI response length:", aiResponse.length);
      console.error(
        "Raw AI response preview:",
        aiResponse.substring(0, 500) + "..."
      );
      throw new Error("Invalid AI response format");
    }
  }

  /**
   * Validate roadmap data structure and fix common category issues
   *
   * MILESTONE CATEGORIES (singular): skill, education, experience, certification, project, networking, career, tool, portfolio, learning, practice, assessment
   * RECOMMENDATION CATEGORIES (plural): learning, networking, projects, certifications, experience, portfolio, skills, tools, inspiration, budget, career, personal, resources, planning
   */
  validateRoadmapData(data) {
    const requiredFields = [
      "title",
      "description",
      "primaryCareerPath",
      "phases",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate phases structure
    if (!Array.isArray(data.phases) || data.phases.length === 0) {
      throw new Error("Phases must be a non-empty array");
    }

    // Validate each phase has milestones
    data.phases.forEach((phase, index) => {
      if (!phase.milestones || !Array.isArray(phase.milestones)) {
        throw new Error(`Phase ${index} missing milestones array`);
      }
    });

    // Validate and fix milestone categories
    const validMilestoneCategories = [
      "skill",
      "education",
      "experience",
      "certification",
      "project",
      "networking",
      "career",
      "tool",
      "portfolio",
      "learning",
      "practice",
      "assessment",
    ];

    // Fix milestone categories
    data.phases.forEach((phase, phaseIndex) => {
      if (phase.milestones && Array.isArray(phase.milestones)) {
        phase.milestones.forEach((milestone, milestoneIndex) => {
          if (milestone.category) {
            // Handle common variations and mappings
            const categoryMappings = {
              projects: "project",
              certifications: "certification",
              skills: "skill",
              tools: "tool",
              educations: "education",
              experiences: "experience",
            };

            if (categoryMappings[milestone.category]) {
              const oldCategory = milestone.category;
              milestone.category = categoryMappings[milestone.category];
              console.warn(
                `Fixed milestone category from "${oldCategory}" to "${milestone.category}" in phase ${phaseIndex}, milestone ${milestoneIndex}`
              );
            } else if (!validMilestoneCategories.includes(milestone.category)) {
              console.warn(
                `Invalid milestone category "${milestone.category}" in phase ${phaseIndex}, milestone ${milestoneIndex}, changing to "skill"`
              );
              milestone.category = "skill"; // Default fallback
            }
          }
        });
      }
    });

    // Validate and fix personalizedRecommendations categories
    const validCategories = [
      "learning",
      "networking",
      "projects",
      "certifications",
      "experience",
      "portfolio",
      "skills",
      "tools",
      "inspiration",
      "budget",
      "career",
      "personal",
      "resources",
      "planning",
    ];

    if (
      data.personalizedRecommendations &&
      Array.isArray(data.personalizedRecommendations)
    ) {
      data.personalizedRecommendations.forEach((rec, index) => {
        if (rec.category) {
          // Handle common variations and mappings
          const categoryMappings = {
            skill: "skills",
            tool: "tools",
            certification: "certifications",
            project: "projects",
          };

          if (categoryMappings[rec.category]) {
            const oldCategory = rec.category;
            rec.category = categoryMappings[rec.category];
            console.warn(
              `Fixed recommendation category from "${oldCategory}" to "${rec.category}" at index ${index}`
            );
          } else if (!validCategories.includes(rec.category)) {
            console.warn(
              `Invalid recommendation category "${rec.category}" at index ${index}, changing to "career"`
            );
            rec.category = "career"; // Default fallback
          }
        }
      });
    }

    // Validate and fix priority values
    const validPriorities = ["high", "medium", "low"];
    if (
      data.personalizedRecommendations &&
      Array.isArray(data.personalizedRecommendations)
    ) {
      data.personalizedRecommendations.forEach((rec, index) => {
        if (rec.priority && !validPriorities.includes(rec.priority)) {
          console.warn(
            `Invalid priority "${rec.priority}" at index ${index}, changing to "medium"`
          );
          rec.priority = "medium"; // Default fallback
        }
      });
    }
  }

  /**
   * Create and save roadmap to database
   */
  async createRoadmap(user, roadmapData, prompt) {
    const userProfile = {
      currentLevel: user.onboardingData.currentLevel,
      careerStage: user.onboardingData.careerStage,
      interests: user.onboardingData.interests,
      goals: user.onboardingData.goals,
      preferredLearningStyle: user.onboardingData.preferredLearningStyle,
      timeCommitment: user.onboardingData.timeCommitment,
      currentSkills: user.profile?.currentSkills || [],
      experience: user.profile?.experience || "",
    };

    const roadmap = new CareerRoadmap({
      userId: user._id,
      title: roadmapData.title,
      description: roadmapData.description,
      userProfile,
      generatedBy: {
        model: "gemini-pro",
        prompt,
        generatedAt: new Date(),
      },
      primaryCareerPath: roadmapData.primaryCareerPath,
      alternativeCareerPaths: roadmapData.alternativeCareerPaths || [],
      phases: roadmapData.phases,
      matchScore: roadmapData.matchScore || 75,
      personalizedRecommendations:
        roadmapData.personalizedRecommendations || [],
      nextSteps: roadmapData.nextSteps || [],
    });

    try {
      await roadmap.save();
      return roadmap;
    } catch (error) {
      // Handle duplicate key error for cacheKey
      if (error.code === 11000 && error.keyPattern?.cacheKey) {
        console.log("🔄 Duplicate cache key detected, regenerating...");
        // Regenerate cache key with additional uniqueness
        roadmap.cacheKey =
          roadmap.generateCacheKey() +
          "_" +
          Math.random().toString(36).substr(2, 9);
        await roadmap.save();
        return roadmap;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Find cached roadmap for similar user profile
   */
  async findCachedRoadmap(user) {
    const userProfile = {
      currentLevel: user.onboardingData.currentLevel,
      careerStage: user.onboardingData.careerStage,
      interests: user.onboardingData.interests,
      goals: user.onboardingData.goals,
      timeCommitment: user.onboardingData.timeCommitment,
    };

    // Look for exact match first
    const exactMatch = await CareerRoadmap.findOne({
      userId: user._id,
      status: "active",
      "userProfile.currentLevel": userProfile.currentLevel,
      "userProfile.careerStage": userProfile.careerStage,
      "userProfile.timeCommitment": userProfile.timeCommitment,
    }).sort({ createdAt: -1 });

    if (exactMatch) {
      // Check if interests and goals are similar enough (80% overlap)
      const interestOverlap = this.calculateOverlap(
        exactMatch.userProfile.interests,
        userProfile.interests
      );
      const goalOverlap = this.calculateOverlap(
        exactMatch.userProfile.goals,
        userProfile.goals
      );

      if (interestOverlap >= 0.8 && goalOverlap >= 0.8) {
        return exactMatch;
      }
    }

    return null;
  }

  /**
   * Calculate overlap percentage between two arrays
   */
  calculateOverlap(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));

    return intersection.size / Math.max(set1.size, set2.size);
  }

  /**
   * Regenerate roadmap with updated user data
   */
  async regenerateRoadmap(userId, reason = "User profile updated") {
    try {
      // Invalidate existing cache
      await roadmapCacheService.invalidateUserCache(userId);

      // Get updated user data
      const User = (await import("../models/User.js")).default;
      const user = await User.findById(userId);

      if (!user || !user.onboardingCompleted) {
        throw new Error("User not found or onboarding not completed");
      }

      // Generate new roadmap
      const roadmap = await this.generateRoadmap(user);
      roadmap.generatedBy.regenerationReason = reason;
      roadmap.version = await this.getNextVersion(userId);
      await roadmap.save();

      return roadmap;
    } catch (error) {
      console.error("Roadmap regeneration error:", error);
      throw error;
    }
  }

  /**
   * Get next version number for user roadmaps
   */
  async getNextVersion(userId) {
    const latestRoadmap = await CareerRoadmap.findOne({ userId })
      .sort({ version: -1 })
      .select("version");

    return (latestRoadmap?.version || 0) + 1;
  }

  /**
   * Update milestone completion
   */
  async updateMilestoneProgress(
    roadmapId,
    phaseId,
    milestoneId,
    completed,
    notes = ""
  ) {
    try {
      const roadmap = await CareerRoadmap.findById(roadmapId);
      if (!roadmap) {
        throw new Error("Roadmap not found");
      }

      const phase = roadmap.phases.find((p) => p.id === phaseId);
      if (!phase) {
        throw new Error("Phase not found");
      }

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) {
        throw new Error("Milestone not found");
      }

      milestone.completed = completed;
      if (completed) {
        milestone.completedAt = new Date();
        if (notes) milestone.notes = notes;
      } else {
        milestone.completedAt = undefined;
        milestone.notes = notes;
      }

      roadmap.updateProgress();
      await roadmap.save();

      return roadmap;
    } catch (error) {
      console.error("Milestone update error:", error);
      throw error;
    }
  }

  /**
   * Get roadmap analytics and insights
   */
  async getRoadmapAnalytics(userId) {
    try {
      const roadmaps = await CareerRoadmap.find({ userId });

      if (roadmaps.length === 0) {
        return {
          totalRoadmaps: 0,
          completedMilestones: 0,
          totalMilestones: 0,
          averageProgress: 0,
          mostActivePhase: null,
          recommendations: [],
        };
      }

      const activeRoadmap =
        roadmaps.find((r) => r.status === "active") ||
        roadmaps[roadmaps.length - 1];

      const totalMilestones = activeRoadmap.phases.reduce(
        (sum, phase) => sum + phase.milestones.length,
        0
      );

      const completedMilestones = activeRoadmap.phases.reduce(
        (sum, phase) =>
          sum + phase.milestones.filter((m) => m.completed).length,
        0
      );

      const phaseProgress = activeRoadmap.phases.map((phase) => ({
        phaseId: phase.id,
        title: phase.title,
        completed: phase.milestones.filter((m) => m.completed).length,
        total: phase.milestones.length,
        percentage:
          phase.milestones.length > 0
            ? Math.round(
                (phase.milestones.filter((m) => m.completed).length /
                  phase.milestones.length) *
                  100
              )
            : 0,
      }));

      const mostActivePhase = phaseProgress.reduce(
        (max, phase) => (phase.completed > max.completed ? phase : max),
        phaseProgress[0]
      );

      return {
        totalRoadmaps: roadmaps.length,
        completedMilestones,
        totalMilestones,
        averageProgress:
          totalMilestones > 0
            ? Math.round((completedMilestones / totalMilestones) * 100)
            : 0,
        mostActivePhase,
        phaseProgress,
        recommendations: this.generateProgressRecommendations(activeRoadmap),
      };
    } catch (error) {
      console.error("Analytics error:", error);
      throw error;
    }
  }

  /**
   * Generate progress-based recommendations
   */
  generateProgressRecommendations(roadmap) {
    const recommendations = [];

    // Find incomplete high-priority milestones
    roadmap.phases.forEach((phase) => {
      const incompleteMilestones = phase.milestones.filter(
        (m) => !m.completed && m.priority === "high"
      );

      if (incompleteMilestones.length > 0) {
        recommendations.push({
          type: `Focus on high-priority milestones in ${phase.title}`,
          category: "learning",
          priority: "high",
          action: `Complete ${incompleteMilestones[0].title}`,
        });
      }
    });

    // Check for stalled progress
    const recentCompletions = roadmap.phases.flatMap((phase) =>
      phase.milestones.filter(
        (m) =>
          m.completed &&
          m.completedAt &&
          Date.now() - m.completedAt.getTime() < 30 * 24 * 60 * 60 * 1000 // Last 30 days
      )
    );

    if (
      recentCompletions.length === 0 &&
      roadmap.overallProgress.completedMilestones > 0
    ) {
      recommendations.push({
        type: "Re-engage with your roadmap - no recent progress detected",
        category: "motivation",
        priority: "medium",
        action: "Review and update your next steps",
      });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }
}

export default RoadmapGenerationService;
