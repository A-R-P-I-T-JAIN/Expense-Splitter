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
import Settlements from "./Settlements";
import History from "./History";
import Loader from "./Loader";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FiUsers, FiMessageSquare, FiDollarSign, FiInfo, 
  FiX, FiCheck, FiCopy, FiMenu, FiChevronLeft, FiFileText, FiShare2
} from 'react-icons/fi';

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
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [sharedLinkCopied, setSharedLinkCopied] = useState(false);

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
      socket.connect();
    }
    
    return () => {
      socket.off("recieveMember");
    };
  }, [socket, dispatch]);

  // Check if on mobile and close sidebar by default
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate share link when dialog opens
  useEffect(() => {
    if (showShareDialog) {
      const baseUrl = window.location.origin;
      const roomUrl = `${baseUrl}/room/${id}?userName=`;
      setShareLink(roomUrl);
    }
  }, [showShareDialog, id]);

  const addMemberHandler = () => {
    if (!memberName.trim()) {
      toast.error("Please enter a member name");
      return;
    }
    
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
    toast.success(`Welcome to the room, ${userName}!`);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Room ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setSharedLinkCopied(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setSharedLinkCopied(false), 2000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isDataLoading || (isLoading && !initialLoadComplete)) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="room-container">
      <Toaster position="top-right" />
      
      <header className="room-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
          </button>
          <div className="room-info">
            <h1 className="room-name" title={roomName || "Loading Room..."}>
              {roomName || "Loading Room..."}
              <span className="room-id-badge" onClick={copyRoomId} title={`Copy Room ID: ${id}`}>
                {copied ? <FiCheck /> : <FiCopy />} {id.substring(0, 8)}...
              </span>
            </h1>
          </div>
        </div>
        <div className="user-info">
          <button 
            className="share-button"
            onClick={() => setShowShareDialog(true)}
            aria-label="Share room"
            title="Share room with others"
          >
            <FiShare2 />
          </button>
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

      <div className="room-layout">
        <aside className={`room-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-btn ${activeTab === 'expense' ? 'active' : ''}`}
              onClick={() => setActiveTab('expense')}
            >
              <FiDollarSign />
              <span>Expenses</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'settlements' ? 'active' : ''}`}
              onClick={() => setActiveTab('settlements')}
            >
              <FiFileText />
              <span>Settlements</span>
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
            
            <div className="sidebar-footer">
              {userName === host && (
                <button
                  className="add-member-btn"
                  onClick={() => setOpenAddMemberDialog(true)}
                >
                  <FiUsers />
                  <span>Add Member</span>
                </button>
              )}
            </div>
          </nav>
        </aside>

        <main className="room-content">
          <div className="content-container">
            {activeTab === 'expense' && (
              <Expense
                socket={socket}
                members={members}
                userName={userName}
                host={host}
                id={id}
              />
            )}
            {activeTab === 'settlements' && (
              <Settlements
                members={members}
                host={host}
                userName={userName}
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
          </div>
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
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setOpenAddMemberDialog(false)}
              >
                <FiX /> Cancel
              </button>
              <button
                className="btn primary"
                onClick={addMemberHandler}
                disabled={!memberName.trim()}
              >
                <FiCheck /> Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Share Room</h2>
            <p>Share this link with others to invite them to the room:</p>
            <div className="share-link-container">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-link-input"
                onClick={(e) => e.target.select()}
              />
              <button
                className="btn primary copy-link-btn"
                onClick={copyShareLink}
              >
                {sharedLinkCopied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <p className="share-note">
              Note: The person joining will need to enter their name when they open the link.
            </p>
            <div className="modal-actions">
              <button
                className="btn primary"
                onClick={() => setShowShareDialog(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;