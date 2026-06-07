const { db, FieldValue } = require('../config/firebase');

// Utility to generate a random alphanumeric string for redemption code
const generateRedemptionCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * MANAGER: Create a new voucher
 */
const createVoucher = async (req, res) => {
  try {
    const { title, discountType, discountValue, minSpend, validUntil, quantity } = req.body;
    const userId = req.user.userID;

    // Get the stall ID of the manager
    const stallRef = await db.collection('FoodStalls').where('managerID', '==', userId).get();
    if (stallRef.empty) {
      return res.status(403).json({ error: 'Manager does not have an assigned stall' });
    }
    const stallId = stallRef.docs[0].id;

    const newVoucher = {
      stallID: stallId,
      title,
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: minSpend ? parseFloat(minSpend) : null,
      validUntil: new Date(validUntil).toISOString(),
      quantity: parseInt(quantity) || 0,
      redeemedCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      isActive: true
    };

    const docRef = await db.collection('vouchers').add(newVoucher);
    return res.status(201).json({ id: docRef.id, ...newVoucher });
  } catch (error) {
    console.error('[Create Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * MANAGER: Update a voucher
 */
const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, discountType, discountValue, minSpend, validUntil, quantity, isActive } = req.body;
    const userId = req.user.userID;

    // Verify manager owns this voucher's stall
    const stallRef = await db.collection('FoodStalls').where('managerID', '==', userId).get();
    if (stallRef.empty) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const stallId = stallRef.docs[0].id;

    const voucherRef = db.collection('vouchers').doc(id);
    const voucherDoc = await voucherRef.get();
    if (!voucherDoc.exists || voucherDoc.data().stallID !== stallId) {
      return res.status(403).json({ error: 'Unauthorized or voucher not found' });
    }

    await voucherRef.update({
      title,
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: minSpend ? parseFloat(minSpend) : null,
      validUntil: new Date(validUntil).toISOString(),
      quantity: parseInt(quantity) || 0,
      isActive
    });

    return res.status(200).json({ message: 'Voucher updated successfully' });
  } catch (error) {
    console.error('[Update Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * MANAGER: Delete a voucher
 */
const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userID;

    // Verify manager owns this voucher's stall
    const stallRef = await db.collection('FoodStalls').where('managerID', '==', userId).get();
    if (stallRef.empty) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const stallId = stallRef.docs[0].id;

    const voucherRef = db.collection('vouchers').doc(id);
    const voucherDoc = await voucherRef.get();
    if (!voucherDoc.exists || voucherDoc.data().stallID !== stallId) {
      return res.status(403).json({ error: 'Unauthorized or voucher not found' });
    }

    await voucherRef.delete();

    return res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('[Delete Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * MANAGER/USER: Get active vouchers for a stall
 */
const getStallVouchers = async (req, res) => {
  try {
    const { stallId } = req.params;
    const [specificSnapshot, generalSnapshot] = await Promise.all([
      db.collection('vouchers')
        .where('stallID', '==', stallId)
        .where('isActive', '==', true)
        .get(),
      db.collection('vouchers')
        .where('stallID', '==', 'general')
        .where('isActive', '==', true)
        .get()
    ]);
      
    const vouchers = [];
    specificSnapshot.forEach(doc => {
      vouchers.push({ id: doc.id, ...doc.data() });
    });
    generalSnapshot.forEach(doc => {
      vouchers.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(vouchers);
  } catch (error) {
    console.error('[Get Vouchers Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * MANAGER: Get all vouchers for their stall (for management)
 */
const getManagerVouchers = async (req, res) => {
  try {
    const userId = req.user.userID;
    const stallRef = await db.collection('FoodStalls').where('managerID', '==', userId).get();
    if (stallRef.empty) {
      return res.status(403).json({ error: 'Manager does not have an assigned stall' });
    }
    const stallId = stallRef.docs[0].id;

    const vouchersSnapshot = await db.collection('vouchers')
      .where('stallID', '==', stallId)
      .get();
      
    const vouchers = [];
    vouchersSnapshot.forEach(doc => {
      vouchers.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(vouchers);
  } catch (error) {
    console.error('[Get Manager Vouchers Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * USER: Request check-in for a voucher
 */
const requestCheckIn = async (req, res) => {
  try {
    const { voucherId, stallId } = req.body;
    const userId = req.user.userID;

    // Check if voucher exists and is active
    const voucherDoc = await db.collection('vouchers').doc(voucherId).get();
    if (!voucherDoc.exists || !voucherDoc.data().isActive) {
      return res.status(404).json({ error: 'Voucher not available' });
    }
    
    const voucherData = voucherDoc.data();
    let targetStallId = voucherData.stallID;
    if (targetStallId === 'general') {
      if (!stallId) {
        return res.status(400).json({ error: 'stallId is required to redeem a general voucher' });
      }
      targetStallId = stallId;
    }

    // Create check-in request
    const checkIn = {
      userId,
      voucherId,
      stallId: targetStallId,
      status: 'pending', // pending, approved, redeemed, expired
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('checkIns').add(checkIn);
    return res.status(201).json({ checkInId: docRef.id, status: 'pending' });
  } catch (error) {
    console.error('[Check In Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * MANAGER: Get pending check-ins
 */
const getPendingCheckIns = async (req, res) => {
  try {
    const userId = req.user.userID;
    const stallRef = await db.collection('FoodStalls').where('managerID', '==', userId).get();
    if (stallRef.empty) {
      return res.status(403).json({ error: 'Manager does not have an assigned stall' });
    }
    const stallId = stallRef.docs[0].id;

    const checkInsSnapshot = await db.collection('checkIns')
      .where('stallId', '==', stallId)
      .where('status', '==', 'pending')
      .get();
      
    const checkIns = [];
    checkInsSnapshot.forEach(doc => {
      checkIns.push({ id: doc.id, ...doc.data() });
    });

    // We might want to attach user names here if needed, skipping for brevity

    return res.status(200).json(checkIns);
  } catch (error) {
    console.error('[Get Pending Check-ins Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * MANAGER: Approve check-in
 */
const approveCheckIn = async (req, res) => {
  try {
    const { checkInId } = req.params;
    
    const code = generateRedemptionCode();
    // 15 mins expiry
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await db.collection('checkIns').doc(checkInId).update({
      status: 'approved',
      redemptionCode: code,
      expiresAt: expiresAt,
      approvedAt: FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Check-in approved' });
  } catch (error) {
    console.error('[Approve Check-in Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * USER: Poll check-in status
 */
const checkInStatus = async (req, res) => {
  try {
    const { checkInId } = req.params;
    const userId = req.user.userID;

    const checkInDoc = await db.collection('checkIns').doc(checkInId).get();
    if (!checkInDoc.exists) {
      return res.status(404).json({ error: 'Check-in not found' });
    }
    
    if (checkInDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(checkInDoc.data());
  } catch (error) {
    console.error('[Check Status Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * USER: Get my check-ins (Recently Visited)
 */
const getMyCheckIns = async (req, res) => {
  try {
    const userId = req.user.userID;
    const snapshot = await db.collection('checkIns')
      .where('userId', '==', userId)
      .get();

    const checkInsList = [];
    snapshot.forEach(doc => checkInsList.push({ id: doc.id, ...doc.data() }));
    
    console.log(`[getMyCheckIns] Found ${checkInsList.length} check-ins for user ${userId}`);
    
    // Sort in memory by createdAt desc (handling Firestore Timestamp)
    checkInsList.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    
    // Filter duplicates by stallId (so we don't show the same stall twice)
    const uniqueCheckIns = [];
    const seenStallIds = new Set();
    
    for (const item of checkInsList) {
      if (!seenStallIds.has(item.stallId)) {
        seenStallIds.add(item.stallId);
        uniqueCheckIns.push(item);
      }
    }
    
    // Take top 5 unique visits
    const limited = uniqueCheckIns.slice(0, 5);

    const checkIns = await Promise.all(limited.map(async data => {
      // Fetch stall details
      const stallDoc = await db.collection('FoodStalls').doc(data.stallId).get();
      const stallData = stallDoc.exists ? stallDoc.data() : null;
      
      return {
        id: data.id,
        stallId: data.stallId,
        stallName: stallData ? stallData.stallName : 'Unknown Stall',
        imageURL: stallData ? stallData.imageURL : null,
        cuisineType: stallData ? stallData.cuisineType : 'Malay',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        status: data.status
      };
    }));

    return res.status(200).json(checkIns);
  } catch (error) {
    console.error('[Get My CheckIns Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * MANAGER: Redeem voucher (verify code)
 */
const redeemVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    
    // Find the approved check-in with this code
    const checkInSnapshot = await db.collection('checkIns')
      .where('redemptionCode', '==', code)
      .where('status', '==', 'approved')
      .get();
      
    if (checkInSnapshot.empty) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    
    const checkInDoc = checkInSnapshot.docs[0];
    const data = checkInDoc.data();
    
    if (new Date() > new Date(data.expiresAt)) {
      await db.collection('checkIns').doc(checkInDoc.id).update({ status: 'expired' });
      return res.status(400).json({ error: 'Code has expired' });
    }
    
    // Mark as redeemed
    await db.collection('checkIns').doc(checkInDoc.id).update({
      status: 'redeemed',
      redeemedAt: FieldValue.serverTimestamp()
    });
    
    // Increment voucher redeemed count
    await db.collection('vouchers').doc(data.voucherId).update({
      redeemedCount: FieldValue.increment(1)
    });

    // Award 50 loyalty points to user
    await db.collection('users').doc(data.userId).update({
      loyaltyPoints: FieldValue.increment(50)
    });

    // Log the loyalty transaction
    await db.collection('loyaltyTransactions').add({
      userId: data.userId,
      points: 50,
      type: 'voucher_redeem',
      voucherId: data.voucherId,
      stallId: data.stallId,
      description: 'Reward: Voucher Redemption Check-in',
      createdAt: FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Voucher redeemed successfully' });
  } catch (error) {
    console.error('[Redeem Voucher Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const adminGetAllVouchers = async (req, res) => {
  try {
    const vouchersSnapshot = await db.collection('vouchers').get();
    const stallsSnapshot = await db.collection('FoodStalls').get();
    
    const stallsMap = {};
    stallsSnapshot.forEach(doc => {
      stallsMap[doc.id] = doc.data().stallName;
    });

    const vouchers = [];
    vouchersSnapshot.forEach(doc => {
      const data = doc.data();
      vouchers.push({
        id: doc.id,
        ...data,
        stallName: data.stallID === 'general' ? 'General Voucher' : (stallsMap[data.stallID] || 'Unknown Stall'),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });

    // Sort by createdAt desc
    vouchers.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return res.status(200).json(vouchers);
  } catch (error) {
    console.error('[Admin Get All Vouchers Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const adminCreateVoucher = async (req, res) => {
  try {
    const { stallID, title, discountType, discountValue, minSpend, validUntil, quantity } = req.body;

    if (!stallID || !title || !discountType || !discountValue || !validUntil || !quantity) {
      return res.status(400).json({ error: 'Missing required voucher fields' });
    }

    const newVoucher = {
      stallID,
      title,
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: minSpend ? parseFloat(minSpend) : null,
      validUntil: new Date(validUntil).toISOString(),
      quantity: parseInt(quantity) || 0,
      redeemedCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      isActive: true
    };

    const docRef = await db.collection('vouchers').add(newVoucher);
    
    // Fetch stall name for response
    const stallDoc = await db.collection('FoodStalls').doc(stallID).get();
    const stallName = stallDoc.exists ? stallDoc.data().stallName : 'Unknown Stall';

    return res.status(201).json({
      id: docRef.id,
      ...newVoucher,
      stallName,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Admin Create Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminUpdateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { stallID, title, discountType, discountValue, minSpend, validUntil, quantity, isActive } = req.body;

    const voucherRef = db.collection('vouchers').doc(id);
    const voucherDoc = await voucherRef.get();
    if (!voucherDoc.exists) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    const updateData = {
      title,
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: minSpend ? parseFloat(minSpend) : null,
      validUntil: new Date(validUntil).toISOString(),
      quantity: parseInt(quantity) || 0,
      isActive: isActive === true
    };

    if (stallID) {
      updateData.stallID = stallID;
    }

    await voucherRef.update(updateData);
    return res.status(200).json({ message: 'Voucher updated successfully' });
  } catch (error) {
    console.error('[Admin Update Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminDeleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucherRef = db.collection('vouchers').doc(id);
    const voucherDoc = await voucherRef.get();
    if (!voucherDoc.exists) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    await voucherRef.delete();
    return res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('[Admin Delete Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const adminGenerateRandomVoucher = async (req, res) => {
  try {
    const stallsSnapshot = await db.collection('FoodStalls').get();
    
    // 30% chance of generating a general voucher, otherwise specific (if stalls exist)
    const isGeneral = Math.random() < 0.3 || stallsSnapshot.empty;
    
    let targetStallID = 'general';
    let targetStallName = 'General Voucher';
    
    if (!isGeneral) {
      const stalls = stallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const randomStall = stalls[Math.floor(Math.random() * stalls.length)];
      targetStallID = randomStall.id;
      targetStallName = randomStall.stallName;
    }

    const discountTypes = ['Percentage', 'Fixed Amount'];
    const discountType = discountTypes[Math.floor(Math.random() * discountTypes.length)];
    
    let discountValue = 10;
    if (discountType === 'Percentage') {
      const pctOptions = [5, 10, 15, 20, 25, 30];
      discountValue = pctOptions[Math.floor(Math.random() * pctOptions.length)];
    } else {
      const fixedOptions = [2, 3, 5, 8, 10];
      discountValue = fixedOptions[Math.floor(Math.random() * fixedOptions.length)];
    }

    const minSpendOptions = [10, 15, 20, 25, 30, 45, 50];
    const minSpend = minSpendOptions[Math.floor(Math.random() * minSpendOptions.length)];

    const qtyOptions = [50, 100, 150, 200, 250, 300];
    const quantity = qtyOptions[Math.floor(Math.random() * qtyOptions.length)];

    const daysOptions = [7, 10, 14, 20, 30];
    const daysFuture = daysOptions[Math.floor(Math.random() * daysOptions.length)];
    const validUntil = new Date(Date.now() + daysFuture * 24 * 60 * 60 * 1000).toISOString();

    const voucherTitles = [
      `Special Promo`,
      `Exclusive Feast`,
      `Signature Discount`,
      `Super Saver`,
      `Weekday Special`,
      `Weekend Treat`
    ];
    const selectedTitle = voucherTitles[Math.floor(Math.random() * voucherTitles.length)];
    const title = targetStallID === 'general' ? `MakanMate ${selectedTitle}` : `${targetStallName} ${selectedTitle}`;

    const newVoucher = {
      stallID: targetStallID,
      title,
      discountType,
      discountValue,
      minSpend,
      validUntil,
      quantity,
      redeemedCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      isActive: true
    };

    const docRef = await db.collection('vouchers').add(newVoucher);
    
    return res.status(201).json({
      id: docRef.id,
      ...newVoucher,
      stallName: targetStallName,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Admin Generate Random Voucher Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getStallVouchers,
  getManagerVouchers,
  requestCheckIn,
  getPendingCheckIns,
  approveCheckIn,
  checkInStatus,
  redeemVoucher,
  getMyCheckIns,
  adminGetAllVouchers,
  adminCreateVoucher,
  adminUpdateVoucher,
  adminDeleteVoucher,
  adminGenerateRandomVoucher
};
