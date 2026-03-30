/**
 * One-time migration script: isActive (boolean) → accountStatus (integer)
 *
 * 0 = Active   (was isActive: true)
 * 1 = Not Active
 * 2 = Suspended (was isActive: false)
 *
 * Run: node src/scripts/migrateAccountStatus.js
 */

require('dotenv').config();
const { db } = require('../config/firebase');

const migrate = async () => {
  const snapshot = await db.collection('users').get();

  if (snapshot.empty) {
    console.log('No users found.');
    return;
  }

  const batch = db.batch();
  let count = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const ref = db.collection('users').doc(doc.id);
    const update = {};

    // Only migrate if accountStatus hasn't been set yet
    if (data.accountStatus === undefined) {
      update.accountStatus = data.isActive === false ? 2 : 0;
      update.lastLoginAt = data.lastLoginAt || null;
      batch.update(ref, update);
      count++;
      console.log(`  [${doc.id}] isActive=${data.isActive} → accountStatus=${update.accountStatus}`);
    } else {
      console.log(`  [${doc.id}] Already migrated (accountStatus=${data.accountStatus}), skipping.`);
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`\n✅ Migration complete. ${count} document(s) updated.`);
  } else {
    console.log('\n✅ All documents already migrated. Nothing to do.');
  }
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
