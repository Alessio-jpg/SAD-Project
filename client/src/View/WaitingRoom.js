import React from "react";
import "../Styles/WaitingRoom.css"
import { Navigate } from "react-router-dom";

export default class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            count: 0,
            isStart: false
        }
        
        this.controller = props.controller; 
        this.controller.update_queue_count();
        this.controller.start_game(); 
    }
    
    componentDidMount() {
        localStorage.removeItem("players_ingame");
        this.controller.enqueue();
        this.controller.subscribeLobbyObserve(this.setCount.bind(this));

        this.controller.subscribeIsStartObserve(this.setIsStart.bind(this));
        /*
        const full = this.controller.getIsStart();
        this.setState({
            isStart: full
        })
        */
    }
    
    
    componentWillUnmount() {
        console.log("FOCUS?")
        //this.controller.dequeue();
        this.controller.unsubscribeLobbyObserve();
        this.controller.unsubscribeIsStartObserve();
    }
    
    
    setCount(val) {
        this.setState({
            count: val
        });
    }
    setIsStart(val) {
        this.setState({
            isStart: val
        });
    }
    
    render() {
        return (
            <>
            {this.state.isStart && <Navigate to="/GamePage" replace />}
            <div className="waiting-room">
            <div className="home-container">
            <div className="loading">
            
            <div className="square" id="sqr0"></div>
            <div className="square" id="sqr1"></div>
            <div className="square" id="sqr2"></div>
            <div className="square" id="sqr3"></div>
            <div className="square" id="sqr4"></div>
            <div className="square" id="sqr5"></div>
            <div className="square" id="sqr6"></div>
            
            </div>
            
            <div className="waiting-text">
            <p> There {((this.state.count === 1) ? 'is' : 'are')} <b>{this.state.count}</b> {((this.state.count === 1) ? 'player' : 'players')} connected</p>
            <br></br>
            <p> Waiting . . .</p>
            </div>
            </div>
            </div>
            </>
            );
        }
    }