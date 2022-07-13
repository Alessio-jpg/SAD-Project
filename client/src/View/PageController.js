import React from "react"
import { BrowserRouter as HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import ScoreboardPage from "./ScoreboardPage";
import GamePage from "./GamePage";
import WaitingRoom from "./WaitingRoom";

export default class PageController extends React.Component {
    constructor(props) {
        super(props);
        this.controller = props.controller;
        console.log("instanzio routing");
    }

    render() {
        return(
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LoginPage controller = {this.controller} />} />
                    <Route path="/HomePage" element={<HomePage />} />
                    <Route path="/Register" element={<RegisterPage controller = {this.controller}/>} />
                    <Route path="/GamePage" element={<GamePage controller = {this.controller}/>} />
                    <Route path="/ScoreBoard" element={<ScoreboardPage controller = {this.controller} />} />
                    <Route path="/WaitingRoom" element={<WaitingRoom controller = {this.controller}/>} />
                </Routes>
            </HashRouter>
        )
    }
}