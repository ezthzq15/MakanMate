const { db } = require('../config/firebase');

const getActiveChallenges = async (req, res) => {
  try {
    const snapshot = await db.collection('challenges')
      .where('isActive', '==', true)
      .get();
      
    const challenges = [];
    snapshot.forEach(doc => {
      challenges.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(challenges);
  } catch (error) {
    console.error('[Get Active Challenges Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const adminGetAllChallenges = async (req, res) => {
  try {
    const snapshot = await db.collection('challenges').get();
    
    const challenges = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      challenges.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });

    // Sort by createdAt desc
    challenges.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return res.status(200).json(challenges);
  } catch (error) {
    console.error('[Admin Get All Challenges Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const adminCreateChallenge = async (req, res) => {
  try {
    const { title, description, points } = req.body;

    if (!title || !description || !points) {
      return res.status(400).json({ error: 'Missing required challenge fields' });
    }

    const newChallenge = {
      title,
      description,
      points: parseInt(points) || 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('challenges').add(newChallenge);
    return res.status(201).json({ id: docRef.id, ...newChallenge });
  } catch (error) {
    console.error('[Admin Create Challenge Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminUpdateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points, isActive } = req.body;

    const challengeRef = db.collection('challenges').doc(id);
    const challengeDoc = await challengeRef.get();
    if (!challengeDoc.exists) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const updateData = {
      title,
      description,
      points: parseInt(points) || 0,
      isActive: isActive === true
    };

    await challengeRef.update(updateData);
    return res.status(200).json({ message: 'Challenge updated successfully' });
  } catch (error) {
    console.error('[Admin Update Challenge Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminDeleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challengeRef = db.collection('challenges').doc(id);
    const challengeDoc = await challengeRef.get();
    if (!challengeDoc.exists) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challengeRef.delete();
    return res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('[Admin Delete Challenge Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminGenerateRandomChallenge = async (req, res) => {
  try {
    const challengePool = [
      {
        title: "Tasty Tuesday Feast",
        description: "Explore any food stall on Tuesday to claim points",
        points: 40
      },
      {
        title: "Western Food Lover",
        description: "Redeem a voucher at any Western cuisine stall today",
        points: 50
      },
      {
        title: "Teh Tarik Time",
        description: "Indulge in any hot or iced beverage this afternoon",
        points: 20
      },
      {
        title: "Halal Food Adventurer",
        description: "Redeem any Halal certified voucher today",
        points: 60
      },
      {
        title: "Review Master Challenge",
        description: "Post a new review on any stall to help other foodies",
        points: 50
      },
      {
        title: "Mating Call",
        description: "Share any stall link with your friends today",
        points: 30
      },
      {
        title: "Local Dessert Fanatic",
        description: "Redeem a sweet treat or local dessert voucher",
        points: 40
      },
      {
        title: "Weekend Treat Bonus",
        description: "Claim your special weekend bonus points",
        points: 80
      },
      {
        title: "Daily Munchies",
        description: "Log in and check out any stall details page",
        points: 15
      }
    ];

    const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];

    const newChallenge = {
      ...randomChallenge,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('challenges').add(newChallenge);
    return res.status(201).json({ id: docRef.id, ...newChallenge });
  } catch (error) {
    console.error('[Admin Generate Random Challenge Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  getActiveChallenges,
  adminGetAllChallenges,
  adminCreateChallenge,
  adminUpdateChallenge,
  adminDeleteChallenge,
  adminGenerateRandomChallenge
};
