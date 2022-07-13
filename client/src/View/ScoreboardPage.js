import React from "react";
import Controller from "../Controller/Controller";
import imm from "../assets/home-image.png";
import { Link } from "react-router-dom";
import "../Styles/ScoreBoard.css";

export default class ScoreboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: [],
            score: [] 
        }

        this.controller = props.controller; //importare

        this.showWeeklyScore = this.showWeeklyScore.bind(this);
        this.showMonthlyScore = this.showMonthlyScore.bind(this);
        this.showTotalScore = this.showTotalScore.bind(this);

    }
    
    componentDidMount() {
        var element = document.getElementsByClassName('weekly-button')[0];
        element.classList.add('active');

        this.showWeeklyScore();
    }


    showWeeklyScore() {
        var usernames = [];
        var scores = [];
        this.controller.getScoreBoard("scoreW").then((data) => {
            data.forEach(element => {
                usernames.push(element.username);
                scores.push(element.scoreW);
            });
            this.setState({
                username: usernames,
                score: scores
            })
        }); 
    }


    showMonthlyScore() {
        var element = document.getElementsByClassName('weekly-button')[0];
        element.classList.remove('active');
        var usernames = [];
        var scores = [];
        this.controller.getScoreBoard("scoreM").then((data) => {
            data.forEach(element => {
                usernames.push(element.username);
                scores.push(element.scoreM);
            });
            this.setState({
                username: usernames,
                score: scores
            })
        }); 
    }

    showTotalScore() {
        var element = document.getElementsByClassName('weekly-button')[0];
        element.classList.remove('active');
        var usernames = [];
        var scores = [];
        this.controller.getScoreBoard("scoreA").then((data) => {
            data.forEach(element => {
                usernames.push(element.username);
                scores.push(element.scoreA);
            });
            this.setState({
                username: usernames,
                score: scores
            })
        }); 
    }

    render() {
        return(
            <div className="score-area">
                <div className="button-home">
                <button className="button-back">
                    <Link to="/HomePage">Back</Link>
                    </button>
                </div>
                <div className="board">
                    <div className='leaderboard'>
                        <p>ScoreBoard</p>
                    </div>

                    <div className="duration">
                        <button id="1" className="weekly-button" onClick={this.showWeeklyScore} data-id='7'>7 Days</button>
                        <button className="monthly-button"  onClick={this.showMonthlyScore} data-id='30'>30 Days</button>
                        <button className="total-button"  onClick={this.showTotalScore} data-id='0'>All-Time</button>
                    </div>
                    <div id="profile">
                        {this.state.username.map((username, index) => (
                            <div className="flex" key={index}>
                                <div className="item">
                                    <p className="position">{index}</p>             
                                </div>
                                <div className="info">
                                    <p>{username}</p>
                                </div> 
                                <div className="score">
                                    <span>{this.state.score[index]}</span>
                                </div>
                            </div>
                        ))}     
                    </div>
                </div>
            </div>            
        )
    }
}