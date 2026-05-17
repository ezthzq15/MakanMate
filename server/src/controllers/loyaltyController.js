const { db, FieldValue } = require('../config/firebase');

const getPointsData = async (req, res) => {
  try {
    const userId = req.user.userID;
    
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    
    const loyaltyPoints = userDoc.data().loyaltyPoints || 0;
    
    // Get transactions (Removed orderBy to avoid Firestore composite index requirement)
    const snapshot = await db.collection('loyaltyTransactions')
      .where('userId', '==', userId)
      .get();
      
    let transactions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      transactions.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt 
      });
    });

    // Sort transactions descending by createdAt
    transactions.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // Limit to 50
    transactions = transactions.slice(0, 50);
    
    return res.status(200).json({ loyaltyPoints, transactions });
  } catch (error) {
    console.error('getPointsData error:', error);
    return res.status(500).json({ error: 'Failed to get points data' });
  }
};

const claimChallenge = async (req, res) => {
  try {
    const userId = req.user.userID;
    const { challengeId } = req.body;
    
    let pointsAwarded = 0;
    let description = '';
    
    if (challengeId === 'profile_complete') {
      pointsAwarded = 100;
      description = 'Reward: Complete Profile';
    } else {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }
    
    // Check if already claimed
    const snapshot = await db.collection('loyaltyTransactions')
      .where('userId', '==', userId)
      .where('type', '==', 'challenge')
      .where('challengeId', '==', challengeId)
      .get();
      
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'Challenge already claimed' });
    }
    
    // Check actual condition if it's profile_complete
    if (challengeId === 'profile_complete') {
      const userDoc = await db.collection('users').doc(userId).get();
      const data = userDoc.data();
      // Assume preferenceID, address, and profilePic make a complete profile
      if (!data.profilePic || !data.address) {
        return res.status(400).json({ error: 'Profile is not fully complete. Please ensure you have a profile picture and address.' });
      }
    }
    
    // Award points
    await db.collection('users').doc(userId).update({
      loyaltyPoints: FieldValue.increment(pointsAwarded)
    });
    
    // Log transaction
    await db.collection('loyaltyTransactions').add({
      userId,
      points: pointsAwarded,
      type: 'challenge',
      challengeId,
      description,
      createdAt: FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ message: 'Challenge claimed successfully', pointsAwarded });
  } catch (error) {
    console.error('claimChallenge error:', error);
    return res.status(500).json({ error: 'Failed to claim challenge' });
  }
};

module.exports = {
  getPointsData,
  claimChallenge
};
