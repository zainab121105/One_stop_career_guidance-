import mongoose from 'mongoose';
import Event from '../models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupDuplicateEvents = async () => {
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

    // Use MongoDB aggregation to find and remove duplicates
    const duplicates = await Event.aggregate([
      {
        $group: {
          _id: {
            title: "$title",
            startDate: "$schedule.startDate"
          },
          docs: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${duplicates.length} groups of duplicate events`);

    let totalDeleted = 0;
    
    for (const duplicate of duplicates) {
      // Keep the first document, delete the rest
      const idsToDelete = duplicate.docs.slice(1);
      
      if (idsToDelete.length > 0) {
        await Event.deleteMany({ _id: { $in: idsToDelete } });
        totalDeleted += idsToDelete.length;
        console.log(`Deleted ${idsToDelete.length} duplicates of event group`);
      }
    }

    console.log(`\nTotal duplicates deleted: ${totalDeleted}`);
    
    // Show final count
    const finalCount = await Event.countDocuments();
    console.log(`Remaining events: ${finalCount}`);

    // List remaining events
    const remainingEvents = await Event.find({}).sort({ createdAt: -1 }).select('title schedule.startDate createdAt');
    console.log('\nRemaining events:');
    remainingEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${new Date(event.schedule.startDate).toDateString()} (Created: ${new Date(event.createdAt).toLocaleString()})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    process.exit(1);
  }
};

cleanupDuplicateEvents();