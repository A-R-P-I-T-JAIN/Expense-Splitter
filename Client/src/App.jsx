import { useState, useEffect } from 'react';
import './App.css';
import Home from './Components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './Components/CreateRoom/CreateRoom';
import Room from './Components/Room/Room';
import io from 'socket.io-client';
import AnimatedCursor from 'react-animated-cursor';

// const socket = io('http://localhost:3000');
const socket = io();
// const socket = io('https://expense-splitter.onrender.com');

function App() {
  const [showCursor, setShowCursor] = useState(window.innerWidth >= 600);

  useEffect(() => {
    const handleResize = () => {
      setShowCursor(window.innerWidth >= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {showCursor && (
        <AnimatedCursor
          innerSize={8}
          outerSize={50}
          color='254, 6, 105'
          outerAlpha={0.4}
          innerScale={0.7}
          outerScale={2}
          clickables={[
            'a',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'input[type="image"]',
            'label[for]',
            'select',
            'textarea',
            'button',
            '.link',
          ]}
        />
      )}
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createroom' element={<CreateRoom socket={socket} />} />
          <Route path='/room/:id' element={<Room socket={socket} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
