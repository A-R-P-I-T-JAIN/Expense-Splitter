import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createRoom = createAsyncThunk('room/createRoom',async({roomId,roomName,userName}) => {
   
  
    let link = `https://expense-splitter.onrender.com/api/v1/createroom`

    const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post(link,{roomId,roomName,userName},config);

    return response.data;
});

export const joinRoom = createAsyncThunk('room/joinRoom',async({joinRoomId,userName}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/joinroom`

    const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post(link,{joinRoomId,userName},config);

    return response.data;
})

export const addMember = createAsyncThunk('member/addMember',async({roomId,memberName}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/addmember`
  console.log(roomId)

    const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post(link,{roomId,memberName},config);

    return response.data;
})

export const fetchMembers = createAsyncThunk('members/fetchMembers',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/members/${roomId}`

    // const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.get(link);
    return response.data;
})

export const fetchHost = createAsyncThunk('host/fetchHost',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/host/${roomId}`

  const response = await axios.get(link);
  return response.data;
})

export const fetchRoomName = createAsyncThunk('roomName/fetchRoomName',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/roomname/${roomId}`

  const response = await axios.get(link);
  return response.data;
})

export const fetchMessages = createAsyncThunk('messages/fetchMessages',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/messages/${roomId}`

  const response = await axios.get(link);
  return response.data;
})


export const fetchPayments = createAsyncThunk('payments/fetchPayments',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/payments/${roomId}`

  const response = await axios.get(link);
  return response.data;
})

export const isRoom = createAsyncThunk('room/isRoom',async({roomId}) => {
  let link = `https://expense-splitter.onrender.com/api/v1/isRoom`

  const response = await axios.post(link,{roomId});
  return response.data;
})

const roomSlice = createSlice({
    name: 'room',
    initialState: {
      members: [],
      host: "",
      messages: [],
      isLoading: false,
      payments:[],
      roomName: "",
      isRoom: false
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createRoom.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createRoom.fulfilled, (state) => {
            console.log("room created");
            state.isLoading = false;
        })
        .addCase(joinRoom.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(joinRoom.fulfilled, (state) => {
            console.log("room joined");
            state.isLoading = false;
        })
        .addCase(fetchMembers.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(fetchMembers.fulfilled, (state,action) => {
            state.members = action.payload.members
            state.isLoading = false
        })
        .addCase(fetchHost.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(fetchHost.fulfilled, (state,action) => {
            state.host = action.payload.host
            state.isLoading = false
        })
        .addCase(fetchRoomName.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(fetchRoomName.fulfilled, (state,action) => {
            state.roomName = action.payload.roomName
            state.isLoading = false
        })
        .addCase(fetchMessages.pending, (state,action) => {
            state.isLoading = true
        })
        .addCase(fetchMessages.fulfilled, (state,action) => {
            state.messages = action.payload.messages
            state.isLoading = false
        })
        .addCase(fetchPayments.fulfilled, (state,action) => {
            state.payments = action.payload.payments
            state.isLoading = false
        })
        .addCase(isRoom.fulfilled, (state,action) => {
            state.isRoom = action.payload.isRoom
        })
        
    },
  });
  
  export default roomSlice.reducer;