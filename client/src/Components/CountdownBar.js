import React from "react";
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Styles/CountdownBar.css";

const TIME_DURATION = 60;
const TIME_RESOLUTION = 50;

export default class CountDownBar extends React.Component {
    constructor() {
        super();

        this.state = {
            percentage: TIME_DURATION * TIME_RESOLUTION
        }
        this.interval = null;
        this.timeout = React.createRef(false);
    }

    componentDidMount() {
        if(!this.timeout.current) {
            this.interval = setInterval(() => {
                this.setState({
                    percentage: this.state.percentage - 1
                })
            }, 2 * 1000 / TIME_RESOLUTION);
        } else {
            clearInterval(this.interval);
        }
        this.updateTimeout();
    }
    /*
    componentDidUpdate(prevPops, prevState) {
        if(prevState.percentage !== this.state.percentage || !this.timeout) {
            let interval = null;
            if(!this.timeout.current) {
                interval = setInterval(() => {
                    this.setState({
                        percentage: this.state.percentage - 1
                    })
                }, 1000);
            } else {
                clearInterval(interval);
            }
            this.updateTimeout();
        }
    */

    updateTimeout() {
        if(this.state.percentage === 0) {
            this.timeout.current = true;
            console.log("fine");
        }        
    }

    render() {
        return(
            <div className='bar-container'>
                <ProgressBar max={TIME_DURATION * TIME_RESOLUTION} min={1} now={this.state.percentage} animated/>
            </div>            
        )
    }
}