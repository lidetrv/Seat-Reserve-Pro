// seat-reserve-pro-backend/src/controllers/eventController.ts

import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import { ISeat } from '../models/Event'; // For seat initialization

// @route POST /api/events (Admin Only)
// @desc Create a new event
// @access Private (Admin)
export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, date, venue, capacity, price, description } = req.body;

        // Basic validation
        if (!title || !date || !venue || !capacity || !price || !description) {
            res.status(400).json({ message: 'Please fill all required fields.' });
            return;
        }

        // Mongoose pre-save hook handles seat initialization
        const event: IEvent = await Event.create({
            title,
            date,
            venue,
            capacity,
            price,
            description,
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event', error });
    }
};

// @route GET /api/events (Public/Attendee View)
// @desc Get all active events
// @access Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch only active events, sorted by date
        const events = await Event.find({ isActive: true }).select('-seats'); // Exclude detailed seat data for list view
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error });
    }
};

// @route GET /api/events/:id (Public/Attendee View)
// @desc Get single event with seat availability
// @access Public
export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findById(req.params.id).select('+seats'); // Include seats for booking page
        
        if (!event || !event.isActive) {
            res.status(404).json({ message: 'Event not found or inactive.' });
            return;
        }
        
        // Return event details including the seats array
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event details', error });
    }
};

// @route PUT /api/events/:id (Admin Only)
// @desc Update event details
// @access Private (Admin)
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update event', error });
    }
};

// @route DELETE /api/events/:id (Admin Only)
// @desc Deactivate/Delete event
// @access Private (Admin)
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }

        // Instead of hard deleting, we mark it as inactive
        event.isActive = false;
        await event.save();
        
        res.status(200).json({ message: 'Event marked as inactive (deleted).' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event', error });
    }
};