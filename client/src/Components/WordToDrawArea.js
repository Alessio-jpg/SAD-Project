import React from "react"
import "../Styles/WordToDraw.css";


export default class WordToDrawArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstWord: '',
            secondWord: '',
        }

    }

    componentDidMount() {
        this.setState({
            firstWord: this.props.firstWord,
            secondWord: this.props.secondWord
        })
        console.log("aggiorno la F+secondWord");
    }


    componentDidUpdate(prevPops, prevState) {
        if(this.props.firstWord !== prevPops.firstWord || this.props.secondWord !== prevPops.secondWord ) {
            this.setState({
                firstWord: this.props.firstWord,
                secondWord: this.props.secondWord
            })
        }
    }

    render() {
        return(
            <div className='words-area'>
                <div className="word-content">
                    <div className='words-container'>
                        <div className='first-word'>
                            <p>{this.state.firstWord.replaceAll("_"," ")}</p>
                        </div>
                        <div className='choose'>
                            <p>or</p>
                        </div>
                        <div className='second-word'>
                            <p>{this.state.secondWord.replaceAll("_"," ")}</p>
                        </div>
                    </div>
                </div>
            </div>            
        )
    }
}