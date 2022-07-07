import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import logo from '../../assets/home-image.png';

import "./Login.css";
function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
      userAuthenticated();
  }, []);

  const login = () => {
    Axios.post("http://localhost:4000/login", {
        username: username,
        password: password,
    }).then((response) => {
        console.log(response);
        if(!response.data.auth) {
            setLoginStatus(false);
        } else {
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setLoginStatus(true);
            navigate("/HomePage");
        }
    });
  }

  const userAuthenticated = () => {
      if(localStorage.getItem("token")) {
          Axios.get("http://localhost:4000/isUserAuth", {
              headers: {
                  "x-access-token": localStorage.getItem("token"),
              },
          }).then((response) => {
              console.log(response);
              if(response.data.auth) {
                  navigate('/HomePage');
              }
          });
      } else {
          console.log("Cacc o token munnezz");
      }
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="logo">
          <img src={logo}></img>
        </div>
        <input
          type="text"
          className="login__textBox"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={login}
        >
          Login
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/Register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;