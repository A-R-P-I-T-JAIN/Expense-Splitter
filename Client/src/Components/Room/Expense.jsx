import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/roomSlice";
import { liquification } from "./Liquification";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTrash, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

const Expense = ({ socket, expense, members, host, id, userName }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const payments = useSelector((state) => state.room.payments);

  const [dialog, setDialog] = useState(false);
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentBy, setPaymentBy] = useState("");
  const [amount, setAmount] = useState("");
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [participants, setParticipants] = useState([]);
  const [liqarr, setLiqarr] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState(
    Array.from({ length: members.length + 1 }, () => false)
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // Reset checkbox states when members array changes
  useEffect(() => {
    setCheckboxStates(Array.from({ length: members.length + 1 }, () => false));
  }, [members]);

  // Liquify payments when payments, host or members change
  useEffect(() => {
    const liquify = () => {
      if (!host || !members || !payments) return;
      
      const updatedMembers = [host, ...members.map(member => member.userName)];
      const liquifiedArray = liquification({ 
        members: updatedMembers, 
        payments: payments.filter(p => p.paymentBy && p.amount > 0 && p.participants?.length > 0)
      });
      
      // Filter out any invalid entries and round amounts
      const validLiquidation = liquifiedArray
        .filter(item => item.amount > 0.01)
        .map(item => ({
          ...item,
          amount: parseFloat(item.amount.toFixed(2))
        }));
      
      setLiqarr(validLiquidation);
    };

    if (payments && payments.length > 0 && host && members) {
      liquify();
    } else {
      setLiqarr([]);
    }
  }, [payments, host, members]);

  const saveHandler = () => {
    if (!paymentBy || !paymentFor || !amount || participants.length === 0) {
      toast.error("Please fill all details and select at least one participant");
      return;
    }

    socket.emit("addPayment", {
      paymentBy,
      paymentFor,
      amount: parseFloat(amount),
      participants,
      roomId: id,
    });

    // Reset form
    setPaymentBy("");
    setPaymentFor("");
    setAmount("");
    setParticipants([]);
    setCheckboxStates(Array.from({ length: members.length + 1 }, () => false));
    if (ref.current) ref.current.checked = false;
    setDialog(false);
  };

  const checkboxhandler = ({ e, user, index }) => {
    const isChecked = e.target.checked;

    setCheckboxStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index + 1] = isChecked;
      return newStates;
    }); 

    setParticipants(prev => 
      isChecked 
        ? [...prev, user] 
        : prev.filter(name => name !== user)
    );
  };

  const selectAllHandler = (e) => {
    const isChecked = e.target.checked;
    const allMembers = [host, ...members.map(member => member.userName)];
    
    setCheckboxStates(Array.from({ length: members.length + 1 }, () => isChecked));
    setParticipants(isChecked ? allMembers : []);
    if (ref.current) ref.current.checked = isChecked;
  };

  useEffect(() => {
    dispatch(fetchPayments({ roomId: id }));
  }, [dispatch, id]);

  useEffect(() => {
    const handleReceivePayment = () => {
      dispatch(fetchPayments({ roomId: id }));
      toast.success("New Payment Added");
    };

    socket.on("recievePayment", handleReceivePayment);
    socket.on("addPaymentFailed", () => toast.error("Fill all details!!"));
    socket.on("paymentDeleted", () => {
      dispatch(fetchPayments({ roomId: id }));
      toast.success("Payment Deleted");
    });

    return () => {
      socket.off("recievePayment", handleReceivePayment);
      socket.off("addPaymentFailed");
      socket.off("paymentDeleted");
    };
  }, [socket, dispatch, id]);

  const deleteHandler = (pId) => {
    setPaymentToDelete(pId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    socket.emit("deletePayment", { pId: paymentToDelete, id });
    setShowDeleteConfirm(false);
    setPaymentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPaymentToDelete(null);
  };

  const paymentInfoHandler = (payment) => {
    setPaymentInfo({
      by: payment.paymentBy,
      for: payment.paymentFor,
      amount: payment.amount,
      participants: payment.participants
    });
    setShowPaymentInfo(true);
  };

  return (
    <div style={{ display: expense ? "" : "none" }} className="room_chat room_expense">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this payment?</p>
            <div className="delete-confirm-actions">
              <button 
                className="delete-confirm-btn delete-confirm-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn delete-confirm-proceed"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info Dialog */}
      <div style={{ display: showPaymentInfo ? "" : "none" }} className="paymentInfo">
        <div className="paymentInfoDialog">
          <h1>Payment By: {paymentInfo.by}</h1>
          <h1>Payment For: {paymentInfo.for}</h1>
          <h1>Amount: {paymentInfo.amount}</h1>
          <div>
            <h1>Members:</h1>
            <div className="participants-list">
              {paymentInfo.participants?.map((p, i) => (
                <span key={i}>{p}{i < paymentInfo.participants.length - 1 ? ", " : ""}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setShowPaymentInfo(false)}>Back</button>
        </div>
      </div>
  
      <Toaster />
      
      {/* Add Payment Dialog */}
      <div style={{ display: dialog ? "" : "none" }} className="dialog_cont">
        <div className="dialog_main">
          <h2>Payer</h2>
          <select
            value={paymentBy}
            onChange={(e) => setPaymentBy(e.target.value)}
            required
          >
            <option value="">Payer...</option>
            <option value={host}>{host}</option>
            {members.map((member) => (
              <option key={member.userName} value={member.userName}>
                {member.userName}
              </option>
            ))}
          </select>

          <h2>Payment of</h2>
          <input
            placeholder="What did you pay for..."
            value={paymentFor}
            onChange={(e) => setPaymentFor(e.target.value)}
            type="text"
            required
          />

          <h2>Price</h2>
          <input
            placeholder="Rs. 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0.01"
            step="0.01"
            required
          />

          <h2>Payment for</h2>
          <div className="select-all-container">
            <input
              type="checkbox"
              onChange={selectAllHandler}
              id="selectAll"
            />
            <label htmlFor="selectAll">Select All</label>
          </div>

          <div className="participants-list">
            <div>
              <input
                ref={ref}
                checked={checkboxStates[0]}
                onChange={(e) => checkboxhandler({ e, user: host, index: -1 })}
                type="checkbox"
                id={`participant-${host}`}
              />
              <label htmlFor={`participant-${host}`}>{host}</label>
            </div>
            {members.map((member, index) => (
              <div key={member.userName}>
                <input
                  checked={checkboxStates[index + 1]}
                  onChange={(e) => checkboxhandler({ e, user: member.userName, index })}
                  type="checkbox"
                  id={`participant-${member.userName}`}
                />
                <label htmlFor={`participant-${member.userName}`}>{member.userName}</label>
              </div>
            ))}
          </div>

          <div className="dialog_btn">
            <button onClick={saveHandler}>Save</button>
            <button onClick={() => setDialog(false)}>Back</button>
          </div>
        </div>
      </div>

      {/* Left Panel - Payments List */}
      <div className="room_expense_left">
        <button onClick={() => setDialog(true)}>Add Payment</button>
        <div className="payments">
          {payments?.length > 0 ? (
            payments.map((payment) => (
              <div key={payment._id} className="pay">
                <div className="pay_left">
                  <h1>{payment.paymentBy}</h1>
                  <p>For {payment.paymentFor}</p>
                </div>
                <div className="pay_right">
                  <p>Rs. {payment.amount.toFixed(2)}</p>
                  {userName === host && (
                    <FontAwesomeIcon 
                      icon={faTrash} 
                      onClick={() => deleteHandler(payment._id)}
                      className="delete-icon"  
                    />
                  )}
                  <FontAwesomeIcon 
                    icon={faCircleInfo}
                    onClick={() => paymentInfoHandler(payment)} 
                    className="info-icon"
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No payments yet</p>
          )}
        </div>
      </div>

      {/* Right Panel - Liquidation */}
      <div className="room_expense_right">
        <h1>Payment Liquidation</h1>
        <div className="liquidation">
          {liqarr?.length > 0 ? (
            liqarr.map((item, index) => (
              <div key={`${item.payer}-${item.reciever}-${index}`} className="liquidation-item">
                <p className={item.payer === userName ? "self" : ""}>{item.payer}</p>
                <FontAwesomeIcon icon={faArrowRight} />
                <p>{item.amount.toFixed(2)}₹</p>
                <FontAwesomeIcon icon={faArrowRight} />
                <p className={item.reciever === userName ? "self" : ""}>{item.reciever}</p>
              </div>
            ))
          ) : (
            <p>No settlements needed - everyone is square!</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .delete-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .delete-confirm-dialog {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .delete-confirm-dialog h3 {
          margin-top: 0;
          color: #333;
        }

        .delete-confirm-dialog p {
          margin-bottom: 20px;
          color: #666;
        }

        .delete-confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .delete-confirm-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .delete-confirm-cancel {
          background-color: #f0f0f0;
          color: #333;
        }

        .delete-confirm-cancel:hover {
          background-color: #e0e0e0;
        }

        .delete-confirm-proceed {
          background-color: #ff4d4f;
          color: white;
        }

        .delete-confirm-proceed:hover {
          background-color: #ff7875;
        }

        .delete-icon {
          color: #ff4d4f;
          cursor: pointer;
          transition: color 0.2s;
        }

        .delete-icon:hover {
          color: #ff7875;
        }

        .info-icon {
          color: #1890ff;
          cursor: pointer;
          transition: color 0.2s;
        }

        .info-icon:hover {
          color: #40a9ff;
        }
      `}</style>
    </div>
  );
};

export default Expense;
