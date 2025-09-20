import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "skill",
        "education",
        "experience",
        "certification",
        "project",
        "networking",
        "career",
        "tool",
      ],
    },
    estimatedDuration: {
      type: String,
      required: true, // e.g., "2-3 months", "6 weeks", "1 year"
    },
    priority: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
    },
    prerequisites: [
      {
        type: String, // References to other milestone IDs
      },
    ],
    resources: [
      {
        type: {
          type: String,
          enum: [
            "course",
            "book",
            "website",
            "certification",
            "tool",
            "practice",
            "youtube",
            "video",
            "tutorial",
            "documentation",
            "platform",
            "guide",
          ],
        },
        title: String,
        url: String,
        description: String,
        cost: String, // e.g., "Free", "$49", "$99/month"
        rating: Number, // 1-5 stars
      },
    ],
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
        },
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    notes: String,
  },
  {
    _id: false, // Use custom id field instead
  }
);

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["entry", "mid", "senior", "executive"],
  },
  averageSalary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "USD",
    },
  },
  growthOutlook: {
    type: String,
    enum: ["poor", "fair", "good", "very good", "excellent"],
  },
  keySkills: [
    {
      name: String,
      importance: {
        type: String,
        enum: ["essential", "important", "nice-to-have"],
      },
    },
  ],
  timeToEntry: {
    type: String, // e.g., "6-12 months", "2-3 years"
  },
});

const careerRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Roadmap metadata
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
    },

    // User profile snapshot (for regeneration context)
    userProfile: {
      currentLevel: String,
      careerStage: String,
      interests: [String],
      goals: [String],
      preferredLearningStyle: String,
      timeCommitment: String,
      currentSkills: [String],
      experience: String,
    },

    // AI generation metadata
    generatedBy: {
      model: {
        type: String,
        default: "gemini-pro",
      },
      prompt: String,
      generatedAt: {
        type: Date,
        default: Date.now,
      },
      regenerationReason: String,
    },

    // Career paths and roadmap content
    primaryCareerPath: careerPathSchema,
    alternativeCareerPaths: [careerPathSchema],

    // Detailed roadmap structure
    phases: [
      {
        id: String,
        title: String,
        description: String,
        estimatedDuration: String,
        order: Number,
        milestones: [milestoneSchema],
      },
    ],

    // Progress tracking
    overallProgress: {
      completedMilestones: {
        type: Number,
        default: 0,
      },
      totalMilestones: {
        type: Number,
        default: 0,
      },
      percentageComplete: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Personalization factors
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    personalizedRecommendations: [
      {
        type: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: [
            "learning",
            "networking",
            "projects",
            "certifications",
            "experience",
            "portfolio",
            "skills",
            "tools",
            "inspiration",
          ],
          required: true,
        },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          required: true,
        },
      },
    ],

    // Next steps and immediate actions
    nextSteps: [
      {
        action: String,
        deadline: Date,
        importance: {
          type: String,
          enum: ["critical", "important", "optional", "high", "medium", "low"],
        },
      },
    ],

    // Cache and optimization
    cacheKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
careerRoadmapSchema.index({ userId: 1, status: 1 });
careerRoadmapSchema.index({ userId: 1, createdAt: -1 });
careerRoadmapSchema.index({ cacheKey: 1 });
careerRoadmapSchema.index({ "userProfile.interests": 1 });
careerRoadmapSchema.index({ "primaryCareerPath.industry": 1 });

// Virtual for completion percentage
careerRoadmapSchema.virtual("completionPercentage").get(function () {
  if (this.overallProgress.totalMilestones === 0) return 0;
  return Math.round(
    (this.overallProgress.completedMilestones /
      this.overallProgress.totalMilestones) *
      100
  );
});

// Method to update progress
careerRoadmapSchema.methods.updateProgress = function () {
  let totalMilestones = 0;
  let completedMilestones = 0;

  this.phases.forEach((phase) => {
    totalMilestones += phase.milestones.length;
    completedMilestones += phase.milestones.filter(
      (milestone) => milestone.completed
    ).length;
  });

  this.overallProgress.totalMilestones = totalMilestones;
  this.overallProgress.completedMilestones = completedMilestones;
  this.overallProgress.percentageComplete =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;
  this.overallProgress.lastUpdated = new Date();

  return this;
};

// Method to complete a milestone
careerRoadmapSchema.methods.completeMilestone = function (
  phaseId,
  milestoneId,
  notes = ""
) {
  const phase = this.phases.find((p) => p.id === phaseId);
  if (!phase) throw new Error("Phase not found");

  const milestone = phase.milestones.find((m) => m.id === milestoneId);
  if (!milestone) throw new Error("Milestone not found");

  milestone.completed = true;
  milestone.completedAt = new Date();
  if (notes) milestone.notes = notes;

  this.updateProgress();
  return this;
};

// Method to generate cache key
careerRoadmapSchema.methods.generateCacheKey = function () {
  const profile = this.userProfile;
  const key = `roadmap_${profile.currentLevel}_${
    profile.careerStage
  }_${profile.interests.sort().join("_")}_${profile.goals.sort().join("_")}_${
    profile.timeCommitment
  }`;
  return key.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
};

// Pre-save middleware to generate cache key and update access
careerRoadmapSchema.pre("save", function (next) {
  if (this.isNew) {
    this.cacheKey = this.generateCacheKey();
    this.updateProgress();
  }
  this.lastAccessed = new Date();
  next();
});

// Static method to find similar roadmaps for caching
careerRoadmapSchema.statics.findSimilar = function (userProfile, limit = 5) {
  const query = {
    status: "active",
    "userProfile.currentLevel": userProfile.currentLevel,
    "userProfile.careerStage": userProfile.careerStage,
    "userProfile.interests": { $in: userProfile.interests },
    "userProfile.goals": { $in: userProfile.goals },
  };

  return this.find(query).sort({ createdAt: -1, accessCount: -1 }).limit(limit);
};

export default mongoose.model("CareerRoadmap", careerRoadmapSchema);
