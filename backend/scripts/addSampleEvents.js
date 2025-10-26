import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

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
      meetingLink: "https://zoom.us/j/123456789",
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
    speakers: [
      {
        name: "Ms. Ananya Sharma",
        title: "Software Engineer",
        company: "Google",
        bio: "Experienced Python developer with 5+ years in the industry"
      }
    ],
    status: "published",
    tags: ["python", "programming", "workshop", "beginners"]
  },
  {
    title: "Career Transition Workshop: From Student to Professional",
    description: "Navigate your journey from academic life to professional career. Learn about industry expectations, resume building, interview preparation, and workplace skills essential for success.",
    type: "Hybrid",
    category: "Career Workshops",
    schedule: {
      startDate: "2025-10-05",
      endDate: "2025-10-05",
      startTime: "14:00",
      endTime: "17:00",
      timezone: "Asia/Kolkata"
    },
    location: {
      venue: "Tech Hub Conference Center",
      address: "123 Innovation Drive, Sector 62",
      city: "Noida",
      meetingLink: "https://zoom.us/j/987654321",
      instructions: "Bring your laptop and updated resume. Hybrid participants can join via Zoom link."
    },
    capacity: {
      maxAttendees: 100,
      currentAttendees: 0
    },
    registration: {
      isRequired: true,
      startDate: "2025-09-20",
      deadline: "2025-10-03",
      fee: {
        amount: 500,
        currency: "INR"
      }
    },
    speakers: [
      {
        name: "Dr. Rajesh Kumar",
        title: "Career Counselor",
        company: "CareerGuidance Institute",
        bio: "Professional career counselor with 10+ years of experience helping students transition to industry"
      }
    ],
    status: "published",
    tags: ["career", "transition", "professional", "workshop"]
  },
  {
    title: "AI and Machine Learning Industry Panel",
    description: "Join industry experts from leading tech companies as they discuss the current state and future of AI/ML. Learn about career opportunities, required skills, and industry trends.",
    type: "Online",
    category: "Industry Panels",
    schedule: {
      startDate: "2025-10-12",
      endDate: "2025-10-12",
      startTime: "16:00",
      endTime: "18:00",
      timezone: "Asia/Kolkata"
    },
    location: {
      venue: "",
      address: "",
      city: "",
      meetingLink: "https://zoom.us/j/456789123",
      instructions: "Interactive Q&A session included. Come prepared with your questions about AI/ML careers."
    },
    capacity: {
      maxAttendees: 200,
      currentAttendees: 0
    },
    registration: {
      isRequired: true,
      startDate: "2025-09-28",
      deadline: "2025-10-11",
      fee: {
        amount: 0,
        currency: "INR"
      }
    },
    speakers: [
      {
        name: "Ms. Priya Singh",
        title: "ML Engineer",
        company: "Microsoft",
        bio: "Machine Learning Engineer specializing in NLP and computer vision"
      },
      {
        name: "Mr. Arjun Patel",
        title: "Data Scientist",
        company: "Amazon",
        bio: "Senior Data Scientist with expertise in recommendation systems and deep learning"
      }
    ],
    status: "published",
    tags: ["ai", "machine-learning", "panel", "industry", "careers"]
  }
];

async function addSampleEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpath');
    console.log('Connected to MongoDB');

    // Get or create a sample user to be the organizer
    let sampleUser = await User.findOne({ email: 'admin@careerpath.com' });
    
    if (!sampleUser) {
      sampleUser = new User({
        name: 'Career Path Admin',
        email: 'admin@careerpath.com',
        password: 'hashedpassword', // This should be properly hashed in real scenario
        role: 'admin'
      });
      await sampleUser.save();
      console.log('Created sample admin user');
    }

    // Add organizer info to each event
    const eventsWithOrganizer = sampleEvents.map(event => ({
      ...event,
      organizer: {
        userId: sampleUser._id,
        name: sampleUser.name,
        organization: 'Career Path Platform'
      }
    }));

    // Clear existing events first (optional - remove this if you want to keep existing ones)
    // await Event.deleteMany({});
    // console.log('Cleared existing events');

    // Insert sample events
    const insertedEvents = await Event.insertMany(eventsWithOrganizer);
    console.log(`✅ Successfully added ${insertedEvents.length} sample events:`);
    
    insertedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - Registration: ${event.registrationOpen ? 'Open' : 'Closed'}`);
    });

    console.log('\nSample events have been added to the database!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error adding sample events:', error);
    process.exit(1);
  }
}

addSampleEvents();