// seat-reserve-pro-backend/src/routes/eventRoutes.ts

import express from 'express';
import { 
    createEvent, 
    getEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent 
} from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware'; // For logged-in users
import { admin } from '../middleware/adminMiddleware'; // For admin users

const router = express.Router();

// Public Routes (Accessible by anyone)
router.get('/', getEvents);       // Get list of active events
router.get('/:id', getEventById); // Get event details (including seats)

// Admin Routes (Protected by both 'protect' and 'admin' middleware)
// Event management requires admin permissions
router.post('/', protect, admin, createEvent);      // Create new event
router.put('/:id', protect, admin, updateEvent);    // Update event
router.delete('/:id', protect, admin, deleteEvent); // Deactivate/Delete event

export default router;