//import logo from './photo.png';
import DrawingArea from './DrawingArea';
import './App.css';

function App() {
  return (
        <>
        <h1> Drawing Area</h1>
        <div className="App drawing-area">
          <DrawingArea onClearLines={() => {alert("Test");}}/>
        </div>
        </>
  );
}


export default App;
