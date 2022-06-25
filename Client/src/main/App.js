//import logo from './photo.png';
import DrawingArea from './DrawingArea';
import {SocketContext, socket} from './socket';
import './App.css';

import {io} from "socket.io-client";
import React from 'react';

const App = () => {
  /*
  const [time, setTime] = React.useState('fetching')
  React.useEffect (() => {
    const socket = io("http://192.168.0.144:5000", {
      //cors: {
        withCredentials: false,
        //extraHeaders: {
         // "my-custom-header": "abcd"
        //}
      //}
    })

    socket.on('connect', () => {console.log(socket.id)})
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect() , 5000)
    })

    socket.on('time', (data) => setTime(data))
    socket.on('disconnect' , ()=> setTime('server disconnected'))
  }, [])
  */
  return (
        <>
        <SocketContext.Provider value={socket}>
        <h1> Drawing Area</h1>
        <div className="App drawing-area">
          <DrawingArea />
        </div>

        </SocketContext.Provider>
        
        </>
  );
}

export default App;
