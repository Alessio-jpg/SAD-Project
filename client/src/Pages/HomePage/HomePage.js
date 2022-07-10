import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css';
import Axios from "axios";
import imm from '../../assets/home-image.png'

function HomePage() {
  let navigate = useNavigate();
  useEffect(() => {
      userLoggedIn();
  }, []); 

  Axios.defaults.withCredentials = true;


  const userLoggedIn = () => {
      Axios.get("http://localhost:4000/isLogged", {        
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((response) => {
          if(!response.data.loggedIn) {
              console.log(response);
              navigate("/");
          }
      });
  }


  return (
    <div className="home-area">
      <div className="home-container">
        <div className="logo">
          <img src={imm}></img>
        </div>
        <div className="username">
          <p>Username</p>
        </div>
        <div className="first-button">
          <button className="button-play" onClick={() => {navigate("/WaitingRoom")}}>
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