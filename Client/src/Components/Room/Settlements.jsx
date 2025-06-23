import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { liquification } from "./Liquification";
import { FiArrowRight, FiDollarSign } from 'react-icons/fi';

const Settlements = ({ members, host, userName }) => {
  const payments = useSelector((state) => state.room.payments);
  const [liqarr, setLiqarr] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalToReceive, setTotalToReceive] = useState(0);

  // Calculate settlements when payments, host or members change
  useEffect(() => {
    const calculateSettlements = () => {
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

      // Calculate totals for current user
      let owed = 0;
      let toReceive = 0;
      validLiquidation.forEach(item => {
        if (item.payer === userName) {
          owed += item.amount;
        }
        if (item.reciever === userName) {
          toReceive += item.amount;
        }
      });
      
      setTotalOwed(parseFloat(owed.toFixed(2)));
      setTotalToReceive(parseFloat(toReceive.toFixed(2)));
    };

    if (payments && payments.length > 0 && host && members) {
      calculateSettlements();
    } else {
      setLiqarr([]);
      setTotalOwed(0);
      setTotalToReceive(0);
    }
  }, [payments, host, members, userName]);

  return (
    <div className="settlements-container">
      <div className="settlements-header">
        <h2>All Settlements</h2>
      </div>

      <div className="settlements-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiArrowRight />
          </div>
          <div className="summary-content">
            <h3>You Owe</h3>
            <p className="amount">₹{totalOwed}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon incoming">
            <FiArrowRight />
          </div>
          <div className="summary-content">
            <h3>You'll Receive</h3>
            <p className="amount incoming">₹{totalToReceive}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>Net Balance</h3>
            <p className={`amount ${totalToReceive - totalOwed >= 0 ? 'incoming' : ''}`}>
              ₹{(totalToReceive - totalOwed).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="settlements-list-container">
        <h3>Settlement Details</h3>
        
        {liqarr && liqarr.length > 0 ? (
          <div className="settlements-list">
            {liqarr.map((item, index) => (
              <div 
                className={`settlement-card ${item.payer === userName ? 'outgoing' : ''} ${item.reciever === userName ? 'incoming' : ''}`} 
                key={index}
              >
                <div className="settlement-users">
                  <div className="settlement-user">
                    <span className={item.payer === userName ? 'current-user' : ''}>
                      {item.payer}
                    </span>
                  </div>
                  <div className="settlement-arrow">
                    <FiArrowRight />
                  </div>
                  <div className="settlement-user">
                    <span className={item.reciever === userName ? 'current-user' : ''}>
                      {item.reciever}
                    </span>
                  </div>
                </div>
                <div className="settlement-amount">
                  <span className="amount">₹{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-settlements">
            No settlements to show. Add some payments first.
          </div>
        )}
      </div>
    </div>
  );
};

export default Settlements; 