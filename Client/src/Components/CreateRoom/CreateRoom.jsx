import React, { useState, useEffect } from 'react';
import './CreateRoom.css';
import { useSelector, useDispatch } from 'react-redux';
import { createRoom, isRoom, joinRoom } from '../../redux/roomSlice';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Room/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCircleInfo, 
  faCircleXmark, 
  faPlus, 
  faDoorOpen, 
  faHistory, 
  faCheck, 
  faCopy,
  faUsers,
  faArrowRight,
  faHome
} from '@fortawesome/free-solid-svg-icons';

const CreateRoom = ({ socket }) => {
  const isLoading = useSelector((state) => state.room.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUsername] = useState('');
  const [rId, setRId] = useState('');
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showPreviousRoom, setShowPreviousRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Retrieve stored rooms data
  const yourRooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const friendRooms = JSON.parse(localStorage.getItem("joinedRooms")) || [];

  // Load user's name from local storage if available
  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUsername(savedUserName);
    }
    setIsInitializing(false);
  }, []);

  function generateRandom() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const createRoomHandler = () => {
    if (!userName.trim() || !roomName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const roomId = generateRandom();
    dispatch(createRoom({ roomId, roomName, userName }));
    setRId(roomId);

    // Save user name for future use
    localStorage.setItem("userName", userName);

    const selfRoom = {
      roomId,
      roomName,
      createdAt: new Date().toISOString()
    };

    const existingRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    existingRooms.push(selfRoom);
    localStorage.setItem("rooms", JSON.stringify(existingRooms));

    setCreateRoomOpen(false);
    setShowRoomDetails(true);
    toast.success('Room created successfully!');
  };

  const joinRoomHandler = () => {
    if (!joinRoomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    socket.emit('joinRoom', { joinRoomId });

    socket.on('roomNotFound', () => {
      toast.error(`Room with ID ${joinRoomId} not found. Please check the room ID.`);
      setJoinRoomId('');
      setIsJoining(false);
    });

    socket.on('roomJoined', () => {
      const existingJoinedRooms = JSON.parse(localStorage.getItem("joinedRooms")) || [];
      const isAlreadyJoined = existingJoinedRooms.includes(joinRoomId) || 
        yourRooms.some(room => room.roomId === joinRoomId);

      if (!isAlreadyJoined) {
        existingJoinedRooms.push(joinRoomId);
        localStorage.setItem("joinedRooms", JSON.stringify(existingJoinedRooms));
      }

      toast.success('Successfully joined the room!');
      navigate(`/room/${joinRoomId}`, { replace: true });
      setJoinRoomId('');
      setIsJoining(false);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("roomNotFound");
    };
  };

  const handleJoinSavedRoom = (roomId) => {
    if (roomId) {
      navigate(`/room/${roomId}`, { replace: true });
      setShowPreviousRoom(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(rId);
    setCopied(true);
    toast.success('Room ID copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isInitializing || isLoading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className='createroom_cont'>
      <Toaster position="top-center" />

      <div 
        className="logo-container"
        onClick={() => navigate('/')}
        title="Go to Home"
      >
        <FontAwesomeIcon icon={faHome} size="lg" color="var(--primary)" />
        <span>Expense Splitter</span>
      </div>

      <button 
        className="history-button"
        onClick={() => setShowPreviousRoom(true)}
      >
        <FontAwesomeIcon icon={faHistory} /> Recent Rooms
      </button>

      {showPreviousRoom && (
        <div className="previousRoomCont">
          <div className="previous_rooms">
            <FontAwesomeIcon 
              icon={faCircleXmark} 
              onClick={() => setShowPreviousRoom(false)}
              className="close-icon"
            />
            <div className="your_rooms">
              <h1>Created Rooms</h1>
              <div className="rtemp">
                {yourRooms.length > 0 ? (
                  yourRooms.map((room, index) => (
                    <div 
                      key={index} 
                      className="room-card"
                      onClick={() => handleJoinSavedRoom(room.roomId)}
                    >
                      <p><strong>Room ID:</strong> {room.roomId}</p>
                      <p><strong>Room Name:</strong> {room.roomName}</p>
                      {room.createdAt && (
                        <p><strong>Created:</strong> {formatDate(room.createdAt)}</p>
                      )}
                      <button className="join-saved-room">
                        <FontAwesomeIcon icon={faArrowRight} /> Enter Room
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-rooms">No rooms created yet</p>
                )}
              </div>
            </div>
            <div className="your_rooms friend_rooms">
              <h1>Joined Rooms</h1>
              <div className="rtemp">
                {friendRooms.length > 0 ? (
                  friendRooms.map((room, index) => (
                    <div 
                      key={index} 
                      className="room-card"
                      onClick={() => handleJoinSavedRoom(room)}
                    >
                      <p><strong>Room ID:</strong> {room}</p>
                      <button className="join-saved-room">
                        <FontAwesomeIcon icon={faArrowRight} /> Enter Room
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-rooms">No rooms joined yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoomDetails && (
        <div className="room-details-modal">
          <div className="room-details-content">
            <h2><FontAwesomeIcon icon={faCheck} /> Room Created Successfully!</h2>
            <div className="room-info">
              <p><strong>Room Name:</strong> {roomName}</p>
              <p><strong>Your Name:</strong> {userName}</p>
              <div className="room-id-container">
                <p><strong>Room ID:</strong> {rId}</p>
                <button 
                  onClick={copyRoomId} 
                  className="copy-button"
                  title="Copy Room ID"
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                </button>
              </div>
            </div>
            <p className="instruction">
              <FontAwesomeIcon icon={faUsers} /> Share this Room ID with others to join your expense splitting group
            </p>
            <div className="room-details-actions">
              <button onClick={() => navigate(`/room/${rId}`, { replace: true })}>
                Enter Room <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button onClick={() => setShowRoomDetails(false)} className="secondary-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cr_head">
        <h1>EXPENSE SPLITTER</h1>
        <p className="tagline">Split expenses with friends easily</p>
      </div>

      <div className="cr_room">
        <button onClick={() => setCreateRoomOpen(true)}>
          <FontAwesomeIcon icon={faPlus} /> Create New Room
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="join-room">
          <input 
            value={joinRoomId} 
            onChange={(e) => setJoinRoomId(e.target.value)} 
            type="number" 
            placeholder='Enter Room Code'
            disabled={isJoining}
          />
          <button 
            onClick={joinRoomHandler}
            disabled={isJoining}
          >
            <FontAwesomeIcon icon={faDoorOpen} /> {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>

      {createRoomOpen && (
        <div className="create_room_card_cont">
          <div className="create_room_card">
            <h1>Create New Room</h1>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                value={userName} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder='Enter your name' 
                type="text"
                maxLength={30}
              />
            </div>
            <div className="form-group">
              <label>Room Name</label>
              <input 
                value={roomName} 
                placeholder='Enter room name' 
                onChange={(e) => setRoomName(e.target.value)} 
                type="text"
                maxLength={30}
              />
            </div>
            <div className="button-group">
              <button 
                disabled={!userName.trim() || !roomName.trim()} 
                onClick={createRoomHandler}
              >
                Create Room
              </button>
              <button onClick={() => setCreateRoomOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;