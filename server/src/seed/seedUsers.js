const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');

/**
 * FYP Data Seeding Script
 * Collection: users
 * Variables strictly from Class Diagram
 */
const seedUsers = async () => {
  const usersToSeed = [
    {
      userName: "Standard User 1",
      userEmail: "user1@makanmate.com",
      userPassword: "password123",
      userRole: "user",
      userPhone: "0123456789"
    },
    {
      userName: "Standard User 2",
      userEmail: "user2@makanmate.com",
      userPassword: "password123",
      userRole: "user",
      userPhone: "0198765432"
    },
    {
      userName: "Admin One",
      userEmail: "admin1@makanmate.com",
      userPassword: "adminpassword123",
      userRole: "admin",
      userPhone: "0177777777"
    },
    {
      userName: "Admin Two",
      userEmail: "admin2@makanmate.com",
      userPassword: "adminpassword123",
      userRole: "admin",
      userPhone: "0188888888"
    }
  ];

  try {
    console.log("--- Starting User Seeding (Class Diagram Alignment) ---");
    const usersRef = db.collection('users');

    for (const user of usersToSeed) {
      // 1. Check if user already exists (by userEmail)
      const snapshot = await usersRef.where('userEmail', '==', user.userEmail).get();

      if (!snapshot.empty) {
        console.log(`User already exists: ${user.userEmail}`);
        continue;
      }

      // 2. Hash passwords
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.userPassword, saltRounds);

      // 3. Prepare Firestore document (UserModel shape)
      const newUser = {
        userName: user.userName,
        userEmail: user.userEmail,
        userPassword: hashedPassword,
        userRole: user.userRole,
        userPhone: user.userPhone,
        isActive: true,
        preferenceID: "",
        createdAt: new Date().toISOString()
      };

      // 4. Save
      await usersRef.add(newUser);
      console.log(`User created: ${user.userEmail} [Role: ${user.userRole}]`);
    }

    console.log("--- Seeding Completed Successfully ---");
    process.exit(0);
  } catch (error) {
    console.error("--- Seeding Failed ---");
    console.error(error);
    process.exit(1);
  }
};

seedUsers();

