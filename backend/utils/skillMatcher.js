import Career from '../models/Career.js';
import { logger } from './logger.js';

export const getSkillRecommendations = async (user) => {
  try {
    logger.info(`Getting skill recommendations for user: ${user.email}`);

    // Get user's current skills
    const currentSkills = user.profile.skills || [];
    const userGoals = user.profile.goals || [];
    const userInterests = user.profile.interests || [];

    // Find relevant careers based on user profile
    const relevantCareers = await Career.find({
      $or: [
        { category: { $in: userInterests } },
        { industry: { $in: userInterests } },
        { title: { $regex: userGoals.join('|'), $options: 'i' } }
      ]
    }).limit(10);

    // Extract required skills from relevant careers
    const requiredSkills = new Map();
    
    relevantCareers.forEach(career => {
      career.requiredSkills.forEach(skill => {
        if (requiredSkills.has(skill.name)) {
          requiredSkills.set(skill.name, {
            ...requiredSkills.get(skill.name),
            frequency: requiredSkills.get(skill.name).frequency + 1
          });
        } else {
          requiredSkills.set(skill.name, {
            name: skill.name,
            level: skill.level,
            importance: skill.importance,
            frequency: 1,
            category: categorizeSkill(skill.name)
          });
        }
      });
    });

    // Convert to array and sort by frequency and importance
    const skillRecommendations = Array.from(requiredSkills.values())
      .sort((a, b) => {
        if (a.importance === 'essential' && b.importance !== 'essential') return -1;
        if (b.importance === 'essential' && a.importance !== 'essential') return 1;
        return b.frequency - a.frequency;
      })
      .slice(0, 15); // Top 15 recommendations

    // Filter out skills user already has at required level
    const filteredRecommendations = skillRecommendations.filter(skill => {
      const userSkill = currentSkills.find(us => us.name === skill.name);
      if (!userSkill) return true; // User doesn't have this skill
      
      const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
      const userLevel = levelOrder.indexOf(userSkill.level);
      const requiredLevel = levelOrder.indexOf(skill.level);
      
      return userLevel < requiredLevel; // User's level is below required
    });

    return {
      recommendations: filteredRecommendations,
      totalCareersAnalyzed: relevantCareers.length,
      userCurrentSkills: currentSkills.length,
    };
  } catch (error) {
    logger.error('Skill recommendation error:', error);
    throw new Error('Failed to get skill recommendations');
  }
};

function categorizeSkill(skillName) {
  const technicalSkills = ['Programming', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis'];
  const softSkills = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'];
  const domainSkills = ['Finance', 'Marketing', 'Design', 'Sales', 'Operations'];
  
  if (technicalSkills.some(tech => skillName.toLowerCase().includes(tech.toLowerCase()))) {
    return 'technical';
  }
  
  if (softSkills.some(soft => skillName.toLowerCase().includes(soft.toLowerCase()))) {
    return 'soft';
  }
  
  if (domainSkills.some(domain => skillName.toLowerCase().includes(domain.toLowerCase()))) {
    return 'domain';
  }
  
  return 'technical'; // default
}