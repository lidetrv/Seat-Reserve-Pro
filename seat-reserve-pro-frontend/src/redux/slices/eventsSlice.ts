// seat-reserve-pro-frontend/src/redux/slices/eventsSlice.ts

import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Event } from '../../types/Event';
import type { RootState } from '../store';

// Define the state structure
interface EventsState {
    events: Event[];
    selectedEvent: Event | null;
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: EventsState = {
    events: [],
    selectedEvent: null,
    isLoading: false,
    isError: false,
    message: '',
};

const API_URL = '/api/events';

// Helper function to get the auth header (required for Admin actions)
const getConfig = (getState: () => RootState) => {
    const token = getState().auth.user?.token;
    if (!token) return {};
    
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// --- Async Thunks for Admin Actions (Protected) ---

// Create Event
export const createEvent = createAsyncThunk(
    'events/create',
    async (eventData: Omit<Event, '_id'>, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI.getState as () => RootState);
            const response = await axios.post(API_URL, eventData, config);
            return response.data as Event;
        } catch (error) {
            let message = 'Failed to create event.';
            if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Event
export const updateEvent = createAsyncThunk(
    'events/update',
    async (eventData: Event, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI.getState as () => RootState);
            const response = await axios.put(`${API_URL}/${eventData._id}`, eventData, config);
            return response.data as Event;
        } catch (error) {
            let message = 'Failed to update event.';
            if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete/Deactivate Event
export const deleteEvent = createAsyncThunk(
    'events/delete',
    async (id: string, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI.getState as () => RootState);
            await axios.delete(`${API_URL}/${id}`, config);
            return id; // Return the ID of the deleted event
        } catch (error) {
            let message = 'Failed to delete event.';
            if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Async Thunks for Public Actions (Read) ---

// Fetch All Events (Public/Attendee List)
export const fetchEvents = createAsyncThunk(
    'events/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(API_URL);
            return response.data as Event[];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const message = 'Failed to fetch events.';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        reset: () => initialState,
        setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
            state.selectedEvent = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Events
            .addCase(fetchEvents.pending, (state) => { state.isLoading = true; })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // Create Event
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload); // Add new event to list
            })
            // Update Event
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload; // Replace updated event
                }
                state.selectedEvent = action.payload; // Update selected if it was being edited
            })
            // Delete Event
            .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
                state.events = state.events.filter(event => event._id !== action.payload);
                if (state.selectedEvent?._id === action.payload) {
                    state.selectedEvent = null;
                }
            })
            // Add pending/rejected cases for admin thunks here for full error handling
    },
});

export const { reset, setSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;