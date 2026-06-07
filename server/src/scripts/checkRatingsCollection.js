const { db } = require('../config/firebase');

const run = async () => {
  try {
    const ratingsSnap = await db.collection('Ratings').get();
    console.log(`Total documents in Ratings: ${ratingsSnap.size}`);
    
    // Group by stallID
    const counts = {};
    const sumRatings = {};
    ratingsSnap.forEach(doc => {
      const data = doc.data();
      const sid = data.stallID;
      counts[sid] = (counts[sid] || 0) + 1;
      sumRatings[sid] = (sumRatings[sid] || 0) + (data.ratingScore || 0);
    });

    console.log('Grouped counts and averages:');
    for (const sid in counts) {
      const avg = (sumRatings[sid] / counts[sid]).toFixed(1);
      console.log(`- Stall ID: ${sid} | Count: ${counts[sid]} | Avg Rating: ${avg}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
