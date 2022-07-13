import React from "react";
import $ from 'jquery';
import "../Styles/GameScore.css"

export default class GameScore extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0
        }

        this.name = props.name;

        this.name = props.name;
        this.id = props.id;
    }

    componentDidMount() {
        this.width = $('.single-live-screen').width();
        this.setState({
            count: this.props.count,
        })
    }

    componentDidUpdate(prevPops, prevState) {
        if(this.props.count !== prevPops.count) {
            this.setState({
                lines: this.props.count,
            })
        }
    }

    render() {
        return(
            <>
                <h5 className='user-name'>{this.name}</h5>
                <div id="score-user" className= "watch-live-container">
                    <p>{this.state.count}</p>
                </div>
            </>
        )
    }
}