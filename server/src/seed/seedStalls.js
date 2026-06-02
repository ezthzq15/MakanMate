/**
 * Seed Script: Penang Food Stalls
 * Collection: FoodStalls
 * 
 * Reads from: ../../data/stallsData.json
 * 
 * Features:
 * - Validates required fields against the Stall model schema
 * - Checks for duplicates by stallName (case-insensitive)
 * - Stores stallID back into the document (matches existing convention)
 * - Logs every insert, skip, and validation error clearly
 * 
 * Usage:
 *   node src/seed/seedStalls.js
 */

const path = require('path');
const fs = require('fs');
const { db } = require('../config/firebase');

// ──────────────────────────────────────────────
// 1. Load JSON seed data
// ──────────────────────────────────────────────
const DATA_PATH = path.resolve(__dirname, '../../data/stallsData.json');

if (!fs.existsSync(DATA_PATH)) {
  console.error(`[Error] Seed data file not found at: ${DATA_PATH}`);
  process.exit(1);
}

let stallsData;
try {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  stallsData = JSON.parse(raw);
} catch (err) {
  console.error('[Error] Failed to parse stallsData.json:', err.message);
  process.exit(1);
}

// ──────────────────────────────────────────────
// 2. Validation: matches Stall model schema
// ──────────────────────────────────────────────

/**
 * Validates a single stall record against the Stall model fields.
 * Returns { valid: boolean, errors: string[] }
 */
function validateStall(stall, index) {
  const errors = [];

  if (!stall.stallName || typeof stall.stallName !== 'string' || stall.stallName.trim() === '') {
    errors.push(`[Row ${index}] 'stallName' is required and must be a non-empty string.`);
  }

  if (!stall.cuisineType || typeof stall.cuisineType !== 'string' || stall.cuisineType.trim() === '') {
    errors.push(`[Row ${index}] 'cuisineType' is required and must be a non-empty string.`);
  }

  if (typeof stall.isHalal !== 'boolean') {
    errors.push(`[Row ${index}] 'isHalal' must be a boolean (true/false). Got: ${typeof stall.isHalal}`);
  }

  if (stall.latitude === undefined || stall.latitude === null || isNaN(Number(stall.latitude))) {
    errors.push(`[Row ${index}] 'latitude' must be a valid number.`);
  } else {
    const lat = Number(stall.latitude);
    if (lat < -90 || lat > 90) {
      errors.push(`[Row ${index}] 'latitude' must be between -90 and 90. Got: ${lat}`);
    }
  }

  if (stall.longitude === undefined || stall.longitude === null || isNaN(Number(stall.longitude))) {
    errors.push(`[Row ${index}] 'longitude' must be a valid number.`);
  } else {
    const lng = Number(stall.longitude);
    if (lng < -180 || lng > 180) {
      errors.push(`[Row ${index}] 'longitude' must be between -180 and 180. Got: ${lng}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ──────────────────────────────────────────────
// 3. Build Firestore document from seed record
//    Matches Stall.toFirestore() + stallManagementService.createStall() conventions
// ──────────────────────────────────────────────
function buildFirestoreDoc(stall) {
  const now = new Date().toISOString();
  return {
    stallName: stall.stallName.trim(),
    cuisineType: stall.cuisineType.trim(),
    isHalal: Boolean(stall.isHalal),
    isMuslimFriendly: Boolean(stall.isMuslimFriendly ?? false),
    latitude: Number(stall.latitude),
    longitude: Number(stall.longitude),
    description: stall.description || '',
    operatingHours: stall.operatingHours || '',
    imageURL: stall.imageURL || '',
    managerID: stall.managerID || null,
    averageRating: typeof stall.averageRating === 'number' ? stall.averageRating : 0,
    totalReviews: typeof stall.totalReviews === 'number' ? stall.totalReviews : 0,
    createdAt: now,
    updatedAt: now
  };
}

// ──────────────────────────────────────────────
// 4. Main seed function
// ──────────────────────────────────────────────
async function seedStalls() {
  console.log('='.repeat(60));
  console.log('  MakanMate — Penang Food Stalls Seed Script');
  console.log('='.repeat(60));
  console.log(`  Data file : ${DATA_PATH}`);
  console.log(`  Records   : ${stallsData.length}`);
  console.log('='.repeat(60));

  if (!Array.isArray(stallsData) || stallsData.length === 0) {
    console.error('[Error] stallsData.json is empty or not a JSON array.');
    process.exit(1);
  }

  const collection = db.collection('FoodStalls');

  // ── Step 1: Fetch all existing stall names for duplicate check ──
  console.log('\n[1/3] Fetching existing FoodStalls from Firestore for duplicate detection...');
  const existingSnapshot = await collection.get();
  const existingNames = new Set(
    existingSnapshot.docs.map(doc => (doc.data().stallName || '').toLowerCase().trim())
  );
  console.log(`      Found ${existingSnapshot.size} existing stall(s) in Firestore.`);

  // ── Step 2: Validate all records before inserting ──
  console.log('\n[2/3] Validating seed records...');
  let hasValidationErrors = false;

  for (let i = 0; i < stallsData.length; i++) {
    const { valid, errors } = validateStall(stallsData[i], i + 1);
    if (!valid) {
      hasValidationErrors = true;
      errors.forEach(e => console.error(`  ✗  ${e}`));
    }
  }

  if (hasValidationErrors) {
    console.error('\n[Error] Validation failed. Fix the above errors in stallsData.json before seeding.');
    process.exit(1);
  }

  console.log(`      All ${stallsData.length} records passed validation.`);

  // ── Step 3: Insert non-duplicate records ──
  console.log('\n[3/3] Inserting records into FoodStalls collection...\n');

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < stallsData.length; i++) {
    const stall = stallsData[i];
    const normalizedName = (stall.stallName || '').toLowerCase().trim();

    // Duplicate check by stallName (case-insensitive)
    if (existingNames.has(normalizedName)) {
      console.log(`  ⚠  [SKIP] Already exists: "${stall.stallName}"`);
      skipped++;
      continue;
    }

    try {
      const doc = buildFirestoreDoc(stall);
      const docRef = await collection.add(doc);

      // Store stallID back into the document — matches existing seedStalls.js convention
      await docRef.update({ stallID: docRef.id });

      existingNames.add(normalizedName); // Prevent in-run duplicates
      console.log(`  ✓  [INSERT] "${stall.stallName}" → ID: ${docRef.id}`);
      inserted++;
    } catch (err) {
      console.error(`  ✗  [FAILED] "${stall.stallName}": ${err.message}`);
      failed++;
    }
  }

  // ── Summary ──
  console.log('\n' + '='.repeat(60));
  console.log('  Seeding Complete');
  console.log('='.repeat(60));
  console.log(`  ✓ Inserted : ${inserted}`);
  console.log(`  ⚠ Skipped  : ${skipped} (duplicates)`);
  console.log(`  ✗ Failed   : ${failed}`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

// ──────────────────────────────────────────────
// 5. Run
// ──────────────────────────────────────────────
seedStalls().catch(err => {
  console.error('[Fatal] Seed script crashed:', err);
  process.exit(1);
});
