//import logo from './photo.png';
import DrawingArea from './DrawingArea';
import WordToDrowArea from './wordToDrow/word';
import './App.css';

function App() {
  return (
        <>
        <hr></hr>
        <hr></hr>
        <div className='interactive-area'>
          <WordToDrowArea />
          <div className="App drawing-area">
            <DrawingArea onClearLines={() => {alert("Test");}}/>
          </div>
        </div>
        </>
  );
}


export default App;
