import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { User } from '../../types/User';
import { API_BASE_URL } from '../../config/api';

// Define complete types for auth data (completely separate from User)
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Define a type for the slice state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

// Initial state: try to load user from localStorage
const storedUser = localStorage.getItem('user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isLoading: false,
  isError: false,
  message: '',
};

const API_URL = `${API_BASE_URL}/auth`;

// --- ASYNC THUNKS ---

// 1. Async Thunk for User Registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + '/register', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data as User;
    } catch (error) {
      let message = 'Registration failed';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        message = error.response.data.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. Async Thunk for User Login
export const login = createAsyncThunk(
  'auth/login',
  async (userData: LoginData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + '/login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data as User;
    } catch (error) {
      let message = 'Login failed';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        message = error.response.data.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. Async Thunk for Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Register Handlers ---
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // --- Login Handlers ---
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // --- Logout Handler ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;