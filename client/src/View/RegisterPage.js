import React from "react";
import "../Styles/Register.css";
import { Link } from "react-router-dom";
import Controller from "../Controller/Controller";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            showModal: false,
        }

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.register = this.register.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
   
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

    register() {
        this.controller.register(this.state.username, this.state.password);
        this.handleShow();
    }


    render() {
        return(
            <>
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Successful Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>Great Username</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      <Link className="login-reg" to="/">Login</Link>
                    </Button>
                </Modal.Footer>
            </Modal>
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
          </>
        );
    }
}