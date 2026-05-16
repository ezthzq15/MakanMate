const express = require("express");
const router = express.Router();

const { getMyStall, updateMyStall, uploadHalalCert, uploadStallHeader, uploadMenuImage } = require('../controllers/stallManagementController');
const stallController = require('../controllers/stallController');
const { verifyToken, isStallManager, optionalVerifyToken } = require('../middlewares/auth');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Public Discovery
router.get('/search', optionalVerifyToken, stallController.searchStalls);

// Stall Manager Specific Routes
router.get('/my-stall', verifyToken, isStallManager, getMyStall);
router.put('/my-stall', verifyToken, isStallManager, updateMyStall);
router.post('/my-stall/halal-cert', verifyToken, isStallManager, upload.single('certificate'), uploadHalalCert);
router.post('/my-stall/header-image', verifyToken, isStallManager, upload.single('image'), uploadStallHeader);
router.post('/my-stall/menu-image', verifyToken, isStallManager, upload.single('image'), uploadMenuImage);

// Public Detail (Must be last to avoid collision)
router.get('/:id', optionalVerifyToken, stallController.getStallById);

module.exports = router;
