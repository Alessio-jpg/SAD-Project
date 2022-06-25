//import logo from './photo.png';
import DrawingArea from '../components/DrawingArea/DrawingArea';
import WordToDrowArea from '../components/wordToDrow/word';
import {SocketContext, socket} from '../socket';
import {io} from "socket.io-client";
import './App.css';

function App() {
  return (
        <>
        <SocketContext.Provider value={socket}>
        <hr></hr>
        <hr></hr>
        <div className='interactive-area'>
          <WordToDrowArea />
          <div className="App drawing-area">
            <DrawingArea onClearLines={() => {alert("Test");}}/>
          </div>
        </div>
        </SocketContext.Provider>
        </>
  );
}


export default App;
