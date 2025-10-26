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
    
    // Get all events
    const allEvents = await Event.find({}).sort({ createdAt: 1 }); // Sort by creation date, keep oldest
    console.log(`Found ${allEvents.length} total events`);
    
    // Group events by title (you can change this criteria)
    const eventGroups = {};
    const duplicateIds = [];
    
    allEvents.forEach(event => {
      const key = event.title.toLowerCase().trim(); // Use title as unique identifier
      
      if (eventGroups[key]) {
        // This is a duplicate, mark for deletion
        duplicateIds.push(event._id);
        console.log(`Found duplicate: "${event.title}" (ID: ${event._id})`);
      } else {
        // This is the first occurrence, keep it
        eventGroups[key] = event;
        console.log(`Keeping: "${event.title}" (ID: ${event._id})`);
      }
    });
    
    // Remove duplicates
    if (duplicateIds.length > 0) {
      console.log(`\nRemoving ${duplicateIds.length} duplicate events...`);
      const result = await Event.deleteMany({ _id: { $in: duplicateIds } });
      console.log(`Successfully removed ${result.deletedCount} duplicate events`);
    } else {
      console.log('No duplicate events found');
    }
    
    // Show final events
    const finalEvents = await Event.find({}).sort({ createdAt: -1 });
    console.log(`\nFinal events (${finalEvents.length}):`);
    finalEvents.forEach(event => {
      console.log(`- ${event.title} (${new Date(event.schedule.startDate).toDateString()})`);
    });
    
  } catch (error) {
    console.error('Error removing duplicates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

removeDuplicateEvents();