import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './redux/roomSlice'

const store = configureStore({
    reducer: {
      room: roomReducer,
    },
  });
  
  export default store;