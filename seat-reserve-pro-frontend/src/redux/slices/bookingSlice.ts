// seat-reserve-pro-frontend/src/redux/slices/bookingSlice.ts

// seat-reserve-pro-frontend/src/redux/slices/bookingSlice.ts (Updated Imports)

// Line 3
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // FIX 1A: Use type import for PayloadAction
import axios from 'axios';
// Line 5
import type { RootState } from '../store'; // FIX 1B: Use type import for RootState
// (You may need to add 'type' to AppDispatch as well if it's not used as a value)

// Define state structure
interface BookingState {
    selectedSeatIds: string[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
    bookingResult: unknown | null; // Store the successful booking or failed attempt details
}

const initialState: BookingState = {
    selectedSeatIds: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    bookingResult: null,
};

const API_URL = '/api/bookings';

// Helper function to get the auth header
const getConfig = (getState: () => RootState) => {
    const token = getState().auth.user?.token;
    if (!token) return {};
    
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
};

// Async Thunk for reserving seats and payment
export const finalizeBooking = createAsyncThunk(
    'booking/finalize',
    async ({ eventId, selectedSeatIds }: { eventId: string, selectedSeatIds: string[] }, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI.getState as () => RootState);
            const response = await axios.post(`${API_URL}/reserve`, { eventId, selectedSeatIds }, config);
            
            // The backend returns a complex success/failure object
            return response.data; 
        } catch (error) {
            let message = 'Reservation failed due to server error.';
            let data = null;

            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data.message || message;
                data = error.response.data;
            }
            // Pass both the message and the data for detailed error handling
            return thunkAPI.rejectWithValue({ message, data });
        }
    }
);


export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetBooking: () => initialState,
        toggleSeatSelection: (state, action: PayloadAction<string>) => {
            const seatId = action.payload;
            if (state.selectedSeatIds.includes(seatId)) {
                // Deselect seat
                state.selectedSeatIds = state.selectedSeatIds.filter(id => id !== seatId);
            } else {
                // Select seat
                state.selectedSeatIds.push(seatId);
            }
        },
        clearSeats: (state) => {
            state.selectedSeatIds = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(finalizeBooking.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.bookingResult = null;
            })
            .addCase(finalizeBooking.fulfilled, (state, action: PayloadAction<unknown>) => {
                state.isLoading = false;
                const payload = action.payload as { success: boolean; message: string };
                state.isSuccess = payload.success;
                state.isError = !payload.success;
                state.bookingResult = action.payload;
                state.message = payload.message;
                state.selectedSeatIds = []; // Clear seats on successful attempt
            })
            .addCase(finalizeBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                const payload = action.payload as { message: string, data: unknown };
                state.message = payload.message;
                state.bookingResult = payload.data;
            });
    },
});

export const { resetBooking, toggleSeatSelection, clearSeats } = bookingSlice.actions;
export default bookingSlice.reducer;