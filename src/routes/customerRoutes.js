import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import roleAuthorise from '../middlewares/authoriseMiddleware.js'
import { createCustomerProfile, getMyCustomerProfile } from '../controllers/customerController.js'

const router = express.Router()

router.get('/me', authMiddleware, roleAuthorise("CUSTOMER"), getMyCustomerProfile)

router.post('/createProfile',authMiddleware, roleAuthorise("CUSTOMER"), createCustomerProfile)

export default router