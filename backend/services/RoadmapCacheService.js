import CareerRoadmap from '../models/CareerRoadmap.js';

class RoadmapCacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.maxCacheSize = 1000; // Maximum number of items in memory cache
  }

  /**
   * Generate cache key from user profile
   */
  generateCacheKey(userProfile) {
    const {
      currentLevel,
      careerStage,
      interests,
      goals,
      timeCommitment,
      preferredLearningStyle
    } = userProfile;

    // Sort arrays to ensure consistent key generation
    const sortedInterests = [...(interests || [])].sort().join('_');
    const sortedGoals = [...(goals || [])].sort().join('_');

    const key = `roadmap_${currentLevel}_${careerStage}_${sortedInterests}_${sortedGoals}_${timeCommitment}_${preferredLearningStyle}`;
    
    // Clean key to remove special characters
    return key.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  }

  /**
   * Check if cached roadmap exists in memory
   */
  getFromMemoryCache(cacheKey) {
    const cached = this.memoryCache.get(cacheKey);
    
    if (!cached) return null;
    
    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.memoryCache.delete(cacheKey);
      return null;
    }
    
    // Update access time
    cached.lastAccessed = Date.now();
    cached.accessCount = (cached.accessCount || 0) + 1;
    
    return cached.roadmap;
  }

  /**
   * Store roadmap in memory cache
   */
  setMemoryCache(cacheKey, roadmap) {
    // Remove oldest items if cache is full
    if (this.memoryCache.size >= this.maxCacheSize) {
      this.evictOldestItems(Math.floor(this.maxCacheSize * 0.1)); // Remove 10% of oldest items
    }

    this.memoryCache.set(cacheKey, {
      roadmap,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1
    });
  }

  /**
   * Evict oldest items from memory cache
   */
  evictOldestItems(count) {
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    for (let i = 0; i < count && i < entries.length; i++) {
      this.memoryCache.delete(entries[i][0]);
    }
  }

  /**
   * Find cached roadmap in database
   */
  async findCachedRoadmap(userProfile, userId) {
    try {
      const cacheKey = this.generateCacheKey(userProfile);
      
      // First check memory cache
      const memoryCached = this.getFromMemoryCache(cacheKey);
      if (memoryCached) {
        console.log('Roadmap found in memory cache');
        return memoryCached;
      }

      // Check database cache for exact match
      const exactMatch = await CareerRoadmap.findOne({
        cacheKey,
        status: 'active',
        createdAt: { $gte: new Date(Date.now() - this.cacheTimeout) }
      }).sort({ accessCount: -1, createdAt: -1 });

      if (exactMatch) {
        console.log('Exact match found in database cache');
        // Store in memory cache for faster future access
        this.setMemoryCache(cacheKey, exactMatch);
        return exactMatch;
      }

      // Look for similar roadmaps
      const similarRoadmap = await this.findSimilarRoadmap(userProfile, userId);
      if (similarRoadmap) {
        console.log('Similar roadmap found, reusing with adaptations');
        // Store in memory cache
        this.setMemoryCache(cacheKey, similarRoadmap);
        return similarRoadmap;
      }

      return null;
    } catch (error) {
      console.error('Cache lookup error:', error);
      return null;
    }
  }

  /**
   * Find similar roadmap based on profile overlap
   */
  async findSimilarRoadmap(userProfile, userId) {
    try {
      const {
        currentLevel,
        careerStage,
        interests,
        goals,
        timeCommitment
      } = userProfile;

      // Find roadmaps with high similarity score
      const candidates = await CareerRoadmap.find({
        status: 'active',
        'userProfile.currentLevel': currentLevel,
        'userProfile.careerStage': careerStage,
        'userProfile.timeCommitment': timeCommitment,
        createdAt: { $gte: new Date(Date.now() - this.cacheTimeout) }
      }).sort({ accessCount: -1, createdAt: -1 }).limit(20);

      let bestMatch = null;
      let bestScore = 0.7; // Minimum similarity threshold

      for (const candidate of candidates) {
        const similarity = this.calculateSimilarityScore(userProfile, candidate.userProfile);
        
        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatch = candidate;
        }
      }

      return bestMatch;
    } catch (error) {
      console.error('Similar roadmap search error:', error);
      return null;
    }
  }

  /**
   * Calculate similarity score between two user profiles
   */
  calculateSimilarityScore(profile1, profile2) {
    let score = 0;
    let factors = 0;

    // Level and stage match (high weight)
    if (profile1.currentLevel === profile2.currentLevel) {
      score += 0.3;
    }
    factors += 0.3;

    if (profile1.careerStage === profile2.careerStage) {
      score += 0.2;
    }
    factors += 0.2;

    // Time commitment match
    if (profile1.timeCommitment === profile2.timeCommitment) {
      score += 0.15;
    }
    factors += 0.15;

    // Learning style match
    if (profile1.preferredLearningStyle === profile2.preferredLearningStyle) {
      score += 0.1;
    }
    factors += 0.1;

    // Interests overlap
    const interestOverlap = this.calculateArrayOverlap(
      profile1.interests || [],
      profile2.interests || []
    );
    score += interestOverlap * 0.15;
    factors += 0.15;

    // Goals overlap
    const goalOverlap = this.calculateArrayOverlap(
      profile1.goals || [],
      profile2.goals || []
    );
    score += goalOverlap * 0.1;
    factors += 0.1;

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate overlap percentage between two arrays
   */
  calculateArrayOverlap(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) {
      return 0;
    }

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    return intersection.size / Math.max(set1.size, set2.size);
  }

  /**
   * Invalidate cache for user
   */
  async invalidateUserCache(userId) {
    try {
      // Remove from memory cache
      for (const [key, value] of this.memoryCache.entries()) {
        if (value.roadmap && value.roadmap.userId && value.roadmap.userId.toString() === userId.toString()) {
          this.memoryCache.delete(key);
        }
      }

      // Archive old roadmaps in database
      await CareerRoadmap.updateMany(
        { userId, status: 'active' },
        { status: 'archived' }
      );

      console.log(`Cache invalidated for user ${userId}`);
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Clean up expired cache entries
   */
  cleanupExpiredCache() {
    const now = Date.now();
    let removed = 0;

    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.memoryCache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`Cleaned up ${removed} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const memoryEntries = Array.from(this.memoryCache.values());
    
    return {
      memoryCacheSize: this.memoryCache.size,
      maxCacheSize: this.maxCacheSize,
      cacheHitRate: this.calculateHitRate(),
      averageAccessCount: memoryEntries.length > 0 
        ? memoryEntries.reduce((sum, entry) => sum + (entry.accessCount || 0), 0) / memoryEntries.length 
        : 0,
      oldestEntry: memoryEntries.length > 0 
        ? Math.min(...memoryEntries.map(entry => entry.timestamp)) 
        : null,
      newestEntry: memoryEntries.length > 0 
        ? Math.max(...memoryEntries.map(entry => entry.timestamp)) 
        : null
    };
  }

  /**
   * Calculate cache hit rate (simplified)
   */
  calculateHitRate() {
    // This is a simplified calculation
    // In a production system, you'd want to track hits/misses more accurately
    const entries = Array.from(this.memoryCache.values());
    if (entries.length === 0) return 0;
    
    const totalAccesses = entries.reduce((sum, entry) => sum + (entry.accessCount || 0), 0);
    return totalAccesses > 0 ? (totalAccesses / entries.length) / 10 : 0; // Rough estimate
  }

  /**
   * Preload popular roadmaps into cache
   */
  async preloadPopularRoadmaps() {
    try {
      const popular = await CareerRoadmap.find({
        status: 'active',
        accessCount: { $gte: 5 }
      })
      .sort({ accessCount: -1, createdAt: -1 })
      .limit(50);

      for (const roadmap of popular) {
        if (roadmap.cacheKey) {
          this.setMemoryCache(roadmap.cacheKey, roadmap);
        }
      }

      console.log(`Preloaded ${popular.length} popular roadmaps into cache`);
    } catch (error) {
      console.error('Preload error:', error);
    }
  }

  /**
   * Start periodic cache cleanup
   */
  startPeriodicCleanup() {
    // Clean up every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60 * 60 * 1000);

    // Preload popular roadmaps every 6 hours
    setInterval(() => {
      this.preloadPopularRoadmaps();
    }, 6 * 60 * 60 * 1000);

    console.log('Periodic cache cleanup started');
  }
}

// Create singleton instance
const roadmapCacheService = new RoadmapCacheService();

// Start periodic cleanup when module is loaded
roadmapCacheService.startPeriodicCleanup();

export default roadmapCacheService;