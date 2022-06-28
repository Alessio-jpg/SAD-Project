//import logo from './photo.png';
import DrawingArea from '../components/DrawingArea/DrawingArea';
import WordToDrawArea from '../components/WordToDraw/WordToDraw';
import {SocketContext, socket} from '../socket';
import {io} from "socket.io-client";
import CountDownBar from '../components/WatchLive/CountdownBar/CountdownBar';
import $ from 'jquery'; 
import './App.css';
import WatchLiveArea from '../components/WatchLive/WatchLive';
import MatchedWord from '../components/MatchedWord/MatchedWord';
import { useEffect } from 'react';

function App() {
  
  useEffect(() => {
    scaleWidth();
  });

  return (
        <>
        <SocketContext.Provider value={socket}>
        <div className='main-container'>
        <div>
          <div className='live-drawing-area'>
            <div className='single-live-screen'>
              < WatchLiveArea/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea/>
            </div>
            <div className='single-live-screen'>
              < WatchLiveArea/>
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


export default App;
