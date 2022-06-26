import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import './HomePage.css';
import imm from '../assets/home-image.png'

function HomePage() {
  let navigate = useNavigate();
  return (
    <div className="home-area">
      <div className="home-container">
        <div className="image">
          <img src={imm}></img>
        </div>
        <div className="username">
          <p> username</p>
        </div>
        <div className="first-button">
          <button className="button-play" onClick={() => {
          navigate("/App");}}>
          Start Drawing
          </button>
        </div>
        <div className="second-button">
          <button className="button-score" onClick={() => {
          navigate("/ScoreBoard");}}>
          View ScoreBoard
          </button>
        </div>
      </div>
    </div>
  );
}
export default HomePage;