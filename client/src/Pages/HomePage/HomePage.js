import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { socket} from '../../socket';
import './HomePage.css';
import imm from '../../assets/home-image.png'

function HomePage() {
  let navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  const joinQueue = () => {
    try {
      socket.emit("join-queue");
      navigate("/WaitingRoom");
    } catch (err) {
      console.error(err);
      alert("An error occured while joining the game queue");
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="home-area">
      <div className="home-container">
        <div className="logo">
          <img src={imm}></img>
        </div>
        <div className="username">
          <p> {name}</p>
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