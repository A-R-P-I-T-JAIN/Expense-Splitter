const app = require("./app.js");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Room = require("./models/roomModel.js");
require('dotenv').config();

const connectDatabase = require("./config/database.js");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  // socket.on("createRoom", ({ roomId }) => {
  //   socket.join(roomId);
  //   console.log(`User ${socket.id} created and joined room: ${roomId}`);
  // });

  socket.on('createRoom', async({ roomId }) => {
      socket.join(roomId);
      console.log(`created room and joined ${roomId}`)
      // socket.emit('roomCreated');

    //   const room = new Room({
    //     roomId,
    //     roomName,
    //     host: userName,
    // });

    // await room.save();
    // socket.join(roomId)
    // socket.emit('roomCreated');
  });

  socket.on('joinRoom', async({ joinRoomId }) => {
    const room = await Room.findOne({ roomId: joinRoomId }); // You need to implement findRoomById function
  
    if (!room) {
      // Room not found, emit a 'roomNotFound' event
      socket.emit('roomNotFound');
    } else {
      // Room found, emit a 'roomJoined' event
      socket.join(joinRoomId);
      console.log(`User ${socket.id} joined room: ${joinRoomId}`);
      socket.emit('roomJoined');
    }
  });

  socket.on("sendMessage", async ({ message, name, roomId }) => {
    const room = await Room.findOne({ roomId });

    room.messages.push({ userName: name, message });

    await room.save();

    // await saveMessages({roomId,message,userName: name})

    io.to(roomId).emit("recieveMessage", { message, name, roomId });
  });

  socket.on(
    "addPayment",
    async ({ paymentBy, paymentFor, amount, participants, roomId }) => {

      if(!paymentBy || !paymentFor || !participants || !amount){
          socket.emit("addPaymentFailed")
      } else {
        const room = await Room.findOne({ roomId });

        room.payments.push({ paymentBy, paymentFor, amount, participants });
  
        await room.save();
  
        io.to(roomId).emit("recievePayment", {
          paymentBy,
          paymentFor,
          amount,
          participants,
        });
      }

    }
  );

  socket.on("addMember", async ({ memberName, roomId }) => {
    const room = await Room.findOne({ roomId });

    room.members.push({ userName: memberName });

    await room.save();

    io.to(roomId).emit("recieveMember", { roomId });
  });
  

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

connectDatabase();

server.listen(port, (req, res) => {
  console.log(`server running at Port:${port}`);
});
