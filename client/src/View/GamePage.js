import React from "react";
import CountDownBar from "../Components/CountdownBar";
import WordToDrawArea from "../Components/WordToDrawArea";
import DrawingArea from "../Components/DrawingArea";
import MatchedWord from "../Components/MatchedWord";
import WatchLive from "../Components/WatchLive";
import $ from 'jquery';
import '../Styles/App.css'; 
import GameScore from "../Components/GameScore";
import { Link } from "react-router-dom";

export default class GamePage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      name: [],
      id: [],
      line1: [],
      line2: [],
      line3: [],
      line4: [],
      wordToDrow1: "",
      wordToDrow2: "",
      matchedWord: "",
      gameCount: 0,
    }
    
    this.controller = props.controller;
    
    this.player_data = JSON.parse(localStorage.getItem("players_ingame"));
  }
  
  
  componentDidMount() {
    //this.controller.neural_guess();
    this.controller.subscribeWordToDrow1(this.setWordToDrow1.bind(this));
    this.controller.subscribeWordToDrow2(this.setWordToDrow2.bind(this));
    this.controller.subscribeMatchedWord(this.setMatchedWord.bind(this));
    this.controller.subscribeWatchLive1(this.setLine1.bind(this));
    this.controller.subscribeWatchLive2(this.setLine2.bind(this));
    this.controller.subscribeWatchLive3(this.setLine3.bind(this));
    this.controller.subscribeWatchLive4(this.setLine4.bind(this));
    this.controller.subscribePartecipation(this.setGameCount.bind(this));
    
    var usernames = [this.controller.getUsername()]
    var ids = [this.controller.getPlayerID()]

    console.log(ids)
    
    this.player_data.forEach(element => {
      if(!(element["id"] == ids[0])) {
        usernames.push(element["username"]);
        ids.push(element["id"]);
      }
    });
    
    this.setState({
      name: usernames,
      id: ids
    });
    console.log("USERNAMES");
    console.log(usernames);
    this.scaleWidth();
    
    this.controller.end_game();
    //this.controller.other_player_lines_update(this.state.id); //forse non va
  }
  
  componentWillUnmount() {
    this.controller.unsubscribeWordToDrow1();
    this.controller.unsubscribeWordToDrow2();
    this.controller.unsubscribeMatchedWord();
    this.controller.unsubscribeWatchLive1();
    this.controller.unsubscribeWatchLive2();
    this.controller.unsubscribeWatchLive3();
    this.controller.unsubscribeWatchLive4();
    this.controller.unsubscribePartecipation();
  }
  
  setWordToDrow1(word) {
    this.setState({
      wordToDrow1: word
    })
  }
  
  setWordToDrow2(word) {
    this.setState({
      wordToDrow2: word
    })
  }
  
  setMatchedWord(word) {
    this.setState({
      matchedWord: word
    })
  }
  
  setLine1(line) {
    this.setState({
      line1: line
    })
  }
  
  setLine2(line) {
    this.setState({
      line2: line
    })
  }
  
  setLine3(line) {
    this.setState({
      line3: line
    })
  }
  
  setLine4(line) {
    this.setState({
      line4: line
    })
  }

  setGameCount(count) {
    this.setState({
      gameCount: count
    })
  }
  
  scaleWidth() {
    var widthDrawingArea = $('.drawing-area').width();
    var heightDrawingArea = $('.drawing-area').height();
    
    if(widthDrawingArea < heightDrawingArea) {
      $('.drawing-area').height($('.drawing-area').width());
    } else {
      $('.drawing-area').width($('.drawing-area').height());
    }
    
    var widthLiveArea = $('.single-live-screen').width();
    var heightLiveArea = $('.single-live-screen').height();
    if(widthLiveArea < heightLiveArea) {
      $('.single-live-screen').height($('.single-live-screen').width());
    } else {
      $('.single-live-screen').width($('.single-live-screen').height());
    }
  }
  
  render() {
    return(
      <>
      <div id="winning_screen" className="overlay">
        <div className="overlay-content">
            Hai Vinto!
            <div className="exit-button">
                <Link to="/HomePage">
                    <button className="button-end-game">Exit</button>
                </Link>
            </div>
        </div>
      </div>
      <div className='main-container'>
      <div className="first-colum">
        <div className='live-drawing-area'>
        <div className='single-live-screen'>
        < GameScore id = {this.state.id[0]} name = {this.state.name[0]} count = {this.state.gameCount}/>
        </div>
        <div className='single-live-screen'>
        < WatchLive id = {this.state.id[1]} name = {this.state.name[1]} lines = {this.state.line2}/>
        </div>
        <div className='single-live-screen'>
        < WatchLive id = {this.state.id[2]} name = {this.state.name[2]} lines = {this.state.line3}/>
        </div>
        <div className='single-live-screen'>
        < WatchLive id = {this.state.id[3]} name = {this.state.name[3]} lines = {this.state.line4}/>
        </div>
        </div>
        < CountDownBar />
      </div>
      <div className="second-colum">
        <WordToDrawArea firstWord = {this.state.wordToDrow1} secondWord = {this.state.wordToDrow2} />
        < MatchedWord matchedWord = {this.state.matchedWord}/>
      </div>
      <div className="third-colum">
          <div className="App drawing-area">
            <DrawingArea controller = {this.controller} onClearLines={() => {alert("Test");}}/>
          </div>
      </div>
      </div> 
      </>
      )
    }
  }