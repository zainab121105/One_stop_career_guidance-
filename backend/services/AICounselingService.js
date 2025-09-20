import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
class AICounselingService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    // Use the model from environment or default to gemini-pro
    const modelName = process.env.GOOGLE_AI_MODEL || "gemini-pro";
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    
    console.log(`🤖 AI Counseling Service initialized with model: ${modelName}`);
    console.log(`🔑 API Key configured: ${process.env.GOOGLE_AI_API_KEY ? 'Yes' : 'No'}`);
    
    // System context for career counseling
    this.systemContext = `You are an expert AI Career Counselor with extensive knowledge in career development, education pathways, and professional growth. Your role is to provide personalized, helpful, and encouraging career guidance.

Key responsibilities:
- Provide career advice and guidance based on user's background and goals
- Suggest relevant courses, certifications, and learning paths
- Help with resume building, interview preparation, and job search strategies
- Assist with career transitions and skill development planning
- Offer salary insights and industry trends
- Provide mental health support for career-related stress
- Give actionable, practical advice that users can implement

Communication style:
- Be supportive, encouraging, and professional
- Ask follow-up questions to better understand user needs
- Provide specific, actionable recommendations
- Use examples and real-world scenarios when helpful
- Keep responses concise but comprehensive
- Show empathy for career challenges

Remember to personalize your responses based on the user's profile and conversation history.`;
  }

  /**
   * Test the Google AI API connection
   */
  async testConnection() {
    try {
      const testPrompt = "Hello! Please respond with 'API connection successful' to confirm the connection.";
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      const responseText = response.text();
      
      console.log('✅ Google AI API connection test successful');
      console.log('Test response:', responseText);
      
      return {
        success: true,
        response: responseText,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Google AI API connection test failed:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate AI response for career counseling chat
   */
  async generateCounselingResponse(message, userProfile = null, conversationHistory = []) {
    try {
      const prompt = this.buildCounselingPrompt(message, userProfile, conversationHistory);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      return {
        success: true,
        response: responseText,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating AI counseling response:', error);
      
      // Fallback response for various error scenarios
      let fallbackResponse = "I apologize, but I'm experiencing some technical difficulties right now. ";
      
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        fallbackResponse += "Due to high demand, please try again in a few moments. In the meantime, I'd be happy to help you think through your career questions step by step.";
      } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
        fallbackResponse += "Let me rephrase that to better assist you with your career goals. What specific aspect of your career would you like to focus on today?";
      } else {
        fallbackResponse += "However, I'm still here to help with your career questions. Could you please rephrase your question, and I'll do my best to provide guidance?";
      }

      return {
        success: false,
        response: fallbackResponse,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Build prompt for AI counseling with context
   */
  buildCounselingPrompt(userMessage, userProfile, conversationHistory) {
    let prompt = this.systemContext + "\n\n";

    // Add user profile context if available
    if (userProfile) {
      prompt += "User Profile Context:\n";
      if (userProfile.currentLevel) prompt += `Education Level: ${userProfile.currentLevel}\n`;
      if (userProfile.careerStage) prompt += `Career Stage: ${userProfile.careerStage}\n`;
      if (userProfile.interests?.length > 0) prompt += `Interests: ${userProfile.interests.join(', ')}\n`;
      if (userProfile.goals?.length > 0) prompt += `Goals: ${userProfile.goals.join(', ')}\n`;
      if (userProfile.currentSkills?.length > 0) prompt += `Current Skills: ${userProfile.currentSkills.join(', ')}\n`;
      if (userProfile.experience) prompt += `Experience: ${userProfile.experience}\n`;
      prompt += "\n";
    }

    // Add recent conversation history for context (last 5 messages)
    if (conversationHistory.length > 0) {
      prompt += "Recent Conversation Context:\n";
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        prompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += "\n";
    }

    prompt += `Current User Question: ${userMessage}\n\n`;
    prompt += "Please provide a helpful, specific, and encouraging response to assist with their career development. Keep the response conversational and under 200 words unless they specifically ask for detailed information.";

    return prompt;
  }

  /**
   * Generate personalized career assessment questions
   */
  async generateAssessmentQuestions(userProfile) {
    try {
      const prompt = `${this.systemContext}

Based on the following user profile, generate 5 thoughtful career assessment questions that would help provide better career guidance:

User Profile:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile data available'}

Generate questions that are:
- Specific to their background and goals
- Designed to uncover career preferences and motivations
- Helpful for providing personalized recommendations
- Easy to understand and answer

Format as a JSON array of question objects with "id", "question", and "category" fields.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      try {
        const questions = JSON.parse(response.text());
        return { success: true, questions };
      } catch (parseError) {
        // Fallback questions if parsing fails
        const fallbackQuestions = [
          { id: 1, question: "What motivates you most in your work or studies?", category: "motivation" },
          { id: 2, question: "Where do you see yourself in 5 years professionally?", category: "goals" },
          { id: 3, question: "What type of work environment do you thrive in?", category: "preferences" },
          { id: 4, question: "What are your strongest skills or talents?", category: "skills" },
          { id: 5, question: "What challenges are you currently facing in your career journey?", category: "challenges" }
        ];
        return { success: true, questions: fallbackQuestions };
      }
    } catch (error) {
      console.error('Error generating assessment questions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze user responses and provide insights
   */
  async analyzeUserResponses(responses, userProfile) {
    try {
      const prompt = `${this.systemContext}

Analyze the following user responses to provide career insights and recommendations:

User Profile: ${JSON.stringify(userProfile, null, 2)}

User Responses: ${JSON.stringify(responses, null, 2)}

Provide a comprehensive analysis including:
1. Key insights about their career preferences
2. Recommended career paths or directions
3. Skills to develop
4. Next action steps
5. Resources or courses to consider

Format the response as a structured analysis that's encouraging and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        analysis: response.text(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing user responses:', error);
      return {
        success: false,
        error: error.message,
        analysis: "I apologize, but I'm unable to complete the analysis right now. However, based on your responses, I encourage you to continue exploring your interests and consider speaking with a career counselor for personalized guidance."
      };
    }
  }
}

export default new AICounselingService();