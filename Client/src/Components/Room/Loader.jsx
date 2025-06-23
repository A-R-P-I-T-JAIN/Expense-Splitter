import React from 'react';

const Loader = () => {
  return (
    <div className="modern-loader-container">
      <div className="modern-loader">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      <div className="loader-text">Loading...</div>
      <style jsx="true">{`
        .modern-loader-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          position: relative;
          z-index: 10;
          gap: 20px;
        }
        
        .modern-loader {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .loader-circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #10b981);
          animation: pulse 1.5s infinite ease-in-out both;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
        }
        
        .loader-circle:nth-child(1) {
          animation-delay: -0.45s;
        }
        
        .loader-circle:nth-child(2) {
          animation-delay: -0.3s;
        }
        
        .loader-circle:nth-child(3) {
          animation-delay: -0.15s;
        }
        
        .loader-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.5px;
          background: linear-gradient(to right, #3b82f6, #10b981);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: fade 2s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
        }
        
        @keyframes fade {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
