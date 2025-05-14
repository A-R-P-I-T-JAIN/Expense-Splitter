import React, { useEffect, useState } from "react";
import "./Room.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchHost,
  fetchMembers,
  fetchRoomName,
  addMember as addMemberAction,
  fetchMessages,
  fetchPayments
} from "../../redux/roomSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Chat from "./Chat";
import Expense from "./Expense";
import RoomInfo from "./RoomInfo";
import History from "./History";
import Loader from "./Loader";
import toast, { Toaster } from 'react-hot-toast';
import { FiUsers, FiMessageSquare, FiDollarSign, FiInfo } from 'react-icons/fi';

const Room = ({ socket }) => {
  const dispatch = useDispatch();

  // Redux state
  const members = useSelector((state) => state.room.members);
  const host = useSelector((state) => state.room.host);
  const roomName = useSelector((state) => state.room.roomName);
  const isLoading = useSelector((state) => state.room.isLoading);

  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const un = searchParams.get("userName");

  const [userName, setUserName] = useState(un);
  const [showAddMember, setShowAddMember] = useState(un ? true : false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('expense');
  const [memberName, setMemberName] = useState("");
  const [membersList, setMembersList] = useState(!un);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsDataLoading(true);
      try {
        await dispatch(fetchMembers({ roomId: id })).unwrap();
        await dispatch(fetchRoomName({ roomId: id })).unwrap();
        await dispatch(fetchHost({ roomId: id })).unwrap();
        await dispatch(fetchMessages({ roomId: id })).unwrap();
        await dispatch(fetchPayments({ roomId: id })).unwrap();
        setInitialLoadComplete(true);
        setIsDataLoading(false);
        console.log("Initial data fetched successfully");
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load room data. Please try again.");
        setIsDataLoading(false);
      }
    };
    
    fetchInitialData();
  }, [dispatch, id]);

  // Socket event listeners
  useEffect(() => {
    socket.on("recieveMember", ({ roomId }) => {
      dispatch(fetchMembers({ roomId }));
      toast.success("New member added");
    });
    
    // Make sure socket is connected
    if (!socket.connected) {
      console.log("Socket not connected, attempting to connect...");
      socket.connect();
    }
    
    return () => {
      socket.off("recieveMember");
    };
  }, [socket, dispatch]);

  const addMemberHandler = () => {
    socket.emit("addMember", { memberName, roomId: id });
    setMemberName("");
    setOpenAddMemberDialog(false);
    toast.success("Member added successfully");
  };

  const enterRoomHandler = () => {
    if (!userName) {
      toast.error("Please select your name");
      return;
    }
    socket.emit("joinRoom2", { roomId: id });
    setMembersList(false);
    toast.success("Welcome to the room!");
  };

  // Debug logging
  useEffect(() => {
    console.log("Active tab:", activeTab);
    console.log("Is loading:", isLoading);
    console.log("Initial load complete:", initialLoadComplete);
    console.log("Is data loading:", isDataLoading);
  }, [activeTab, isLoading, initialLoadComplete, isDataLoading]);

  if (isDataLoading || (isLoading && !initialLoadComplete)) {
    console.log("Showing loader");
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        backgroundColor: 'transparent'
      }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="room-container">
      <Toaster position="top-right" />
      
      <header className="room-header">
        <div className="room-info">
          <h1 className="room-name">{roomName || "Loading Room..."}</h1>
          <p className="room-id">Room ID: {id}</p>
        </div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          {userName === host && <span className="host-badge">Host</span>}
        </div>
      </header>

      {membersList && (
        <div className="user-selection-modal">
          <div className="modal-content">
            <h2>Welcome to {roomName || "the Room"}</h2>
            <p>Please select your name to continue</p>
            <select
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="user-select"
            >
              <option value="">Select your name</option>
              {host && <option value={host}>{host} (Host)</option>}
              {members && members.map((member) => (
                <option value={member.userName} key={member.userName}>
                  {member.userName}
                </option>
              ))}
            </select>
            <button className="btn primary" onClick={enterRoomHandler}>
              Enter Room
            </button>
          </div>
        </div>
      )}

      <div className="room-content">
        <nav className="room-nav">
          <button
            className={`nav-btn ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            <FiDollarSign />
            <span>Expenses</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <FiMessageSquare />
            <span>Chat</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FiInfo />
            <span>Room Info</span>
          </button>
          {userName === host && (
            <button
              className="add-member-btn"
              onClick={() => setOpenAddMemberDialog(true)}
            >
              <FiUsers />
              <span>Add Member</span>
            </button>
          )}
        </nav>

        <main className="room-main">
          {activeTab === 'expense' && (
            <Expense
              socket={socket}
              members={members}
              userName={userName}
              host={host}
              id={id}
            />
          )}
          {activeTab === 'chat' && (
            <Chat
              socket={socket}
              userName={userName}
              id={id}
            />
          )}
          {activeTab === 'info' && (
            <RoomInfo
              roomName={roomName}
              id={id}
              host={host}
              members={members}
            />
          )}
        </main>
      </div>

      {openAddMemberDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Member</h2>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Enter member name"
              className="member-input"
            />
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setOpenAddMemberDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={addMemberHandler}
                disabled={!memberName.trim()}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;