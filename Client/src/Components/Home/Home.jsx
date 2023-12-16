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
  const[animate,setAnimate] = useState(false)
  const navigate = useNavigate();

  const updateMain = () => {
    setTimeout(() => {
      setBgc("#bff5dd");
      setFgc("#23de93");
      setImg(img1)
      setAnimate(true)
    }, 0);
    setTimeout(() => {
      setBgc("#f3a4d4");
      setFgc("#f72ca6");
      setImg(img2)
      setAnimate(true)
    }, 2500);
    setTimeout(() => {
      setBgc("#91b4e6");
      setFgc("#1f78f6");
      setImg(img3)
      setAnimate(true)
    }, 5000);
    setTimeout(() => {
      setBgc("#eedda9");
      setFgc("#ebb618");
      setImg(img4)
      setAnimate(true)
    }, 7500);
  };

  useEffect(() => {
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
    navigate('/createroom')
  }

  return (
    <div className="home_cont">

      <div className="nav">
        <img src={logo} alt="" />
        <button onClick={() => getStartedHandler()} >Get Started</button>
      </div>

      <div className="home_main" style={{ backgroundColor: `${bgc}` }}>
        <div className="home_main_left" style={{ backgroundColor: `${fgc}` }}>
          <img className={animate ? "animate_img" : ""} src={img} alt="" />
        </div>
        <div className="home_main_right">
          <h1>
            Travel Together,{" "}
            <span style={{ color: `${fgc}` }}>Pay Together</span>
          </h1>
          <h2>Your Ultimate Expense Solution</h2>
          <p>
            "Experience the joy of group travel without the financial stress.
            Try our expense splitter today and make every journey a shared
            success."
          </p>
        </div>
      </div>

      {/* step 1 */}

      <div className="step1">
        <div className="step1_left">
            <h1>Start Using the Website</h1>
            <p>Expense Splitter is the easiest way to share bills with friends. No registration, no password, totally free.</p>
        </div>
        <div className="step1_right">
            <img src={step1img} alt="" />
        </div>
      </div>

      {/* step 2 */}
      <div className="step2 step1">
        <div className="step2_left step1_right">
            <img src={step2img} alt="" />
        </div>
        <div className="step2_right step1_left">
            <h1>Create a Room</h1>
            <p>Rooms help group members organize their expenses and provide a dedicated space for collaboration.</p>
        </div>
      </div>

      {/* step3 */}
      <div className="step1 step3">
        <div className="step1_left step3_left">
            <h1>Add Expenses</h1>
            <p>Easily record and track shared expenses within the room, simplifying expense management.</p>
        </div>
        <div className="step1_right">
            <img src={step3img} alt="" />
        </div>
      </div>

      {/* step4 */}
      <div className="step4 step1">
        <div className="step4_left step1_right">
            <img src={step4img} alt="" />
        </div>
        <div className="step4_right step1_left">
            <h1>Settle Debts and Chat</h1>
            <p>Streamline debt settlement and facilitate communication among group members.</p>
        </div>
      </div>

      {/* step5 */}
      <div className="step1">
        <div className="step1_left step5_left">
            <h1>View Reports and History</h1>
            <p>Access reports and transaction history to keep track of expenses and resolve any disputes.</p>
        </div>
        <div className="step1_right">
            <img src={step5img} alt="" />
        </div>
      </div>

      {/* get started */}
      <div className="getstarted">
        <button onClick={() => getStartedHandler()} >Get Started</button>
      </div>

      {/* footer */}
      <div className="footer">
        <div className="footer_line"></div>
        <p>CopyRight @2023 Arpit Jain</p>
      </div>

    </div>
  );
};

export default Home;
