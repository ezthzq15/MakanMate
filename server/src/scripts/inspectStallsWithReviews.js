const { db } = require('../config/firebase');

const run = async () => {
  try {
    const ids = ["vXDtyrSwT7nsKSug4eNJ", "QvOft4hDkkOUiTGfTUAU"];
    for (const id of ids) {
      const doc = await db.collection('FoodStalls').doc(id).get();
      if (doc.exists) {
        console.log(`Stall ID: ${id} | Name: ${doc.data().stallName} | Rating (DB field): ${doc.data().rating} | ReviewCount (DB field): ${doc.data().reviewCount}`);
      } else {
        console.log(`Stall ID: ${id} not found`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
