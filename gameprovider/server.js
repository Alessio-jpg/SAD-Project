const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {define_master_event, spawn_game} = require("./master.js")

const PORT = process.env.PORT || 5000

const User = require("./User.js");
const Game = require('./Game.js');

const PLAYERS_PER_GAME = 4;

const app = express()
const server = http.createServer(app)

const io = socketIo(server,{ 
  cors: {
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: false
  }
})

var users = [];
var games = [];

function findUserFromSocket(socket_id) {
  filtered_user = users.filter(function(u) {
    return u.socket === socket_id
  })
  
  return filtered_user[0]
}

function findUserFromUUID(user_uuid) {
  filtered_user = users.filter(function(u) {
    return u.uuid === user_uuid
  })
  
  return filtered_user[0]
}

function findGameFromUser(player_uuid) {
  if(player_uuid == undefined) {
    console.log("E' successo")
    
  }
  var index = 0;
  while (index < games.length && !games[index].isPlayerPresent(player_uuid)) {
    index += 1;
  }
  if(index >= games.length) {
    console.log(" [ERROR] Player " + player_uuid + " not found in current games")
    throw new Error("Player " + player_uuid + " not found in current games")
  }
  return games[index];
}


async function tryMatchmaking() {
  var players_socket = [];
  io.sockets.adapter.rooms.get('queue-room').forEach(id => {
    
    players_socket.push(io.sockets.sockets.get(id));
  });
  console.log("Players in queue: "+ players_socket.length)
  
  if (players_socket.length > PLAYERS_PER_GAME-1) {
    console.log("Starting game . . .")
    
    var game_id;
    do {
      game_id = randomString()
      game_room = "game-room_" + game_id
    }while(io.sockets.adapter.rooms.has(game_room))
    
    console.log("Creating game room, ID: " + game_room)
    
    players = users.filter(function(u) {
      for (let index = 0; index < players_socket.length; index++) {
        if(u.socket === players_socket[index].id)
        return true; 
      }
      return false;
    })
    
    message = []
    
    for (let index = 0; index < players.length; index++) {
      message.push({"id": players[index].uuid, "username": players[index].username})
    }
    
    console.log(message)
    
    var port = await spawn_game(game_id, message);
    
    console.log("Partita creata");
    console.log("AT port " + port)
    
    

    
    // Rimuovi gli user dalla coda
    for (let i = 0; i < PLAYERS_PER_GAME; i++) {
      players_socket[i].leave('queue-room');
      console.log("Rimosso utente " + players_socket[i].id + " dalla coda perchè in partita")
      io.to(players_socket[i].id).emit("start_game",{players: message,game_server: "localhost:" + port})
      //players_socket[i].join(game_room);
    }

    queue_count -= PLAYERS_PER_GAME

    console.log("Players in queue: "+ queue_count)
    
    io.to("queue-room").emit('update-queue-count', queue_count)
    
    //TODO: Tenere traccia delle partite
    //✅
    
    games.push(new Game(game_id, players));
    
    console.log(games);
  }
}



var Mutex = require('async-mutex').Mutex;

const queue_mux = new Mutex();
var queue_count = 0;
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
      var token = socket.handshake.query.token;
      var decoded = jwt.decode(token);
      
      socket.decoded = decoded;
      users.push(new User(decoded.id, decoded.username, socket.id))
      console.log(users)
      next();
    }
    else {
      console.log("User tried to connect without providing token")
      next(new Error('Authentication error'));
    }    
  })
  io.on('connection', (socket) => {
    console.log('client connected: \u001b[1;34m',socket.id, "\u001b[0m")
    
    socket.on('join-queue', () => {
      if(! socket.rooms.has('queue-room')) { 
        var pass = true;
        socket.rooms.forEach(r => {
          if(r.startsWith("game-room")) {
            pass = false;
          }
        });
        if(pass) {
          queue_mux.runExclusive( async () => {
            console.log("User \u001b[1;34m" + socket.id + "\u001b[0m joined the Queue")
            socket.join('queue-room')
            queue_count =  queue_count + 1;
            io.to('queue-room').emit('update-queue-count', queue_count)
            
            await tryMatchmaking();
          });
        }
      }
    })
    
    socket.on('leave-queue', () => {
      queue_mux.runExclusive( () => {
        if(socket.rooms.has('queue-room')) {
          queue_count -= 1
          socket.leave('queue-room')
          console.log("User \u001b[1;34m" + socket.id + "\u001b[0m left the Queue")
          socket.to('queue-room').emit('update-queue-count', queue_count)
        }
      }
      )
    })
    
    socket.on('disconnecting', () => {
      if(socket.rooms.has('queue-room')) {
        queue_count -= 1;
        console.log("User \u001b[1;34m" + socket.id + "\u001b[0m left the Queue")
        socket.to('queue-room').emit('update-queue-count', queue_count)
      }
      
      users.forEach(u => {
        console.log(u);
      });
      
      users = users.filter(function(u) {
        return u.socket !== socket.id
      })
    })
    
    socket.on('disconnect', (reason)=>{
      console.log(reason)
    })
  })
  
  server.listen(PORT, err=> {
    if(err) console.log(err)
    console.log('Server running on Port ', PORT)
  })
  
  
  function randomString(size = 21) {  
    return crypto
    .randomBytes(size)
    .toString('hex')
    .slice(0, size)
  }
  