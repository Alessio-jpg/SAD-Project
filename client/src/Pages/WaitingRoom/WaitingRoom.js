import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
//import { Socket } from "socket.io-client";
//import { auth, db } from "../../firebase";
//import { query, collection, getDocs, where } from "firebase/firestore";
//import { useAuthState } from "react-firebase-hooks/auth";
import {SocketContext, socket} from '../../socket';
import load_gif from './../../assets/icons8-spinner.gif'
import './WaitingRoom.css';

function WaitingRoom() {
  useEffect(() => {
    socket.emit('join-queue', localStorage.getItem("token"))
    return () => socket.emit('leave-queue')
  }, []);
  let navigate = useNavigate();
  //const [user, loading, error] = useAuthState(auth);
  const [count, setCount] = useState("0");

  socket.on("update-queue-count", (value) => {
    setCount(value)
  });

  socket.on("start_game", (value) => {
    console.log(value);
    localStorage.setItem("players_ingame", JSON.stringify(value));
    navigate("/App");
  })
  
  return (
    <div className="waiting-room">
        <div className="home-container">
            <div className="loading">
            
              <div className="square" id="sqr0"></div>
              <div className="square" id="sqr1"></div>
              <div className="square" id="sqr2"></div>
              <div className="square" id="sqr3"></div>
              <div className="square" id="sqr4"></div>
              <div className="square" id="sqr5"></div>
              <div className="square" id="sqr6"></div>
	          
            </div>
        
          <div className="waiting-text">
              <p> There {((count === 1) ? 'is' : 'are')} <b>{count}</b> {((count === 1) ? 'player' : 'players')} connected</p>
              <br></br>
              <p> Waiting . . .</p>
          </div>
        </div>
    </div>
  );
}
export default WaitingRoom;