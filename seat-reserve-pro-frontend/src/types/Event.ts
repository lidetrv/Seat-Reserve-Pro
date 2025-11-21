// seat-reserve-pro-frontend/src/types/Event.ts

/**
 * Interface for a single seat in the frontend context.
 * We use string for IDs here, as Mongoose ObjectId is usually
 * converted to a string when sent over the API.
 */
export interface Seat {
    // The unique ID of the seat object in the database
    _id: string; 
    // The descriptive ID (e.g., "S1", "B5")
    seatId: string;
    isBooked: boolean;
    // The user ID who booked it (string format from API)
    bookedBy: string | null; 
}

/**
 * Interface for the Event document used throughout the frontend.
 * It mirrors the backend IEvent, but uses simple JS types (like string for Date and IDs).
 */
export interface Event {
    // MongoDB unique identifier
    _id: string; 
    title: string;
    // We use string here because the API sends dates as ISO 8601 strings
    date: string; 
    venue: string;
    capacity: number;
    price: number;
    description: string;
    seats: Seat[]; 
    soldTickets?: number;
    isActive: boolean;
    // Mongoose timestamps, typically available as strings
    createdAt?: string; 
    updatedAt?: string;
}