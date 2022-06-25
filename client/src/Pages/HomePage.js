import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function HomePage() {
  let navigate = useNavigate();
  return (
    <div>
      THIS IS THE HOMEPAGE PAGE!
      <button
        onClick={() => {
          navigate("/App");
        }}
      >
        {" "}
        Start Drawing
      </button>
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