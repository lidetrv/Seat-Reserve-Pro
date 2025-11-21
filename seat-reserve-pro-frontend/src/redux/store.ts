// seat-reserve-pro-frontend/src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice'; // <-- Ensure this is imported
import bookingReducer from './slices/bookingSlice'; // <-- Ensure this is imported

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer, // <-- ADDED
    booking: bookingReducer, // <-- ADDED
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;