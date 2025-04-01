import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/roomSlice";
import { liquification } from "./Liquification";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

// import { useAlert } from "react-alert";
import toast, { Toaster } from 'react-hot-toast';

const Expense = ({ socket, expense, members, host, id,userName }) => {
  // const alert = useAlert()
  const dispatch = useDispatch();
  const ref = useRef()

  const payments = useSelector((state) => state.room.payments);

  const [dialog, setDialog] = useState(false);
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentBy, setPaymentBy] = useState("");
  const [amount, setAmount] = useState("");

  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [pb, setPb] = useState("");
  const [pf, setPf] = useState("");
  const [am, setAm] = useState("");
  const [pr, setPr] = useState();

  const [participants, setParticipants] = useState([]);
  const [liqarr, setLiqarr] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState(
    Array.from({ length: members.length + 1 }, () => false)
  );
  

  useEffect(() => {
    // Reset checkbox states when members array changes
    setCheckboxStates(Array.from({ length: members.length + 1 }, () => false));
  }, [members]);

  useEffect(() => {
    liquify()
  },[payments])

  const saveHandler = () => {
    socket.emit("addPayment", {
      paymentBy,
      paymentFor,
      amount,
      participants,
      roomId: id,
    });

    setPaymentBy("");
    setPaymentFor("");
    setAmount("");
    setParticipants([]);

    setCheckboxStates(Array.from({ length: members.length + 1 }, () => false));
    if (ref.current) {
      ref.current.checked = false;
    }

    setDialog(false);
  };

  const checkboxhandler = ({ e, user,index }) => {
    const isChecked = e.target.checked;

    setCheckboxStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index+1] = isChecked;
      return newStates;
    }); 

    if (isChecked) {
      setParticipants([...participants, user]);
    } else {
      setParticipants(participants.filter((name) => name !== user));
    }
  };

  const selectAllHandler = (e) => {
    const isChecked = e.target.checked;
    const allMembers = [host, ...members.map(member => member.userName)];
    
    setCheckboxStates(Array.from({ length: members.length + 1 }, () => isChecked));
    
    if (isChecked) {
      setParticipants(allMembers);
    } else {
      setParticipants([]);
    }
    
    if (ref.current) {
      ref.current.checked = isChecked;
    }
  };

  useEffect(() => {
    dispatch(fetchPayments({ roomId: id }));
  }, [dispatch]);

  useEffect(() => {
    socket.on("recievePayment", () => {
      dispatch(fetchPayments({ roomId: id }));
      // alert.show("New Payment added")
      toast.success("New Payment Added")
    });

    socket.on("addPaymentFailed", () => {
      toast.error("Fill all details!!")
    });

    socket.on("paymentDeleted",() => {
      dispatch(fetchPayments({ roomId: id }));
      toast.success("Payment Deleted")
    })

    return () => {
      socket.off("recievePayment");
    };
  }, [socket, dispatch, id]);

  const liquify = () => {
    const updatedMembers = [host]
    for(let i = 0; i < members.length;i++){
      updatedMembers.push(members[i].userName)
      // updatedMembers.push(members[i])
    }
    // console.log(updatedMembers)
    const liquifiedArray = liquification({members: updatedMembers,payments});
    setLiqarr(liquifiedArray)
  }

  const deleteHandler = (pId) => {
      socket.emit("deletePayment",{pId,id})
  }

  const paymentInfoHandler = (ele) => {
    setPb(ele.paymentBy)
    setPf(ele.paymentFor)
    setAm(ele.amount)
    setPr(ele.participants)
    setShowPaymentInfo(true)
  }
  

  return (
    <div
      style={{ display: expense ? "" : "none" }}
      className="room_chat room_expense "
    >
      <div style={{display: showPaymentInfo?"":"none"}} className="paymentInfo">
        <div className="paymentInfoDialog">
          <h1>Payment By : {pb}</h1>
          <h1>Payment For : {pf}</h1>
          <h1>amount : {am}</h1>
          <div>
            <h1>Members: </h1>
            <div className="q">
          {pr && pr.map((p) => (
            <h2>{p},</h2>
          ))}
          </div>
          </div>
          
          
          <button onClick={() => setShowPaymentInfo(false)} >Back</button>
        </div>
      </div>
  
      <Toaster />
      <div style={{ display: dialog ? "" : "none" }} className="dialog_cont">
        <div className="dialog_main">
          <h2>Payer</h2>
          <select
            value={paymentBy}
            onChange={(e) => setPaymentBy(e.target.value)}
            name=""
            id=""
          >
            <option value="">Payer...</option>
            <option value={host}>{host}</option>
            {members &&
              members.map((member) => (
                <option  value={member.userName}>
                  {" "}
                  {member.userName}
                </option>
              ))}
          </select>
          <h2>Payment of</h2>
          <input
            placeholder="what did you pay for....."
            value={paymentFor}
            onChange={(e) => setPaymentFor(e.target.value)}
            type="text"
          />
          <h2>Price</h2>
          <input
            placeholder="Rs. 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            name=""
            id=""
          />
          <h2>Payment for</h2>
          <div className="select-all-container">
            <div>
              <input
                type="checkbox"
                onChange={selectAllHandler}
                id="selectAll"
              />
              <label htmlFor="selectAll">Select All</label>
            </div>
          </div>
          <div className="participants-list">
            <div>
              <input
                ref={ref}
                checked={checkboxStates[0]}
                onChange={(e) => checkboxhandler({ e, user: host, index: -1 })}
                className="inpt"
                type="checkbox"
                name=""
                id=""
              />
              <p>{host}</p>
            </div>
            {members &&
              members.map((member,index) => (
                <div >
                  <input
                    checked={checkboxStates[index + 1]}
                    onChange={(e) =>
                      checkboxhandler({ e, user: member.userName,index })
                    }
                    className="inpt"
                    type="checkbox"
                    name=""
                    id=""
                  />
                  <p>{member.userName}</p>
                </div>
              ))}
          </div>
          <div className="dialog_btn">
            <button onClick={() => saveHandler()}>Save</button>
            <button
              onClick={() => {
                setDialog(false);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="room_expense_left">
        <button
          onClick={() => {
            setDialog(true);
          }}
        >
          Add Payment
        </button>
        <div className="payments">
          {payments &&
            payments.map((ele) => (
              <div className="pay">
                <div className="pay_left">
                  <h1>{ele.paymentBy}</h1>
                  <p>For {ele.paymentFor}</p>
                </div>
                <div className="pay_right" style={{alignItems:"center",gap:"10px"}}>
                  <p>Rs. {ele.amount}</p>
                  <FontAwesomeIcon 
                  style={{display: userName === host?"":"none"}} 
                  onClick={() => deleteHandler(ele._id)}  
                  icon={faTrash} />  
                  <FontAwesomeIcon 
                  icon={faCircleInfo}
                  onClick={() => paymentInfoHandler(ele)} 
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="room_expense_right">
        <h1>Payment Liquidation</h1>
        <div className="liquidation">
            {liqarr && liqarr.map((ele) => (
              <div>
                <p className={ele.payer === userName?"self":""} >{ele.payer}</p>
                <FontAwesomeIcon icon={faArrowRight} />                
                <p>{ele.amount}₹</p>
                <FontAwesomeIcon icon={faArrowRight} />  
                <p className={ele.reciever === userName?"self":""} >{ele.reciever}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Expense;
