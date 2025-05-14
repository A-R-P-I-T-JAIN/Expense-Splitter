import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
// const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_BASE_URL = 'https://expense-splitter.onrender.com/api/v1';

// Reusable Axios config
const jsonConfig = { headers: { 'Content-Type': 'application/json' } };

// Helper function to create POST thunks
const createPostThunk = (name, endpoint) => createAsyncThunk(
  name,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, payload, jsonConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Helper function to create GET thunks
const createGetThunk = (name, endpoint) => createAsyncThunk(
  name,
  async ({ roomId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunks
export const createRoom = createPostThunk('room/createRoom', 'createroom');
export const joinRoom = createPostThunk('room/joinRoom', 'joinroom');
export const addMember = createPostThunk('member/addMember', 'addmember');
export const isRoom = createPostThunk('room/isRoom', 'isRoom');
export const fetchMembers = createGetThunk('members/fetchMembers', 'members');
export const fetchHost = createGetThunk('host/fetchHost', 'host');
export const fetchRoomName = createGetThunk('roomName/fetchRoomName', 'roomname');
export const fetchMessages = createGetThunk('messages/fetchMessages', 'messages');
export const fetchPayments = createGetThunk('payments/fetchPayments', 'payments');

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    members: [],
    host: '',
    messages: [],
    isLoading: false,
    payments: [],
    roomName: '',
    isRoom: false,
    error: null,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper to handle common reducer cases
    const addAsyncCases = (thunk, fulfilledHandler) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isLoading = false;
          fulfilledHandler(state, action);
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        });
    };

    // Define fulfilled handlers
    addAsyncCases(createRoom, () => console.log('room created'));
    addAsyncCases(joinRoom, () => console.log('room joined'));
    addAsyncCases(fetchMembers, (state, action) => {
      state.members = action.payload.members || [];
    });
    addAsyncCases(fetchHost, (state, action) => {
      state.host = action.payload.host || '';
    });
    addAsyncCases(fetchRoomName, (state, action) => {
      state.roomName = action.payload.roomName || '';
    });
    addAsyncCases(fetchMessages, (state, action) => {
      state.messages = action.payload.messages || [];
    });
    addAsyncCases(fetchPayments, (state, action) => {
      state.payments = action.payload.payments || [];
    });
    addAsyncCases(isRoom, (state, action) => {
      state.isRoom = action.payload.isRoom || false;
    });
    addAsyncCases(addMember, () => {});
  },
});

export const { setError, clearError } = roomSlice.actions;
export default roomSlice.reducer;