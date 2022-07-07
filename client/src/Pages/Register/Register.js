import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/home-image.png';
import Axios from "axios";
import "./Register.css";

function Register() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordeReg, setPasswordReg] = useState("");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:4000/register", {
        username: usernameReg,
        password: passwordeReg,
    }).then((response) => {
        console.log(response);
    });
  };
  
  return (
    <div className="register">
      <div className="register__container">
        <div className="logo">
          <img src={logo}></img>
        </div>
        <input
          type="text"
          className="register__textBox"
          value={usernameReg}
          onChange={(e) => setUsernameReg(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="password"
          className="register__textBox"
          value={passwordeReg}
          onChange={(e) => setPasswordReg(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;