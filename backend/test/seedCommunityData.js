import mongoose from 'mongoose';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import ForumPost from '../models/ForumPost.js';
import Event from '../models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://b23cs130:pan_chocolate_1234@cluster0.j98hbvf.mongodb.net/career_ai?retryWrites=true&w=majority&appName=Cluster0';

async function seedCommunityData() {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Mentor.deleteMany({});
    await ForumPost.deleteMany({});
    await Event.deleteMany({});

    // Find existing user to use as test data owner
    const testUser = await User.findOne({ email: 'b23cs140@kitsw.ac.in' });
    if (!testUser) {
      console.error('Test user not found. Please create a user first.');
      process.exit(1);
    }

    // Seed Mentors
    const mentors = [
      {
        userId: testUser._id,
        name: 'Dr. Priya Sharma',
        title: 'Senior Software Engineer',
        company: 'Google',
        bio: 'Helping students transition into tech careers with hands-on guidance.',
        experience: '12 years',
        expertise: ['Web Development', 'Data Science', 'Career Transition'],
        languages: ['English', 'Hindi', 'Marathi'],
        location: 'Mumbai',
        availability: 'Available',
        price: { amount: 500, currency: 'INR' },
        rating: { average: 4.9, count: 156 },
        totalSessions: 156,
        isVerified: true,
        profileImage: '👩‍💼'
      },
      {
        userId: testUser._id,
        name: 'Prof. Rajesh Kumar',
        title: 'IIT Professor',
        company: 'IIT Delhi',
        bio: 'Experienced academic with expertise in engineering and research guidance.',
        experience: '20 years',
        expertise: ['Engineering', 'Research', 'Academia'],
        languages: ['English', 'Hindi'],
        location: 'Delhi',
        availability: 'Busy',
        price: { amount: 800, currency: 'INR' },
        rating: { average: 4.8, count: 203 },
        totalSessions: 203,
        isVerified: true,
        profileImage: '👨‍🏫'
      },
      {
        userId: testUser._id,
        name: 'Ms. Anita Desai',
        title: 'Marketing Director',
        company: 'Unilever',
        bio: 'Marketing expert with extensive experience in brand building and digital strategies.',
        experience: '15 years',
        expertise: ['Digital Marketing', 'Brand Management', 'Leadership'],
        languages: ['English', 'Hindi', 'Kannada'],
        location: 'Bangalore',
        availability: 'Available',
        price: { amount: 600, currency: 'INR' },
        rating: { average: 4.7, count: 89 },
        totalSessions: 89,
        isVerified: true,
        profileImage: '👩‍💼'
      }
    ];

    await Mentor.insertMany(mentors);
    console.log('Mentors seeded successfully');

    // Seed Forum Posts
    const forumPosts = [
      {
        title: 'How to prepare for GATE 2024?',
        content: 'Looking for effective preparation strategies for GATE exam. I am currently in my third year of engineering and want to start preparing early. What are the best resources, study schedule, and mock test platforms you would recommend?',
        excerpt: 'Looking for effective preparation strategies for GATE exam...',
        author: { userId: testUser._id, name: testUser.name },
        category: 'Engineering',
        tags: ['gate', 'exam-prep', 'engineering'],
        status: 'active',
        views: 156,
        likes: [{ userId: testUser._id }],
        replies: [
          {
            author: { userId: testUser._id, name: 'Study Expert' },
            content: 'Start with understanding the syllabus thoroughly and create a timeline. Focus on previous year papers.',
            likes: [{ userId: testUser._id }]
          }
        ],
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        title: 'Career switch from IT to Data Science',
        content: 'What are the best ways to transition from software development to data science? I have 3 years of experience in Java development but want to move into data science. Should I do a masters or are there good bootcamps?',
        excerpt: 'What are the best ways to transition from software development to data science?',
        author: { userId: testUser._id, name: testUser.name },
        category: 'Career Change',
        tags: ['data-science', 'career-switch', 'it'],
        status: 'active',
        views: 98,
        likes: [{ userId: testUser._id }],
        replies: [
          {
            author: { userId: testUser._id, name: 'Data Scientist' },
            content: 'I made a similar transition. Start with Python, statistics, and machine learning fundamentals. Kaggle competitions help a lot.',
            likes: []
          }
        ],
        lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        title: 'Government job vs Private sector',
        content: 'Need guidance on choosing between government jobs and private sector opportunities. I am confused about job security, growth prospects, and work-life balance. What factors should I consider while making this decision?',
        excerpt: 'Need guidance on choosing between government jobs and private sector opportunities...',
        author: { userId: testUser._id, name: testUser.name },
        category: 'Career Choice',
        tags: ['government-job', 'private-sector', 'career-advice'],
        status: 'active',
        views: 234,
        likes: [{ userId: testUser._id }],
        replies: [
          {
            author: { userId: testUser._id, name: 'HR Professional' },
            content: 'Both have pros and cons. Government jobs offer security but private sector offers faster growth and higher pay.',
            likes: [{ userId: testUser._id }]
          }
        ],
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    await ForumPost.insertMany(forumPosts);
    console.log('Forum posts seeded successfully');

    // Seed Events
    const events = [
      {
        title: 'Career Guidance Workshop',
        description: 'A comprehensive workshop covering career planning, resume building, and interview preparation. Perfect for students and early career professionals.',
        type: 'Online',
        category: 'Career Workshops',
        organizer: { userId: testUser._id, name: testUser.name, organization: 'CareerPath' },
        speakers: [
          { name: 'Dr. Priya Sharma', title: 'Senior Software Engineer', company: 'Google' }
        ],
        schedule: {
          startDate: new Date('2024-02-15'),
          startTime: '10:00',
          endTime: '12:00',
          timezone: 'Asia/Kolkata'
        },
        location: {
          meetingLink: 'https://zoom.us/j/123456789',
          instructions: 'Link will be shared via email before the event'
        },
        capacity: { maxAttendees: 100, currentAttendees: 45 },
        registration: { isRequired: true, fee: { amount: 0, currency: 'INR' } },
        status: 'published',
        tags: ['career', 'workshop', 'guidance']
      },
      {
        title: 'Engineering Career Panel',
        description: 'Panel discussion with industry experts about various engineering career paths, emerging technologies, and skill requirements.',
        type: 'Hybrid',
        category: 'Industry Panels',
        organizer: { userId: testUser._id, name: testUser.name, organization: 'IIT Delhi' },
        speakers: [
          { name: 'Prof. Rajesh Kumar', title: 'IIT Professor', company: 'IIT Delhi' }
        ],
        schedule: {
          startDate: new Date('2024-02-20'),
          startTime: '15:00',
          endTime: '17:00',
          timezone: 'Asia/Kolkata'
        },
        location: {
          venue: 'IIT Delhi Auditorium',
          address: 'Hauz Khas, New Delhi',
          city: 'Delhi',
          meetingLink: 'https://zoom.us/j/987654321'
        },
        capacity: { maxAttendees: 150, currentAttendees: 78 },
        registration: { isRequired: true, fee: { amount: 100, currency: 'INR' } },
        status: 'published',
        tags: ['engineering', 'panel', 'career']
      },
      {
        title: 'Mock Interview Session',
        description: 'Practice your interview skills with industry professionals. Get personalized feedback and tips.',
        type: 'Online',
        category: 'Mock Interviews',
        organizer: { userId: testUser._id, name: testUser.name, organization: 'CareerPath' },
        speakers: [
          { name: 'Ms. Anita Desai', title: 'Marketing Director', company: 'Unilever' }
        ],
        schedule: {
          startDate: new Date('2024-02-25'),
          startTime: '14:00',
          endTime: '16:00',
          timezone: 'Asia/Kolkata'
        },
        location: {
          meetingLink: 'https://zoom.us/j/555666777',
          instructions: 'Prepare your resume and common interview questions'
        },
        capacity: { maxAttendees: 50, currentAttendees: 23 },
        registration: { isRequired: true, fee: { amount: 200, currency: 'INR' } },
        status: 'published',
        tags: ['interview', 'practice', 'skills']
      }
    ];

    await Event.insertMany(events);
    console.log('Events seeded successfully');

    console.log('All community data seeded successfully!');
    await mongoose.disconnect();

  } catch (error) {
    console.error('Error seeding data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedCommunityData();