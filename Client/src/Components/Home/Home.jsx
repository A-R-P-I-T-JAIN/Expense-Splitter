import React, { useEffect, useState } from "react";
import "./Home.css";
import img1 from "../../assets/g1.png";
import img2 from "../../assets/g2.png";
import img3 from "../../assets/g3.png";
import img4 from "../../assets/g4.png";
import step1img from '../../assets/step1img.png'
import step2img from '../../assets/step2img.png'
import step3img from '../../assets/step3img.png'
import step4img from '../../assets/step4img.png'
import step5img from '../../assets/step5img.png'
import { useNavigate } from "react-router-dom";
import logo from "../../assets/splitter_logo.png"

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
    // Simulate initial loading
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
          <button className="btn" onClick={getStartedHandler}>
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
            <button className="btn cta-button" onClick={getStartedHandler}>
              Start Splitting Expenses
            </button>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-content">
            <h2>Start Using the Website</h2>
            <p>Expense Splitter is the easiest way to share bills with friends. No registration, no password, totally free.</p>
          </div>
          <div className="feature-image">
            <img src={step1img} alt="Getting Started" />
          </div>
        </div>

        <div className="feature-card reverse">
          <div className="feature-content">
            <h2>Create a Room</h2>
            <p>Rooms help group members organize their expenses and provide a dedicated space for collaboration.</p>
          </div>
          <div className="feature-image">
            <img src={step2img} alt="Create Room" />
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-content">
            <h2>Add Expenses</h2>
            <p>Easily record and track shared expenses within the room, simplifying expense management.</p>
          </div>
          <div className="feature-image">
            <img src={step3img} alt="Add Expenses" />
          </div>
        </div>

        <div className="feature-card reverse">
          <div className="feature-content">
            <h2>Settle Debts and Chat</h2>
            <p>Streamline debt settlement and facilitate communication among group members.</p>
          </div>
          <div className="feature-image">
            <img src={step4img} alt="Settle Debts" />
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-content">
            <h2>View Reports and History</h2>
            <p>Access reports and transaction history to keep track of expenses and resolve any disputes.</p>
          </div>
          <div className="feature-image">
            <img src={step5img} alt="View Reports" />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Splitting Expenses?</h2>
          <p>Join thousands of users who trust Expense Splitter for their group expenses.</p>
          <button className="btn cta-button" onClick={getStartedHandler}>
            Get Started Now
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-line"></div>
          <p>© 2024 Expense Splitter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
