import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AI Counseling API functions
export const aiCounselingAPI = {
  // Send a message to AI counselor
  sendMessage: async (message, sessionId = null) => {
    const response = await api.post('/ai-counseling/chat', {
      message,
      sessionId
    });
    return response.data;
  },

  // Get user's chat sessions
  getSessions: async (limit = 20, offset = 0, status = 'active') => {
    const response = await api.get('/ai-counseling/sessions', {
      params: { limit, offset, status }
    });
    return response.data;
  },

  // Get specific chat session
  getSession: async (sessionId) => {
    const response = await api.get(`/ai-counseling/sessions/${sessionId}`);
    return response.data;
  },

  // Update chat session
  updateSession: async (sessionId, updates) => {
    const response = await api.put(`/ai-counseling/sessions/${sessionId}`, updates);
    return response.data;
  },

  // Delete chat session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/ai-counseling/sessions/${sessionId}`);
    return response.data;
  },

  // Generate assessment questions
  generateAssessmentQuestions: async () => {
    const response = await api.post('/ai-counseling/assessment/questions');
    return response.data;
  },

  // Analyze assessment responses
  analyzeAssessmentResponses: async (responses) => {
    const response = await api.post('/ai-counseling/assessment/analyze', {
      responses
    });
    return response.data;
  },

  // Get counseling statistics
  getStats: async () => {
    const response = await api.get('/ai-counseling/stats');
    return response.data;
  }
};

export default api;