const express = require('express');
const { createUser, loginUser, checkUserIsActive, getUserInfo, exitSession, getAllUsers } = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/isActive', authenticateJWT, checkUserIsActive);
router.get('/userinfo', authenticateJWT, getUserInfo);
router.post('/exit', authenticateJWT, exitSession);
router.get('/users', authenticateJWT, getAllUsers);

module.exports = router;