//import logo from './photo.png';
import DrawingArea from '../components/DrawingArea/DrawingArea';
import WordToDrawArea from '../components/WordToDraw/WordToDraw';
import {SocketContext, socket} from '../socket';
import {io} from "socket.io-client";
import CountDownBar from '../components/WatchLive/CountdownBar/CountdownBar';
import $ from 'jquery'; 
import './App.css';
import WatchLiveArea from '../components/WatchLive/WatchDraw';
import MatchedWord from '../components/MatchedWord/MatchedWord';
import { useEffect, useState } from 'react';

function App() {

  const [canvas_shape, setCanvasShape] = useState();
  const [watchlive_shape, setLiveShape] = useState();

  const [name1, setName1] = useState();
  const [name2, setName2] = useState();
  const [name3, setName3] = useState();
  const [name4, setName4] = useState();

  const [id1, setID1] = useState();
  const [id2, setID2] = useState();
  const [id3, setID3] = useState();
  const [id4, setID4] = useState();

  const [lines1, setLines1] = useState([]);
  const [lines2, setLines2] = useState([]);
  const [lines3, setLines3] = useState([]);
  const [lines4, setLines4] = useState([]);
  
  useEffect(() => {
    var x = scaleWidth();

    setCanvasShape(x[0]);
    setLiveShape(x[1]);

    var player_data = JSON.parse(localStorage.getItem("players_ingame"));

    // Il player1 devo essere io

    /*
    setName1(my_username)
    setID1(my_id)
    
    player_data = player_data.filter(function(u) {
      return u["id"] !== my_id
    })
    */
    setName2(player_data[0]["username"])
    setName3(player_data[1]["username"])
    setName4(player_data[2]["username"])

    setName1(player_data[3]["username"])

    setID2(player_data[0]["id"])
    setID3(player_data[1]["id"])
    setID4(player_data[2]["id"])

    setID1(player_data[3]["id"])
  }, []);

  socket.on("other-player-lines-update", (message) => {
    console.log("\t Ricevuto: ",message.id)
    if(message.id === id1) {
      console.log("Aggiorno vista di " + name1)
      setLines1(message.payload)
    }
    if(message.id === id2) {
      console.log("Aggiorno vista di " + name2)
      setLines2(message.payload)
    }
    if(message.id === id3) {
      console.log("Aggiorno vista di " + name3)
      setLines3(message.payload)
    }
    if(message.id === id4) {
      console.log("Aggiorno vista di " + name4)
      setLines4(message.payload)
    }
    
  })

  //socket.on("punto-fatto", ({player_id , punteggio}) => {
    /*
      Trovami il WatchLive che ha il = player_id
      Aggiorma il punteggio
    */


  return (
        <>
        <SocketContext.Provider value={socket}>
        <div className='main-container'>
        <div>
          <div className='live-drawing-area'>
            <div className='single-live-screen'>
              < WatchLiveArea id = {id1} name = {name1} lines = {lines1}/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea id = {id2} name = {name2} lines = {lines2}/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea id = {id3} name = {name3} lines = {lines3}/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea id = {id4} name = {name4} lines = {lines4}/>
            </div>
          </div>
          <CountDownBar />
        </div>
          <div className='word-container'>
            <WordToDrawArea />
            < MatchedWord />
          </div>
          <div className="App drawing-area">
            <DrawingArea onClearLines={() => {alert("Test");}}/>
          </div>
        </div>
        </SocketContext.Provider>
        </>
  );
}

function scaleWidth() {
  var widthDrawingArea = $('.drawing-area').width();
  var heightDrawingArea = $('.drawing-area').height();

  var x,y;

  if(widthDrawingArea < heightDrawingArea) {
    $('.drawing-area').height($('.drawing-area').width());
    x = widthDrawingArea;
  } else {
    $('.drawing-area').width($('.drawing-area').height());
    x = heightDrawingArea;
  }

  var widthLiveArea = $('.single-live-screen').width();
  var heightLiveArea = $('.single-live-screen').height();
  if(widthLiveArea < heightLiveArea) {
    $('.single-live-screen').height($('.single-live-screen').width());
    y = widthLiveArea;
  } else {
    $('.single-live-screen').width($('.single-live-screen').height());
    y = heightLiveArea;
  }
  return [x,y];
} 


export default App;
