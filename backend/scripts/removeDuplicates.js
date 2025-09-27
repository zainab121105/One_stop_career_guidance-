import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

async function removeDuplicateEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpath');
    console.log('Connected to MongoDB');

    // Find all events
    const allEvents = await Event.find({}).sort({ createdAt: 1 }); // Sort by creation date (oldest first)
    console.log(`Found ${allEvents.length} total events`);

    if (allEvents.length === 0) {
      console.log('No events found in database');
      process.exit(0);
    }

    // Group events by title to find duplicates
    const eventGroups = {};
    
    allEvents.forEach(event => {
      const key = event.title.toLowerCase().trim();
      if (!eventGroups[key]) {
        eventGroups[key] = [];
      }
      eventGroups[key].push(event);
    });

    let duplicatesRemoved = 0;
    const eventsToDelete = [];

    // Process each group
    for (const [title, events] of Object.entries(eventGroups)) {
      if (events.length > 1) {
        console.log(`\n📋 Found ${events.length} duplicates for: "${events[0].title}"`);
        
        // Keep the first one (oldest), mark others for deletion
        for (let i = 1; i < events.length; i++) {
          eventsToDelete.push(events[i]._id);
          console.log(`  ❌ Marking for deletion: ${events[i]._id} (Created: ${events[i].createdAt})`);
        }
        
        console.log(`  ✅ Keeping: ${events[0]._id} (Created: ${events[0].createdAt})`);
        duplicatesRemoved += events.length - 1;
      }
    }

    if (eventsToDelete.length > 0) {
      console.log(`\n🗑️ Removing ${eventsToDelete.length} duplicate events...`);
      await Event.deleteMany({ _id: { $in: eventsToDelete } });
      console.log(`✅ Successfully removed ${duplicatesRemoved} duplicate events!`);
      
      // Show final count
      const finalCount = await Event.countDocuments();
      console.log(`📊 Final event count: ${finalCount}`);
      
    } else {
      console.log('\n✨ No duplicate events found. Database is clean!');
    }

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    process.exit(1);
  }
}

removeDuplicateEvents();