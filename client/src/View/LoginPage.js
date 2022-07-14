import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/home-image.png';
import "../Styles/Login.css";
import Controller from "../Controller/Controller";
import { Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            password: '',
            userLogged: false,
            showModal: false,
        }
        
        this.controller = props.controller; //importare

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.login = this.login.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

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

    handleShow() {
        this.setState({
            showModal: true,
        })
    }

    handleClose() {
        this.setState({
            showModal: false,
        })
    }

    async login() {
        this.message = await this.controller.login(this.state.username, this.state.password);
        const auth = this.controller.getIsLogged();
        this.setState({
            userLogged: auth,
        })
        console.log(this.state.userLogged);
        this.handleShow();
    }

    render() {
        return (
            <>
            {this.state.userLogged && <Navigate to="/HomePage" replace />}
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Failed</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="login">
                <div className="login__container">
                <div className="logo">
                    <img src={logo} />
                </div>
                <input
                    type="text"
                    className="user__textBox"
                    value={this.state.username}
                    onChange={(e) => this.setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    className="password__textBox"
                    value={this.state.password}
                    onChange={(e) => this.setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    className="login__btn"
                    onClick={this.login}
                    data-toggle="modal"
                >
                    Login
                </button>
                <div>
                    Don't have an account? <Link to="/Register">Register</Link> now.
                </div>
                </div>
            </div>
            </>
        );
    }
}