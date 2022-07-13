import React from "react";
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Styles/CountdownBar.css";

export default class CountDownBar extends React.Component {
    constructor() {
        super();

        this.state = {
            percentage: 30
        }

        this.timeout = React.createRef(false);
    }

    componentDidMount() {
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
    }

    updateTimeout() {
        if(this.state.percentage === 0) {
            this.timeout.current = true;
            console.log("fine");
        }        
    }

    render() {
        return(
            <div className='bar-container'>
                <ProgressBar max={30} min={1} now={this.state.percentage} animated/>
            </div>            
        )
    }
}