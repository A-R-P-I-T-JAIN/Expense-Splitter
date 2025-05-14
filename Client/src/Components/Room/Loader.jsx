import React from 'react';

const loaderContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
};

const loaderStyle = {
  border: '6px solid #f3f3f3',
  borderTop: '6px solid #007bff', // primary color
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  animation: 'spin 1s linear infinite',
};

const Loader = () => {
  return (
    <div style={loaderContainerStyle}>
      <div style={loaderStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
