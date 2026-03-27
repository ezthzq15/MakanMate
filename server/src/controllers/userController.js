const { db } = require('../config/firebase');

const getProfile = async (req, res) => {
    try {
        // req.user is attached by verifyToken middleware
        const userRef = db.collection('users').doc(req.user.id);
        const doc = await userRef.get();

        if (!doc.exists) return res.status(404).json({ error: 'User profile not found' });
        
        const data = doc.data();
        return res.status(200).json({
            id: doc.id,
            name: data.name,
            email: data.email,
            role: data.role || 'user',
            createdAt: data.createdAt
        });
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        return res.status(500).json({ error: 'Internal server error fetching profile' });
    }
};

module.exports = { getProfile };