// seat-reserve-pro-backend/src/models/Event.ts

import mongoose, { Document, Schema } from 'mongoose';

// Interface for a single seat (simple availability tracking)
export interface ISeat {
    seatId: string;
    isBooked: boolean;
    bookedBy: mongoose.Types.ObjectId | null;
}


// Interface for the Event document
export interface IEvent extends Document {
    title: string;
    date: Date;
    venue: string;
    capacity: number;
    price: number;
    description: string;
    // seats array will be generated based on capacity
    seats: ISeat[]; 
    soldTickets: number;
    isActive: boolean;
}

const SeatSchema: Schema = new Schema({
    seatId: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

const EventSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    seats: [SeatSchema],
    soldTickets: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Pre-save hook to initialize seats array when a new event is created
EventSchema.pre<IEvent>('save', function (next) {
    if (this.isNew && this.capacity > 0 && this.seats.length === 0) {
        // Generate seat IDs (e.g., A1, A2, ...) based on capacity
        const newSeats: ISeat[] = [];
        for (let i = 1; i <= this.capacity; i++) {
            newSeats.push({
                seatId: `S${i}`,
                isBooked: false,
                bookedBy: null,
            } as ISeat);
        }
        this.seats = newSeats;
    }
    next();
});

const Event = mongoose.model<IEvent>('Event', EventSchema);
export default Event;