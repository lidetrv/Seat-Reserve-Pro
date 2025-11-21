// seat-reserve-pro-backend/src/models/Booking.ts

import mongoose, { Document, Schema } from 'mongoose';

// Interface for a single booked seat reference
export interface IBookedSeat {
    seatId: string;
    price: number;
}

// Interface for the Booking document
export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    seats: IBookedSeat[];
    totalAmount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentSimulationId: string; // ID from our simulated payment processor
    emailSent: boolean;
}

const BookedSeatSchema: Schema = new Schema({
    seatId: { type: String, required: true },
    price: { type: Number, required: true },
});

const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: [BookedSeatSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentSimulationId: { type: String },
    emailSent: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;