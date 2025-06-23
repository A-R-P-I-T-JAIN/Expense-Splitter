import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/roomSlice";
import { liquification } from "./Liquification";
import { FiPlus, FiTrash2, FiInfo, FiX, FiCheck, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const Expense = ({ socket, members, host, id, userName }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const payments = useSelector((state) => state.room.payments);

  const [showAddPayment, setShowAddPayment] = useState(false);
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
    setShowAddPayment(false);
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
    <div className="expense-container">
      <Toaster position="top-right" />
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this payment?</p>
            <div className="modal-actions">
              <button 
                className="btn secondary"
                onClick={cancelDelete}
              >
                <FiX /> Cancel
              </button>
              <button 
                className="btn danger"
                onClick={confirmDelete}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info Dialog */}
      {showPaymentInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Payment Details</h2>
            <div className="payment-info-grid">
              <div className="info-item">
                <label>Paid By</label>
                <p>{paymentInfo.by}</p>
              </div>
              <div className="info-item">
                <label>Payment For</label>
                <p>{paymentInfo.for}</p>
              </div>
              <div className="info-item">
                <label>Amount</label>
                <p>₹{paymentInfo.amount}</p>
              </div>
              <div className="info-item full-width">
                <label>Participants</label>
                <div className="participants-list">
                  {paymentInfo.participants?.map((participant, index) => (
                    <span key={index} className="participant-tag">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn primary"
                onClick={() => setShowPaymentInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Dialog */}
      {showAddPayment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Payment</h2>
            <div className="form-group">
              <label>Payment For</label>
              <input
                type="text"
                value={paymentFor}
                onChange={(e) => setPaymentFor(e.target.value)}
                placeholder="e.g., Dinner, Movie tickets"
              />
            </div>
            <div className="form-group">
              <label>Paid By</label>
              <select
                value={paymentBy}
                onChange={(e) => setPaymentBy(e.target.value)}
              >
                <option value="">Select who paid</option>
                <option value={host}>{host} (Host)</option>
                {members.map((member) => (
                  <option key={member.userName} value={member.userName}>
                    {member.userName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Participants</label>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={selectAllHandler}
                  ref={ref}
                />
                Select All
              </div>
              <div className="participants-grid">
                {host && (
                  <div className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checkboxStates[1]}
                      onChange={(e) => checkboxhandler({ e, user: host, index: 0 })}
                    />
                    {host} (Host)
                  </div>
                )}
                {members.map((member, index) => (
                  <div className="checkbox-label" key={member.userName}>
                    <input
                      type="checkbox"
                      checked={checkboxStates[index + 2]}
                      onChange={(e) =>
                        checkboxhandler({ e, user: member.userName, index: index + 1 })
                      }
                    />
                    {member.userName}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn secondary"
                onClick={() => setShowAddPayment(false)}
              >
                <FiX /> Cancel
              </button>
              <button 
                className="btn primary"
                onClick={saveHandler}
                disabled={!paymentBy || !paymentFor || !amount || participants.length === 0}
              >
                <FiCheck /> Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="expense-header">
        <h2>Expense Manager</h2>
      </div>

      <div className="expense-content">
        <div className="payments-section">
          <div className="section-actions">
            <h3><FiDollarSign /> Payments</h3>
            <button 
              className="add-payment-btn"
              onClick={() => setShowAddPayment(true)}
            >
              <FiPlus /> Add Payment
            </button>
          </div>
          
          {payments && payments.length > 0 ? (
            <div className="payments-list">
              {payments.map((payment) => (
                <div className="payment-card" key={payment._id}>
                  <div className="payment-info">
                    <h4>{payment.paymentFor}</h4>
                    <p>
                      Paid by: <strong>{payment.paymentBy}</strong>
                    </p>
                    <p>
                      Amount: <span className="amount">₹{payment.amount}</span>
                    </p>
                  </div>
                  <div className="payment-actions">
                    <button
                      className="btn icon"
                      onClick={() => paymentInfoHandler(payment)}
                      aria-label="View payment details"
                    >
                      <FiInfo />
                    </button>
                    {(userName === host || userName === payment.paymentBy) && (
                      <button
                        className="btn icon"
                        onClick={() => deleteHandler(payment._id)}
                        aria-label="Delete payment"
                      >
                        <FiTrash2 className="delete-icon" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-payments">
              No payments added yet. Click "Add Payment" to get started.
            </div>
          )}
        </div>

        <div className="liquidation-section">
          <h3><FiArrowRight /> Settlements</h3>
          {liqarr && liqarr.length > 0 ? (
            <div className="liquidation-list">
              {liqarr.map((item, index) => (
                <div className="liquidation-card" key={index}>
                  <div className="liquidation-info">
                    <p>
                      <span className={item.payer === userName ? 'current-user' : 'payer'}>
                        {item.payer}
                      </span>
                      {' '} should pay {' '}
                      <span className={item.reciever === userName ? 'current-user' : 'receiver'}>
                        {item.reciever}
                      </span>
                    </p>
                    <p>
                      Amount: <span className="amount">₹{item.amount}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-liquidations">
              No settlements to show. Add some payments first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expense;