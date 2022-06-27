import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
//import { auth, db } from "../../firebase";
//import { query, collection, getDocs, where } from "firebase/firestore";
//import { useAuthState } from "react-firebase-hooks/auth";
import {SocketContext, socket} from '../../socket';
import load_gif from './../../assets/icons8-spinner.gif'
import './WaitingRoom.css';

function WaitingRoom() {
  useEffect(() => {
    socket.emit('join-queue')
    return () => socket.emit('leave-queue')
  }, []);
  let navigate = useNavigate();
  //const [user, loading, error] = useAuthState(auth);
  const [count, setCount] = useState("0");

  socket.on("update-queue-count", (value) => {
    setCount(value)
  });

  socket.on("start-game", (value) => {
    navigate("/App");
  })
  
  
  return (
    <div className="waiting-room">
        <div className="home-container">
            <div className="loading">
            
              <div class="square" id="sqr0"></div>
              <div class="square" id="sqr1"></div>
              <div class="square" id="sqr2"></div>
              <div class="square" id="sqr3"></div>
              <div class="square" id="sqr4"></div>
              <div class="square" id="sqr5"></div>
              <div class="square" id="sqr6"></div>
	          
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