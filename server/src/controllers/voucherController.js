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
 * MANAGER/USER: Get active vouchers for a stall
 */
const getStallVouchers = async (req, res) => {
  try {
    const { stallId } = req.params;
    const vouchersSnapshot = await db.collection('vouchers')
      .where('stallID', '==', stallId)
      .where('isActive', '==', true)
      .get();
      
    const vouchers = [];
    vouchersSnapshot.forEach(doc => {
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
    const { voucherId } = req.body;
    const userId = req.user.userID;

    // Check if voucher exists and is active
    const voucherDoc = await db.collection('vouchers').doc(voucherId).get();
    if (!voucherDoc.exists || !voucherDoc.data().isActive) {
      return res.status(404).json({ error: 'Voucher not available' });
    }
    
    const stallId = voucherDoc.data().stallID;

    // Create check-in request
    const checkIn = {
      userId,
      voucherId,
      stallId,
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

    return res.status(200).json({ message: 'Voucher redeemed successfully' });
  } catch (error) {
    console.error('[Redeem Voucher Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createVoucher,
  updateVoucher,
  getStallVouchers,
  getManagerVouchers,
  requestCheckIn,
  getPendingCheckIns,
  approveCheckIn,
  checkInStatus,
  redeemVoucher
};
