import React, { useState } from 'react'
import './CreateRoom.css'
import {useSelector,useDispatch} from 'react-redux'
import { createRoom, isRoom, joinRoom } from '../../redux/roomSlice'
import { useNavigate } from 'react-router-dom'
// import {useAlert} from 'react-alert'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Room/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';


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
