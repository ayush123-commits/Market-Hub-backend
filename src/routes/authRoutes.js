import express from 'express';
import { registerUser, loginUser, logoutUser, sendVerification, emailVerification, sendPasswordVerification, userPasswordUpdate } from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-verification', authMiddleware ,sendVerification)
router.post('/verify-email',authMiddleware , emailVerification );
router.post('/send-password-verification' ,sendPasswordVerification)
router.post('/update-password',userPasswordUpdate)


router.get("/test", authMiddleware, (req, res) => {
  return res.json({
    success: true,
    userId: req.userId,
    role: req.role
  });
});

export default router;