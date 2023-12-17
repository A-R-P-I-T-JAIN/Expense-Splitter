import React, { useState } from 'react'
import './CreateRoom.css'
import {useSelector,useDispatch} from 'react-redux'
import { createRoom, isRoom, joinRoom } from '../../redux/roomSlice'
import { json, useNavigate } from 'react-router-dom'
// import {useAlert} from 'react-alert'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Room/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';


const CreateRoom = ({socket}) => {

  // const alert = useAlert()

  const isLoading = useSelector((state) => state.room.isLoading);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const[createRoomOpen,setCreateRoomOpen] = useState(false)
  const[roomName,setRoomName] = useState()
  const[joinRoomId,setJoinRoomId] = useState()
  const[userName,setUsername] = useState()
  const[rId,setRId] = useState()
  const[temptemp,setTempTemp] = useState(false)
  const[showPreviousRoom,setShowPreviousRoom] = useState(false)

  const yourRooms = JSON.parse(localStorage.getItem("rooms")) || [];
  // const[yourRooms,setYourRooms] = useState(JSON.parse(localStorage.getItem("rooms")) || [])
  const friendRooms = JSON.parse(localStorage.getItem("joinedRooms")) || [];

  function generateRandom(){
    return Math.floor(100000 + Math.random() * 900000);
  }

  // const createRoomHandler = () => {
  //   const roomId = generateRandom();
  //   socket.emit('createRoom', {roomName,roomId});
  //   dispatch(createRoom({roomId,roomName,userName}));
  //   setRoomName('');
  //   setUsername('')
  //   navigate(`/room/${roomId}?action=create`,{replace: true})
  // };

  const createRoomHandler = () => {
    const roomId = generateRandom();
    dispatch(createRoom({ roomId, roomName, userName })); 

    // socket.emit('createRoom', { roomId });
    // navigate(`/room/${roomId}?userName=${userName}`, { replace: true });
    setRId(roomId)

    const selfRoom = {
      roomId,
      roomName,
    };

    // Get existing rooms from local storage
    const existingRooms = JSON.parse(localStorage.getItem("rooms")) || [];

    // Add the new room to the array
    existingRooms.push(selfRoom);

    // Store the updated array in local storage
    localStorage.setItem("rooms", JSON.stringify(existingRooms));

    setCreateRoomOpen(false)
    setTempTemp(true);

  };
  
  

  const joinRoomHandler = () => {
  
    // Assuming your server emits a 'roomNotFound' event when the room is not found
    socket.emit('joinRoom', { joinRoomId });
  
    // Listen for server response
    socket.on('roomNotFound', () => {
      // Handle room not found (e.g., show an alert)
      // alert.show(`Room with ID ${joinRoomId} not found. Please check the room ID.`);
      toast.error(`Room with ID ${joinRoomId} not found. Please check the room ID.`)
      setJoinRoomId('');
    });
  
    // Listen for successful room join
    socket.on('roomJoined', () => {
      const existingJoinedRooms = JSON.parse(localStorage.getItem("joinedRooms")) || [];
      // const yourRooms = JSON.parse(localStorage.getItem("rooms")) || [];

      const isAlreadyJoined = existingJoinedRooms.includes(joinRoomId) || yourRooms.some(room => room.roomId === joinRoomId);


      if (!isAlreadyJoined) {
        existingJoinedRooms.push(joinRoomId);
  
        // Update local storage
        localStorage.setItem("joinedRooms", JSON.stringify(existingJoinedRooms));
      }
      // Room joined successfully, navigate
      navigate(`/room/${joinRoomId}`, { replace: true });
      setJoinRoomId('');
    });

    return () => {
      socket.off("roomJoined");
      socket.off("roomNotFound");
    };
  };

  return (
    <div className='createroom_cont'>

      <Toaster />
      {isLoading && <Loader />}
      <FontAwesomeIcon 
      icon={faCircleInfo} 
      onClick={() => setTempTemp(true)} 
      style={{position:"absolute",top:"15px",right:"15px",width:"40px"}}
      />

      <h3 
      className='h3'
      onClick={() => setShowPreviousRoom(true)}
      style={{position:"absolute",top:"0",left:"15px"}} >Previous Rooms??</h3>

      <div style={{display: showPreviousRoom?"":"none"}} className="previousRoomCont">
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => setShowPreviousRoom(false)} />
      <div className="previous_rooms">
        <div className="your_rooms">
          <h1>Created Rooms</h1>
          <div className="rtemp">
            {yourRooms && yourRooms.map((room) => (
              <div>
                <p>RoomId: {room.roomId}</p>
                <p>RoomName: {room.roomName}</p>
              </div>
            ))}
            </div>
        </div>
        <div className=" your_rooms friend_rooms">
        <h1>Joined Rooms</h1>
        <div className="rtemp">
            {friendRooms && friendRooms.map((room) => (
              <div>
                <p>RoomId: {room}</p>
              </div>
            ))}
            </div>
        </div>
      </div>
      </div>

      <div style={{display: temptemp && !isLoading?"":"none"}} className="temptemp">
          <h1>Room Name: {roomName}</h1>
          <h1>user Name: {userName}</h1>
          <h1>Room Id: {rId}</h1>
          <p>GO BACK AND JOIN ROOM WITH ABOVE ID</p>
          <button onClick={() => setTempTemp(false)} >Close</button>
      </div>

        <div className="cr_head">
            <h1>EXPENSE SPLITTER</h1>
        </div>
        <div className="cr_room">
            <button onClick={() => setCreateRoomOpen(true)} >Create Room</button>
            <p>or</p>
            <div>
                <input value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} type="number" placeholder='Enter Room Code' />
                <button onClick={() => joinRoomHandler()} >Join Room</button>
            </div>
        </div>

        {/* create room */}
        <div style={{display: createRoomOpen?"":"none"}} className="create_room_card_cont" >
        <div className="create_room_card">
          <h1>Your Name</h1>
          <input value={userName} onChange={(e) => setUsername(e.target.value)} placeholder='enter your name' type="text" />
          <h1>Room Name</h1>
          <input value={roomName} placeholder='enter RoomName' onChange={(e) => setRoomName(e.target.value)} type="text" />
          <button disabled={!userName || !roomName} onClick={() => createRoomHandler()} >Create</button>
          <button onClick={() => setCreateRoomOpen(false)} >Back</button>
        </div>
        </div>
    </div>
  )
}

export default CreateRoom
