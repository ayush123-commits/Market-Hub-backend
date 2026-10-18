import express from 'express';
import { registerUser, loginUser, logoutUser, sendVerification, emailVerification, sendPasswordVerification, userPasswordUpdate } from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadProductPhotos } from '../middlewares/multer/productUpload.js';

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

router.post("/test",uploadProductPhotos,
  (req, res) => {
    console.log("Text fields:", req.body);

    console.log(
      "Saved files:",
      req.files.map((file) => ({
        filename: file.filename,
        path: file.path,
        size: file.size,
      }))
    );

    return res.status(201).json({
      message: "Disk upload successful",
      fields: req.body,
      files: req.files.map((file) => ({
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
        path: file.path,
      })),
    });
  }
);

export default router;