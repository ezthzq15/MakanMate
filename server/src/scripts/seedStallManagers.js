const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');

const seedStallManagers = async () => {
  const managerNames = [
    "Farhan bin Halim", "Siti Aminah", "Tan Wei Seng", "Rajesh Kumar", "Nurul Huda",
    "Chong Mei Ling", "Ariff Redzuan", "Lim Kok Wing", "Sangeetha Devi", "Ahmad Syakir",
    "Leong Kah Fai", "Priya Nair", "Muhammad Hafiz", "Cheah Siew Lan", "Karthik Subramanian",
    "Zulkifli Abdullah", "Ng Kok Keong", "Divya Pillai", "Mohd Ridzuan", "Teoh Boon Tat",
    "Kavitha Raman", "Aizat bin Rosli", "Yap Chee Meng", "Shanti Muniandy", "Khairul Azman",
    "Wong Siew Foong", "Vijay Balakrishnan", "Haziq bin Razak", "Chan Wai Hong", "Pavithra Selvam"
  ];

  try {
    console.log("--- Starting 30 Stall Managers Seeding ---");
    const usersRef = db.collection('users');

    const saltRounds = 10;
    // Hash default password 'QWEqwe!@#123'
    const hashedPassword = await bcrypt.hash('QWEqwe!@#123', saltRounds);

    for (let i = 0; i < 30; i++) {
      const email = `manager${i + 1}@makanmate.com`;
      
      // Check if user already exists
      const snapshot = await usersRef.where('userEmail', '==', email).get();
      if (!snapshot.empty) {
        console.log(`Stall Manager already exists: ${email}`);
        continue;
      }

      // Generate random phone number digit-by-digit
      const randomPhoneSuffix = Math.floor(1000000 + Math.random() * 9000000);
      const phone = `+6012${randomPhoneSuffix}`;

      const newManager = {
        userName: managerNames[i],
        userEmail: email,
        userPassword: hashedPassword,
        userRole: "StallManager",
        userPhone: phone,
        accountStatus: 0,
        forcePasswordChange: true,
        lastLoginAt: null,
        preferenceID: "",
        createdAt: new Date().toISOString()
      };

      await usersRef.add(newManager);
      console.log(`Created Stall Manager: ${email} (${managerNames[i]})`);
    }

    console.log("--- Stall Managers Seeding Completed Successfully ---");
    process.exit(0);
  } catch (error) {
    console.error("--- Seeding Failed ---");
    console.error(error);
    process.exit(1);
  }
};

seedStallManagers();
