import React from "react";
import "../Styles/MatchedWord.css";

export default class MatchedWord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matchedWord: "",
        }

    }

    componentDidMount() {
        this.setState({
            matchedWord: this.props.matchedWord,
        })
    }

    componentDidUpdate(prevPops, prevState) {
        if(this.props.matchedWord !== prevPops.matchedWord) {
            this.setState({
                matchedWord: this.props.matchedWord,
            })
        }
    }
    
    render() {
        return(
            <div className='matchedWord-container'>
                <div className='matchedWord'>
                    <p>{this.state.matchedWord}</p>
                </div>
            </div>            
        )
    }
}

// <p className='legend'>Hai disegnato</p>