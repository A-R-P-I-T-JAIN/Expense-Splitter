import React, { useEffect, useState } from "react";
import "./Home.css";
import img1 from "../../assets/g1.png";
import img2 from "../../assets/g2.png";
import img3 from "../../assets/g3.png";
import img4 from "../../assets/g4.png";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { 
  FiUsers, 
  FiMessageSquare, 
  FiDollarSign, 
  FiArrowRight, 
  FiPlay, 
  FiCheck,
  FiCreditCard,
  FiSmile
} from 'react-icons/fi';

const Home = () => {
  const [currentImg, setCurrentImg] = useState(img1);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Start image cycling
    const images = [img1, img2, img3, img4];
    let currentIndex = 0;
    
    const cycleImages = () => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImg(images[currentIndex]);
      setAnimate(true);
    };
    
    // Initial cycle after a delay
    const initialTimeout = setTimeout(cycleImages, 2000);
    
    // Set up interval for cycling
    const intervalId = setInterval(cycleImages, 2000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const resetAnimation = () => {
      setAnimate(false);
    };

    if (animate) {
      const timerId = setTimeout(resetAnimation, 1000);
      return () => clearTimeout(timerId);
    }
  }, [animate]);

  const getStartedHandler = () => {
    navigate('/createroom');
  };

  // if (isLoading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="home-container modern-design">
      {/* Background decorations */}
      <div className="background-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        
        <div className="floating-element float-1"></div>
        <div className="floating-element float-2"></div>
        <div className="floating-element float-3"></div>
        <div className="floating-element float-4"></div>
      </div>

      <nav className="nav">
        <div className="nav-content">
          <div className="logo-wrapper" onClick={getStartedHandler}>
            <img src={logo} alt="Expense Splitter Logo" className="logo-img" />
            <span className="logo-text">Expense Splitter</span>
          </div>
          
          <div className="nav-links">
            <button className="btn nav-button" onClick={getStartedHandler}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Split Expenses
              <span className="gradient-text">Stay Connected</span>
            </h1>
            <p className="hero-description">
              Create groups, split bills effortlessly, and chat with friends.
              The easiest way to manage shared expenses and keep everyone in the loop.
            </p>
            <div className="hero-actions">
              <button className="btn primary-button action-button" onClick={getStartedHandler}>
                Start Splitting Now
                <FiArrowRight className="button-icon" />
              </button>
            </div>

            <div className="feature-pills">
              <div className="feature-pill">
                <FiUsers className="pill-icon" />
                <span>Group Management</span>
              </div>
              <div className="feature-pill">
                <FiDollarSign className="pill-icon" />
                <span>Smart Splitting</span>
              </div>
              <div className="feature-pill">
                <FiMessageSquare className="pill-icon" />
                <span>Group Chat</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              className={`hero-img ${animate ? "animate_img" : ""}`} 
              src={currentImg} 
              alt="Expense Splitter Illustration" 
            />
          </div>
        </div>
      </main>

      <section className="features-section" id="features">
        <div className="section-header">
          <h2>How It Works</h2>
        </div>
        <div className="simple-steps">
          <div className="step">
            <div className="step-icon">
              <FiUsers />
            </div>
            <div className="step-number">1</div>
            <h3>Create Group</h3>
            <p>Start by creating a group and inviting all your friends to join</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FiDollarSign />
            </div>
            <div className="step-number">2</div>
            <h3>Add Expenses</h3>
            <p>Record all your shared expenses with just a few taps</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FiCreditCard />
            </div>
            <div className="step-number">3</div>
            <h3>Split Bills</h3>
            <p>Our smart algorithm calculates who owes what to whom</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FiMessageSquare />
            </div>
            <div className="step-number">4</div>
            <h3>Chat & Settle</h3>
            <p>Communicate in real-time and settle debts easily</p>
          </div>
        </div>
        
        <div className="features-cta">
          <h3>Ready to simplify your group expenses?</h3>
          <button className="btn primary-button" onClick={getStartedHandler}>
            Get Started Now <FiArrowRight />
          </button>
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
