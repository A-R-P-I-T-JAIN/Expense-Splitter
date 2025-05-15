import React, { useEffect, useState } from "react";
import "./Home.css";
import img1 from "../../assets/g1.png";
import img2 from "../../assets/g2.png";
import img3 from "../../assets/g3.png";
import img4 from "../../assets/g4.png";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/splitter_logo.png";
import { FiUsers, FiMessageSquare, FiDollarSign, FiCheck } from 'react-icons/fi';

const Home = () => {
  const [bgc, setBgc] = useState("");
  const [fgc, setFgc] = useState("");
  const [img, setImg] = useState();
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateMain = () => {
    setTimeout(() => {
      setBgc("var(--background-light)");
      setFgc("var(--primary-color)");
      setImg(img1);
      setAnimate(true);
    }, 0);
    setTimeout(() => {
      setBgc("var(--background-light)");
      setFgc("var(--secondary-color)");
      setImg(img2);
      setAnimate(true);
    }, 2500);
    setTimeout(() => {
      setBgc("var(--background-light)");
      setFgc("var(--accent-color)");
      setImg(img3);
      setAnimate(true);
    }, 5000);
    setTimeout(() => {
      setBgc("var(--background-light)");
      setFgc("var(--primary-dark)");
      setImg(img4);
      setAnimate(true);
    }, 7500);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    updateMain();
    const intervalId = setInterval(updateMain, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const resetAnimation = () => {
      setAnimate(false);
    };

    if (animate) {
      const timerId = setTimeout(resetAnimation, 1900);
      return () => clearTimeout(timerId);
    }
  }, [animate]);

  const getStartedHandler = () => {
    navigate('/createroom');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="nav">
        <div className="nav-content">
          <img src={logo} alt="Expense Splitter Logo" className="logo" />
          <button className="btn nav-button" onClick={getStartedHandler}>
            Get Started
          </button>
        </div>
      </nav>

      <main className="hero-section" style={{ backgroundColor: bgc }}>
        <div className="hero-content">
          <div className="hero-image" style={{ backgroundColor: fgc }}>
            <img 
              className={`hero-img ${animate ? "animate_img" : ""}`} 
              src={img} 
              alt="Expense Splitter Illustration" 
            />
          </div>
          <div className="hero-text">
            <h1>
              Travel Together,{" "}
              <span style={{ color: fgc }}>Pay Together</span>
            </h1>
            <h2>Your Ultimate Expense Solution</h2>
            <p>
              Experience the joy of group travel without the financial stress.
              Try our expense splitter today and make every journey a shared
              success.
            </p>
            <button className="btn primary-button" onClick={getStartedHandler}>
              Start Splitting Expenses
            </button>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to manage your group expenses</p>
        </div>
        <div className="simple-steps">
          <div className="step">
            <div className="step-icon">
              <FiUsers />
            </div>
            <h3>Create Room</h3>
            <p>Create a room and invite your friends</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FiDollarSign />
            </div>
            <h3>Add Expenses</h3>
            <p>Record shared expenses easily</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FiMessageSquare />
            </div>
            <h3>Chat & Settle</h3>
            <p>Communicate and settle debts</p>
          </div>
        </div>
      </section>

      <footer className="simple-footer">
        <div className="footer-content">
          <p>© 2024 Expense Splitter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
