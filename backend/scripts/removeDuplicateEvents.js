import mongoose from 'mongoose';
import Event from '../models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const removeDuplicateEvents = async () => {
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

    // Find all events
    const allEvents = await Event.find({}).sort({ createdAt: 1 });
    console.log(`Found ${allEvents.length} total events`);

    // Group events by title and start date (assuming these make an event unique)
    const eventGroups = {};
    const duplicateIds = [];

    allEvents.forEach(event => {
      const key = `${event.title.toLowerCase().trim()}_${event.schedule.startDate}`;
      
      if (eventGroups[key]) {
        // This is a duplicate - add to deletion list (keep the first one)
        duplicateIds.push(event._id);
        console.log(`Found duplicate: ${event.title} (ID: ${event._id})`);
      } else {
        // This is the first occurrence - keep it
        eventGroups[key] = event;
      }
    });

    if (duplicateIds.length === 0) {
      console.log('No duplicate events found!');
      process.exit(0);
    }

    console.log(`\nFound ${duplicateIds.length} duplicate events to remove:`);
    
    // Ask for confirmation
    const { createInterface } = await import('readline');
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`Do you want to delete ${duplicateIds.length} duplicate events? (y/N): `, async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        try {
          // Delete duplicate events
          const result = await Event.deleteMany({ _id: { $in: duplicateIds } });
          console.log(`Successfully deleted ${result.deletedCount} duplicate events`);
          
          // Show remaining events
          const remainingEvents = await Event.find({}).sort({ createdAt: -1 });
          console.log(`\nRemaining events (${remainingEvents.length}):`);
          remainingEvents.forEach(event => {
            console.log(`- ${event.title} (${new Date(event.schedule.startDate).toDateString()})`);
          });
          
        } catch (error) {
          console.error('Error deleting duplicate events:', error);
        }
      } else {
        console.log('Cancelled deletion');
      }
      
      rl.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

removeDuplicateEvents();