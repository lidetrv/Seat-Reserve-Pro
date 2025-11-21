// seat-reserve-pro-backend/src/routes/bookingRoutes.ts

import express from 'express';
import { reserveSeatsAndPay, getMyBookings } from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

// Route to handle seat selection, payment simulation, and final booking
router.post('/reserve', protect, reserveSeatsAndPay);

// Route to get a list of the authenticated user's bookings
router.get('/mybookings', protect, getMyBookings);

export default router;