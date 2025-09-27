import mongoose from 'mongoose';
import Event from '../models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const restoreWorkingEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/careerpath",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log('Connected to MongoDB');
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Create working sample events
    const sampleEvents = [
      {
        title: "Boost Your Coding Skills with Python",
        description: "A hands-on online workshop designed to strengthen your Python programming skills. Learn essential concepts, work on live coding exercises, and explore problem-solving techniques that are crucial for technical interviews and real-world applications.",
        type: "Online",
        category: "Skill Development",
        schedule: {
          startDate: "2025-09-30",
          endDate: "2025-09-30",
          startTime: "11:00",
          endTime: "13:00",
          timezone: "Asia/Kolkata"
        },
        location: {
          venue: "",
          address: "",
          city: "",
          meetingLink: "https://zoom.us/j/example",
          instructions: "Ensure you have a stable internet connection and Python installed on your laptop. The Zoom meeting link will be emailed upon registration."
        },
        capacity: {
          maxAttendees: 50,
          currentAttendees: 0
        },
        registration: {
          isRequired: true,
          startDate: "2025-09-25",
          deadline: "2025-09-29",
          fee: {
            amount: 0,
            currency: "INR"
          }
        },
        speakers: [{
          name: "Ms. Ananya Sharma",
          title: "Software Engineer",
          company: "Google",
          bio: "Experienced Python developer with 5+ years in the industry"
        }],
        organizer: {
          userId: new mongoose.Types.ObjectId(),
          name: "Keshavardhini Bandagorla",
          organization: "Career Platform"
        },
        attendees: [],
        status: "published",
        tags: ["python", "programming", "coding"]
      },
      {
        title: "Mastering Interview Skills for Your Dream Job",
        description: "Comprehensive interview preparation workshop covering technical and behavioral interviews. Learn strategies, practice mock interviews, and gain confidence to ace your next job interview.",
        type: "Hybrid",
        category: "Career Workshops",
        schedule: {
          startDate: "2025-09-28",
          endDate: "2025-09-28",
          startTime: "14:00",
          endTime: "16:30",
          timezone: "Asia/Kolkata"
        },
        location: {
          venue: "Tech Hub Conference Room",
          address: "123 Business District",
          city: "Bangalore",
          meetingLink: "https://zoom.us/j/interview-workshop",
          instructions: "Bring a copy of your resume and be prepared for mock interview sessions."
        },
        capacity: {
          maxAttendees: 30,
          currentAttendees: 0
        },
        registration: {
          isRequired: true,
          startDate: "2025-09-20",
          deadline: "2025-09-27",
          fee: {
            amount: 500,
            currency: "INR"
          }
        },
        speakers: [{
          name: "Mr. Rajesh Kumar",
          title: "Senior HR Manager",
          company: "Microsoft",
          bio: "10+ years of experience in talent acquisition and interview processes"
        }],
        organizer: {
          userId: new mongoose.Types.ObjectId(),
          name: "Career Platform",
          organization: "Professional Development Center"
        },
        attendees: [],
        status: "published",
        tags: ["interview", "career", "job-preparation"]
      },
      {
        title: "Career Guidance Workshop",
        description: "Comprehensive career guidance session for students and professionals looking to make informed career decisions.",
        type: "Offline",
        category: "Career Workshops",
        schedule: {
          startDate: "2024-02-15",
          endDate: "2024-02-15",
          startTime: "10:00",
          endTime: "16:00",
          timezone: "Asia/Kolkata"
        },
        location: {
          venue: "Main Auditorium",
          address: "University Campus",
          city: "Mumbai",
          meetingLink: "",
          instructions: "Please bring your academic transcripts and resume for personalized guidance."
        },
        capacity: {
          maxAttendees: 100,
          currentAttendees: 0
        },
        registration: {
          isRequired: true,
          startDate: "2024-01-15",
          deadline: "2024-02-10",
          fee: {
            amount: 0,
            currency: "INR"
          }
        },
        speakers: [{
          name: "Dr. Priya Nair",
          title: "Career Counselor",
          company: "Education Ministry",
          bio: "PhD in Psychology with specialization in career counseling"
        }],
        organizer: {
          userId: new mongoose.Types.ObjectId(),
          name: "University Career Services",
          organization: "State University"
        },
        attendees: [],
        status: "published",
        tags: ["career", "guidance", "counseling"]
      }
    ];

    // Insert the events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`Successfully created ${createdEvents.length} sample events`);
    
    // Display created events
    createdEvents.forEach(event => {
      console.log(`✅ ${event.title} (${event.type}) - ${new Date(event.schedule.startDate).toDateString()}`);
    });
    
  } catch (error) {
    console.error('Error restoring events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

restoreWorkingEvents();