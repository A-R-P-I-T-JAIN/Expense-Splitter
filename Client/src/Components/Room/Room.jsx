import React, { useEffect, useState } from "react";
import "./Room.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchHost,
  fetchMembers,
  fetchRoomName,
  addMember as addMemberAction,
} from "../../redux/roomSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Chat from "./Chat";
import Expense from "./Expense";
import RoomInfo from "./RoomInfo";
import History from "./History";
// import { useAlert } from "react-alert";
import Loader from "./Loader";
import toast, { Toaster } from 'react-hot-toast';

const Room = ({ socket }) => {
  // const alert = useAlert();

  const dispatch = useDispatch();

  const members = useSelector((state) => state.room.members);
  const host = useSelector((state) => state.room.host);
  const roomName = useSelector((state) => state.room.roomName);
  const isLoading = useSelector((state) => state.room.isLoading);

  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const un = searchParams.get("userName");

  const [userName, setUserName] = useState(un);
  const [showAddMember, setShowAddMember] = useState(un?true:false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  // const [members, setMembers] = useState(prevMembers);
  // const [members, setMembers] = useState(prevMembers.map(member => member.userName));

  const [chat, setChat] = useState(false);
  const [expense, setExpense] = useState(true);
  const [history, setHistory] = useState(false);
  const [info, setInfo] = useState(false);

  const [memberName, setMemberName] = useState("");
  const [membersList, setMembersList] = useState(!un);


  useEffect(() => {
    dispatch(fetchMembers({ roomId: id }));
    dispatch(fetchRoomName({ roomId: id }));
    dispatch(fetchHost({ roomId: id }));
  }, [dispatch, id]);

  useEffect(() => {
    
    socket.on("recieveMember", ({roomId}) => {
      dispatch(fetchMembers({ roomId }));
      // alert.show("New member added");
      toast.success("New member added")
    })
    
    return () => {
      socket.off("recieveMember");
    };
  }, [socket, dispatch]);

  const addMemberHandler = () => {

    socket.emit("addMember", { memberName, roomId: id });
    setMemberName("");
  };

  const enterRoomHandler = () => {
    setMembersList(false);
  };

  return (
    <div className="room_cont">
      <Toaster/>
      {isLoading && <Loader />}
      <h5>{userName}</h5>
      <h4>{roomName}</h4>

      <div
        style={{ display: membersList ? "" : "none" }}
        className="who_are_you"
      >
        <h1>Who are you??</h1>
        <select
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          name=""
          id=""
        >
          <option value="">Tell us Who are you</option>
          <option value={host}>{host}</option>
          {/* {members &&
            members.map((member) => (
              <option value={member} key={member}>
                {member}
              </option>
            ))} */}
          {members &&
            members.map((member) => (
              <option value={member.userName} key={member.userName}>
                {member.userName}
              </option>
            ))}
        </select>

        <button onClick={enterRoomHandler}>Enter room</button>
      </div>

      <div className="room_options">
        <div
          style={{
            // display: showAddMember || userName === host ? "" : "none",
            display: userName === host ? "" : "none",
          }}
        >
          <div className="am">
            <button  onClick={() => setOpenAddMemberDialog(true)}>
              Add member
            </button>
            <div
              style={{ display: openAddMemberDialog ? "" : "none" }}
              className="add_member"
            >
              <h1>Add Member</h1>
              <input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                type="text"
              />
              <div className="amb">
                <button
                  disabled={!memberName}
                  onClick={() => addMemberHandler()}
                >
                  Add
                </button>
                <button onClick={() => setOpenAddMemberDialog(false)}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
        style={expense?{background: "linear-gradient(45deg,rgb(3, 125, 3),rgb(126, 244, 128))"}:{}}
          onClick={() => {
            setExpense(true);
            setChat(false);
            setHistory(false);
            setInfo(false);
          }}
        >
          Expense
        </button>
        <button
        style={chat?{background: "linear-gradient(45deg,rgb(3, 125, 3),rgb(126, 244, 128))"}:{}}
          onClick={() => {
            setExpense(false);
            setChat(true);
            setHistory(false);
            setInfo(false);
          }}
        >
          Chat
        </button>
        {/* <button
          onClick={() => {
            setExpense(false);
            setChat(false);
            setHistory(true);
            setInfo(false);
          }}
        >
          History
        </button> */}
        <button
          style={info?{background: "linear-gradient(45deg,rgb(3, 125, 3),rgb(126, 244, 128))"}:{}}
          onClick={() => {
            setExpense(false);
            setChat(false);
            setHistory(false);
            setInfo(true);
          }}
        >
          Room Info
        </button>
      </div>

      <Chat socket={socket} chat={chat} userName={userName} id={id} />

      <Expense
        socket={socket}
        expense={expense}
        members={members}
        userName={userName}
        host={host ? host : ""}
        id={id}
      />

      <RoomInfo
        info={info}
        roomName={roomName}
        id={id}
        host={host}
        members={members}
      />

      <History history={history} />
    </div>
  );
};

export default Room;