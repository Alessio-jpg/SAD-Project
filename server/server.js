const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

const io = socketIo(server,{ 
    cors: {
      //origin: ["http://localhost:3000", "localhost:3000", "https://localhost:3000", "http://192.168.0.165"],
      //preflightContinue: false,
      //optionsSuccessStatus: 204,
      //origin: ["http://localhost:3000", "http://192.168.0.165"],
      origin: "*",
      methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
      //allowedHeaders: ["my-custom-header"],
      credentials: false
    }
}) //in case server and client run on different urls

io.on('connection', (socket) => {
    console.log('client connected: ',socket.id)
    
    socket.join('game-room')

    socket.on('upload-event', (img) => {
      console.log(img)
    })
  
    socket.on('disconnect', (reason)=>{
        console.log(reason)
    })
})
  
/*  
setInterval(()=>{
    io.to('clock-room').emit('time', new Date())
},1000)

*/

server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log('Server running on Port ', PORT)
})

/*
const express = require("express");
const http = require( 'http' );

const cors = require('cors'); 
const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));



//io.set('origins','*:*');
const PORT = 5000;

//var server = app.listen(PORT);

/*
router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
  });
*/
/*
server.listen( PORT, function() {
console.log( 'listening on *:' + PORT );
});

const io = require("socket.io")( {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });


var upvote_count = 0;
io.on( 'connection', function( socket ) {
console.log( 'a user has connected!' );

socket.on( 'disconnect', function() {
console.log( 'user disconnected' );
});

socket.on( 'upload-event', function( image ) {
console.log("ricevuta immagine ")
console.log(image)
//io.emit( 'update-upvotes', f_str );
});
});

var server = app.listen(PORT);
*/