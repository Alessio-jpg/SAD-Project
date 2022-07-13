
const WseCCCore = require("wse-cc").WseCCCore


var core = new WseCCCore({server: "ws://localhost:4001/demons"})

console.log(process.argv);

var players_ingame = process.argv;

// Socket to players

const express = require('express')
const socketIo = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socketIo(server,{ 
    cors: {origin: "*", methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],credentials: false}
})

io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      /*
      jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
        if (err) {
          console.log(socket.handshake.query.token)
          console.log("User tried to connect with unvalid token") 
          return
        }
        */
       var token = socket.handshake.query.token
       var decoded = jwt.decode(token);
  
        socket.decoded = decoded;
        console.log(decoded)
        next();
      }
    else {
      console.log("User tried to connect without providing token")
      next(new Error('Authentication error'));
    }    
})

io.on('connection', (socket) => {
    console.log('client connected: \u001b[1;34m',socket.id)

    socket.on("upload-event", (lines) => {
        console.log(lines)
    })
    

    socket.on('disconnect', (reason)=>{
        console.log(reason)
    })
})

server.listen(0, err=> {
    if(err) console.log(err)
    console.log('Server running on Port ', server.address().port)
  })


// Game Logic
const Game = require('./Game.js');


// Redis I-O

const {redis_connect, redis_enable_keyevent_notification, redis_subscribe, redis_pop, redis_push} = require("./redis.js")

redis_connect();

redis_enable_keyevent_notification();

// Subscribe to the output queue from the NN

redis_subscribe( async (message, channel) => {
  console.log("POPPO");
  var pred = await redis_pop("queue:predictions");

  var guess = pred;

  player_id = pred["id"];
  payload = pred["payload"];

  console.log("PLAYER : " + player_id)

  console.log( guess);
  var guess;


  // TODO: Controlla se il guess è corretto
  /*
  if (draw_topic == payload["top1"] || draw_topic == payload["top2"] || draw_topic == payload["top3"]) {
    guess = draw_topic
    
  }
  else {
    guess = pred["top1"];
  }
  */

  guess = pred["top1"];
  
  var socket_id = findUserFromUUID(player_id).socket;

  console.log("Sending to player {" + player_id + ","+ socket_id +"}" + " the guess " + guess )
  io.to(socket_id).emit("neural-guess", guess);
  /*
  if(guess is right ) {
    io.to(game_room).emit("update-score", {"player": player.id, "points": x+1})
  }
  */
});
