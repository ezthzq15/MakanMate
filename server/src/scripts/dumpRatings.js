const { db } = require('../config/firebase');

const run = async () => {
  try {
    const snap = await db.collection('Ratings').get();
    console.log(`Total Ratings documents: ${snap.size}`);
    snap.forEach(doc => {
      console.log(`Doc ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
