import React from 'react';
import { FiUsers, FiHash, FiUser } from 'react-icons/fi';

const RoomInfo = ({ roomName, id, host, members }) => {
  return (
    <div className="room-info-container">
      <div className="room-info-section">
        <div className="info-card">
          <div className="info-icon">
            <FiHash />
          </div>
          <div className="info-content">
            <h3>Room Name</h3>
            <p>{roomName}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <FiHash />
          </div>
          <div className="info-content">
            <h3>Room Code</h3>
            <p>{id}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <FiUser />
          </div>
          <div className="info-content">
            <h3>Host</h3>
            <p>{host}</p>
          </div>
        </div>
      </div>

      <div className="members-section">
        <div className="section-header">
          <FiUsers />
          <h2>Members</h2>
        </div>
        <div className="members-list">
          {members.map((member, index) => (
            <div key={member.userName} className="member-item">
              <span className="member-number">{index + 1}</span>
              <span className="member-name">{member.userName}</span>
              {member.userName === host && (
                <span className="host-badge">Host</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
