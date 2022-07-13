import React from "react";
import "../Styles/Register.css";
import { Link } from "react-router-dom";
import Controller from "../Controller/Controller";

export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        }

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.register = this.register.bind(this);
   
        this.controller = props.controller; //importare
    }

    setUsername(username) {
        this.setState({
            username: username
        })
    }

    setPassword(password) {
        this.setState({
            password: password
        })
    }

    register() {
        this.controller.register(this.state.username, this.state.password);
    }


    render() {
        return(
            <div className="register">
            <div className="register__container">
              <input
                type="text"
                className="register__textBox"
                value={this.state.username}
                onChange={(e) => this.setUsername(e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="password"
                className="register__textBox"
                value={this.state.password}
                onChange={(e) => this.setPassword(e.target.value)}
                placeholder="Password"
              />
              <button className="register__btn" onClick={this.register}>
                Register
              </button>
              <div>
                Already have an account? <Link to="/">Login</Link> now.
              </div>
            </div>
          </div>
        );
    }
}