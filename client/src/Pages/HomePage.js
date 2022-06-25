import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import './HomePage.css';

function HomePage() {
  let navigate = useNavigate();
  return (
    <div>
      THIS IS THE HOMEPAGE PAGE!
      <button className="button-play" onClick={() => {
        navigate("/App");}}>
      Start Drawing</button>
      <button
        onClick={() => {
          navigate("/ScoreBoard");
        }}
      >
        {" "}
        View ScoreBoard
      </button>
    </div>
  );
}

export default HomePage;