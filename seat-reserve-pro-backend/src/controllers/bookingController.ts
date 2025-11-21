// seat-reserve-pro-backend/src/controllers/bookingController.ts

import { Request, Response } from 'express';
import Booking, { IBooking, IBookedSeat } from '../models/Booking';
import Event, { IEvent } from '../models/Event';
import { IUser } from '../models/User';

// Extend the Request object to include the authenticated user
interface BookingRequest extends Request {
    user?: IUser;
}

// --- SIMULATION HELPERS ---

// Simulates a payment gateway response
const runPaymentSimulation = (amount: number): { success: boolean, id: string } => {
    // 90% success rate simulation
    const success = Math.random() < 0.9;
    return {
        success,
        id: success ? `PAY-${Date.now()}` : `FAIL-${Date.now()}`,
    };
};

// Simulates sending an email confirmation
const sendEmailConfirmation = (booking: IBooking): boolean => {
    console.log(`[EMAIL SIMULATION] Sending ticket confirmation to user ${booking.user} for booking ${booking._id}`);
    return true; 
};

// --- CONTROLLER FUNCTIONS ---

// @route POST /api/bookings/reserve
// @desc Reserve selected seats and run payment simulation
// @access Private (Attendees)
export const reserveSeatsAndPay = async (req: BookingRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    const { eventId, selectedSeatIds } = req.body;
    const userId = req.user._id;
    
    // --- 1. Find Event and Check Availability ---
    const event = await Event.findById(eventId);

    if (!event || !event.isActive) {
        res.status(404).json({ message: 'Event not found or inactive.' });
        return;
    }

    const seatsToBook = event.seats.filter(s => selectedSeatIds.includes(s.seatId));
    
    // Check if seats are valid and available
    const unavailableSeat = seatsToBook.find(s => s.isBooked);
    if (seatsToBook.length !== selectedSeatIds.length || unavailableSeat) {
        res.status(400).json({ message: `One or more seats are unavailable or invalid. Seat: ${unavailableSeat?.seatId}` });
        return;
    }

    // --- 2. Calculate Total and Prepare Booking Data ---
    const totalAmount = event.price * selectedSeatIds.length;
    
    const bookedSeatsData: IBookedSeat[] = seatsToBook.map(seat => ({
        seatId: seat.seatId,
        price: event.price,
    }));

    // --- 3. Run Payment Simulation ---
    const paymentResult = runPaymentSimulation(totalAmount);
    const paymentStatus = paymentResult.success ? 'completed' : 'failed';

    let booking: IBooking;
    
    try {
        // --- 4. Create Booking Document ---
        booking = await Booking.create({
            user: userId,
            event: eventId,
            seats: bookedSeatsData,
            totalAmount: totalAmount,
            paymentStatus: paymentStatus,
            paymentSimulationId: paymentResult.id,
        });

        if (paymentResult.success) {
            // --- 5. Finalize: Update Event Seats and Send Email ---
            
            // Mark seats as booked in the Event document
            event.seats = event.seats.map(seat => {
                if (selectedSeatIds.includes(seat.seatId)) {
                    seat.isBooked = true;
                    seat.bookedBy = userId;
                }
                return seat;
            });
            event.soldTickets += selectedSeatIds.length;
            await event.save();
            
            // Send email confirmation
            const emailSuccess = sendEmailConfirmation(booking);
            if (emailSuccess) {
                booking.emailSent = true;
                await booking.save();
            }

            res.status(200).json({ 
                success: true, 
                message: 'Booking completed and confirmed.', 
                booking, 
                eventDetails: { title: event.title } 
            });
        } else {
            // Payment Failed - booking document exists but is 'failed'
            res.status(402).json({ 
                success: false, 
                message: 'Payment simulation failed. Please try again.', 
                booking 
            });
        }

    } catch (error) {
        // This catches database/server errors
        res.status(500).json({ message: 'Server error during booking process.' });
    }
};

// @route GET /api/bookings/mybookings
// @desc Get user's confirmed bookings
// @access Private (Attendees)
export const getMyBookings = async (req: BookingRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    
    try {
        const bookings = await Booking.find({ 
            user: req.user._id, 
            paymentStatus: 'completed' 
        })
        .populate('event', 'title date venue'); // Populate event details

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings.' });
    }
};