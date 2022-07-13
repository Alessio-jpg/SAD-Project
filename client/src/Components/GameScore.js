import React from "react";
import $ from 'jquery';
import "../Styles/GameScore.css"

export default class GameScore extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            name: ""
        }

        this.id = props.id;
    }

    componentDidMount() {
        this.width = $('.single-live-screen').width();
        this.setState({
            count: this.props.count,
            name: this.props.name
        })
    }

    componentDidUpdate(prevPops, prevState) {
        if(this.props.count !== prevPops.count) {
            this.setState({
                count: this.props.count,
            })
        }

        if(this.props.name !== prevPops.name) {
            this.setState({
                name: this.props.name,
            })
        }
    }

    render() {
        return(
            <>
                <h5 className='user-name'>{this.state.name}</h5>
                <div id="score-user" className= "watch-live-container">
                    <p>{this.state.count}</p>
                </div>
            </>
        )
    }
}