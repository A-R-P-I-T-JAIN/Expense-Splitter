const Room = require('../models/roomModel');

exports.createRoom = async (req, res) => {
  console.log("k")
  const { roomId, roomName, userName } = req.body;
  console.log(roomId, roomName, userName)
  console.log("4")

  try {
    if (!userName) {
      return res.status(400).json({
        success: false,
        error: 'User name is required',
      });
    }
    console.log("before room")
    const room = new Room({
      roomId,
      roomName,
      host: userName,
    });
    console.log("after room")

    // Save the new room
    console.log("a")
    await room.save();
    console.log("b")


    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};



  exports.joinRoom = async (req, res) => {
    try { 
        const { userName, joinRoomId } = req.body;

        const room = await Room.findOne({ roomId: joinRoomId });

        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found',
            });
        }

        // Push the userName to the members array
        room.members.push({ userName });

        // Save the room with the updated members array
        await room.save();

        res.status(200).json({
            success: true,
            room,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};

exports.addMember = async(req,res) => {
  try {
    const {roomId,memberName} = req.body;

    const room = await Room.findOne({roomId});

    if (!room) {
      return res.status(404).json({
          success: false,
          error: 'Room not found',
      });
  }

  room.members.push({userName: memberName });

  await room.save();

        res.status(200).json({
            success: true,
            room,
        });

  } catch (error) {
    
  }
}

exports.fetchMembers = async(req,res) => {
  try {
    const id = req.params.id;
    const room = await Room.findOne({roomId: id})

    if (!room) {
      return res.status(404).json({
          success: false,
          error: 'Room not found',
      });
  }

  res.status(200).json({
    success:true,
    members: room.members
  })
     

  } catch (error) {
    res.status(400).json({
      error
    })
  }
}

exports.fetchHost = async(req,res) => {
  try {
    const id = req.params.id;
    const room = await Room.findOne({roomId: id})

    if (!room) {
      return res.status(404).json({
          success: false,
          error: 'Room not found',
      });
  }

  res.status(200).json({
    success:true,
    host: room.host
  })
  } catch (error) {
    res.status(400).json({
      error
    })
  }
}

exports.fetchMessages = async (req,res) => {
  try {
    const id = req.params.id;
    const room = await Room.findOne({roomId: id})

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
    });
    }

    res.status(200).json({
      success:true,
      messages: room.messages
    })
  } catch (error) {
    res.status(400).json({
      error
    })
  }
};


exports.fetchPayments = async (req,res) => {
  try {
    const id = req.params.id;
    const room = await Room.findOne({roomId: id})

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
    });
    }

    res.status(200).json({
      success:true,
      payments: room.payments
    })
  } catch (error) {
    res.status(400).json({
      error
    })
  }
};

exports.fetchRoomName = async(req,res) => {
  try {
    const id = req.params.id;
    const room = await Room.findOne({roomId: id})

    if (!room) {
      return res.status(404).json({
          success: false,
          error: 'Room not found',
      });
  }

  res.status(200).json({
    success:true,
    roomName: room.roomName
  })
  } catch (error) {
    res.status(400).json({
      error
    })
  }
}

exports.isRoom = async(req,res) => {
  const {roomId} = req.body;

  const room = await Room.findOne({roomId});

  if (!room) {
    return res.status(404).json({
        isRoom: false,
        success: false,
        error: 'Room not found',
    });
}
   
  return res.status(200).json({
    success: true,
    isRoom: true
  })
}