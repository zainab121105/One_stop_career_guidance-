# CareerPath - One-Stop Personalized Career & Education Advisor

A comprehensive full-stack platform that helps students and professionals discover their ideal career paths through AI-powered guidance, personalized roadmaps, and expert mentorship.

## 🚀 Features

### Current Implementation

- **Landing Page**: Modern, responsive design with feature showcase
- **Authentication System**: Secure login/signup with JWT tokens
- **Intelligent Onboarding**: Multi-step gamified assessment process
- **Dashboard**: Personalized user dashboard with stats and recommendations
- **User Management**: Profile management and preferences
- **Activity Tracking**: User activity logging and progress tracking

### Upcoming Features

- Personalized Career Roadmaps
- AI Career Counselling Chatbot (24/7)
- Gamified Progress Tracker with Badges
- Scholarships & Government Schemes Database
- Multi-dimensional Assessment Engine
- Community & Support Platform
- Government College & Course Finder
- AI-Powered Career Recommendation Engine
- Google ADK-Powered Job Agent

## 🛠️ Tech Stack

### Frontend

- **React 18** with JSX
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Database Structure

- **MongoDB**: User data, activities, progress tracking
- **Firebase**: Planned for multimedia data storage

## 📁 Project Structure

```
careerpath/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API services
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js backend API
│   ├── models/              # MongoDB models
│   ├── routes/              # Express routes
│   ├── middleware/          # Custom middleware
│   ├── server.js
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd careerpath
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**

   **Backend:**

   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

   **Frontend:**

   ```bash
   # In the frontend directory
   cp .env.example .env
   # Edit .env with your API URL configuration
   ```

   The frontend `.env` file should contain:

   ```env
   # API Base URL - Used for all backend API calls
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_API_TIMEOUT=10000
   VITE_APP_ENV=development
   ```

4. **Start MongoDB**

   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/careerpath`

5. **Run the application**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/careerpath

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### User Management

- `POST /api/user/onboarding` - Save onboarding data
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/activity` - Get user activity
- `GET /api/user/recommendations` - Get career recommendations
- `GET /api/user/badges` - Get user badges
- `PUT /api/user/preferences` - Update user preferences

## 🎨 Design System

### Colors

- **Primary**: Blue shades (#3B82F6)
- **Accent**: Green shades (#10B981)
- **Warning**: Orange shades (#F59E0B)
- **Neutral**: Gray shades

### Components

- Responsive design with mobile-first approach
- Consistent spacing using 8px grid system
- Modern UI with subtle shadows and rounded corners
- Smooth animations and micro-interactions

## 🧪 Development

### Code Style

- ESLint configuration for code quality
- Consistent naming conventions
- Modular component structure
- Clean separation of concerns

### State Management

- React Context for authentication
- Local state for component-specific data
- API-first architecture

## 🚀 Deployment

### Frontend Deployment

**Environment Configuration for Production:**
Before deploying, create a `.env.production` file with your production API URL:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_API_TIMEOUT=10000
VITE_APP_ENV=production
```

**Build and Deploy:**

```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service (Vercel, Netlify, etc.)
```

**Important Notes:**

- The frontend now uses environment variables for API configuration
- Update `VITE_API_BASE_URL` to match your deployed backend URL
- Environment variables must be prefixed with `VITE_` to be accessible in the browser
- For different environments (staging, production), use appropriate `.env` files

### Backend Deployment

```bash
cd backend
# Set production environment variables
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern career platforms
- Icons by Lucide React
- UI components built with Tailwind CSS
- Backend powered by Express.js and MongoDB

---

**CareerPath** - Empowering careers through intelligent guidance 🚀
