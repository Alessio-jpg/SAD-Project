import React from "react"
import { BrowserRouter as HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "../View/HomePage";
import App from "../main/App";
import RegisterPage from "../View/RegisterPage";
import LoginPage from "../View/LoginPage";
import ScoreboardPage from "../View/ScoreboardPage";
import WaitingRoom from "../View/WaitingRoom";

export default class Routing extends React.Component {
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
                    <Route path="/App" element={<App />} />
                    <Route path="/ScoreBoard" element={<ScoreboardPage controller = {this.controller} />} />
                    <Route path="/WaitingRoom" element={<WaitingRoom controller = {this.controller}/>} />
                </Routes>
            </HashRouter>
        )
    }
}