import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/roomSlice";
import { liquification } from "./Liquification";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import { useAlert } from "react-alert";
import toast, { Toaster } from 'react-hot-toast';

const Expense = ({ socket, expense, members, host, id,userName }) => {
  // const alert = useAlert()
  const dispatch = useDispatch();

  const payments = useSelector((state) => state.room.payments);

  const [dialog, setDialog] = useState(false);
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentBy, setPaymentBy] = useState("");
  const [amount, setAmount] = useState("");

  const [participants, setParticipants] = useState([]);
  const [liqarr, setLiqarr] = useState([]);

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
    setDialog(false);
  };

  const checkboxhandler = ({ e, user }) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setParticipants([...participants, user]);
    } else {
      setParticipants(participants.filter((name) => name !== user));
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

    return () => {
      socket.off("recievePayment");
    };
  }, [socket, dispatch, id]);

  const liquify = () => {
    const updatedMembers = [host]
    for(let i = 0; i < members.length;i++){
      updatedMembers.push(members[i].userName)
    }
    // console.log(updatedMembers)
    const liquifiedArray = liquification({members: updatedMembers,payments});
    setLiqarr(liquifiedArray)
  }
  

  return (
    <div
      style={{ display: expense ? "" : "none" }}
      className="room_chat room_expense "
    >
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
          <div>
            <div>
              <input
                onChange={(e) => checkboxhandler({ e, user: host })}
                className="inpt"
                type="checkbox"
                name=""
                id=""
              />
              <p>{host}</p>
            </div>
            {members &&
              members.map((member) => (
                <div >
                  <input
                    onChange={(e) =>
                      checkboxhandler({ e, user: member.userName })
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
                <div className="pay_right">
                  <p>Rs. {ele.amount}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="room_expense_right">

        <h1>Payment Liquidation</h1>

        <div className="liquidation">
            <button onClick={liquify} >Liquify</button>
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
