const express = require('express');
const { 
  changeProfileImage, 
  changePassword, 
  updateUserData, 
  updateSendNotifications, 
  disabledAccount 
} = require('../controllers/changedataController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/changeProfileImage', authenticateJWT, changeProfileImage);
router.post('/changePassword', authenticateJWT, changePassword);
router.post('/updateUserData', authenticateJWT, updateUserData);
router.post('/updateSendNotifications', authenticateJWT, updateSendNotifications);
router.post('/disabledAccount', authenticateJWT, disabledAccount);

module.exports = router;