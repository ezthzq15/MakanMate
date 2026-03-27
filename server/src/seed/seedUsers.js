const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');

/**
 * FYP Data Seeding Script
 * Collection: users
 * Roles: "user", "admin"
 */
const seedUsers = async () => {
  const usersToSeed = [
    {
      name: "Test User",
      email: "user@test.com",
      password: "password123",
      role: "user"
    },
    {
      name: "Admin User",
      email: "admin@test.com",
      password: "admin123",
      role: "admin"
    }
  ];

  try {
    console.log("--- Starting User Seeding ---");
    const usersRef = db.collection('users');

    for (const user of usersToSeed) {
      // 1. Check if user already exists (by email)
      const snapshot = await usersRef.where('email', '==', user.email).get();

      if (!snapshot.empty) {
        // Output: "User already exists: email"
        console.log(`User already exists: ${user.email}`);
        continue;
      }

      // 2. Security: Hash passwords using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // 3. Prepare Firestore document
      const newUser = {
        name: user.name,
        email: user.email,
        password: hashedPassword, // NEVER store plain password
        role: user.role,
        createdAt: new Date().toISOString()
      };

      // 4. Success: Save user in Firestore
      await usersRef.add(newUser);
      
      // Output: "User created: email"
      console.log(`User created: ${user.email}`);
    }

    console.log("--- Seeding Completed Successfully ---");
    process.exit(0);
  } catch (error) {
    console.error("--- Seeding Failed ---");
    console.error(error);
    process.exit(1);
  }
};

// Execute the seeding
seedUsers();
