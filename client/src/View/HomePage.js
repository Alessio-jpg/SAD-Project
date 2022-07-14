import React from "react";
import imm from '../assets/home-image.png'
import { Link } from "react-router-dom";
import '../Styles/HomePage.css';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.controller = props.controller;
    }

    render() {
        return (
            <div className="home-area">
                <div className="home-container">
                <div className="logo">
                    <img src={imm}></img>
                </div>
                <div className="username">
                    <p>{this.controller.getUsername()}</p>
                </div>
                <div className="first-button">
                    <Link className="play-button" to="/WaitingRoom">
                        <button id="play" className="button-play">Start Game</button>
                    </Link>
                </div>
                <div className="second-button">
                    <Link to="/ScoreBoard">
                        <button className="button-score">View ScoreBoard</button>
                    </Link>
                </div>
                </div>
            </div>
        );
    }
}