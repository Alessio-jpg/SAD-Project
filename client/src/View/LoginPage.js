import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/home-image.png';
import "../Styles/Login.css";
import Controller from "../Controller/Controller";
import { Navigate } from "react-router-dom";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            password: '',
            userLogged: false
        }
        
        this.controller = props.controller; //importare

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.login = this.login.bind(this);

    }


    async componentDidMount() {
        await this.controller.userAuthenticated();
        const auth = this.controller.getIsLogged();
        this.setState({
            userLogged: auth
        });
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

    async login() {
        await this.controller.login(this.state.username, this.state.password);
        const auth = this.controller.getIsLogged();
        this.setState({
            userLogged: auth,
        })
        console.log(this.state.userLogged);
    }

    render() {
        return (
            <>
            {this.state.userLogged && <Navigate to="/HomePage" replace />}
            <div className="login">
                <div className="login__container">
                <div className="logo">
                    <img src={logo}></img>
                </div>
                <input
                    type="text"
                    className="login__textBox"
                    value={this.state.username}
                    onChange={(e) => this.setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    className="login__textBox"
                    value={this.state.password}
                    onChange={(e) => this.setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    className="login__btn"
                    onClick={this.login}
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
            </>
        );
    }
}