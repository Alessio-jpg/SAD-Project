const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const crypto = require('crypto')
const PORT = process.env.PORT || 5000

 const User = require("./User.js");

const app = express()
const server = http.createServer(app)

const io = socketIo(server,{ 
    cors: {
      //origin: ["http://localhost:3000", "localhost:3000", "https://localhost:3000", "http://192.168.0.165"],
      //preflightContinue: false,
      //optionsSuccessStatus: 204,
      origin: "*",
      methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
      //allowedHeaders: ["my-custom-header"],
      credentials: false
    }
}) //in case server and client run on different urls

var users = [];
var games = [];


function tryMatchmaking() {
  var players_socket = [];
  io.sockets.adapter.rooms.get('queue-room').forEach(id => {
    //console.log(id,(io.sockets.sockets.get(id)));
    players_socket.push(io.sockets.sockets.get(id));
  });
  console.log("Players in queue: "+ players_socket.length)
  //console.log(io.sockets.adapter.rooms.get('queue-room').values())
  if (players_socket.length > 3) {
    console.log("Starting game . . .")
    
    //var game = new Game();

    do {
      game_room = "game-room_" + randomString()
    }while(io.sockets.adapter.rooms.has(game_room))
  
    console.log("Creating game room, ID: " + game_room)

    for (let i = 0; i < 4; i++) {
      players_socket[i].leave('queue-room');
      players_socket[i].join(game_room);
    }

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
    

    io.to(game_room).emit("start_game",message)
    queue_count -= 4

    io.to("queue-room").emit('update-queue-count', queue_count)

    //TODO: Tenere traccia delle partite

    games.push(game_room);

    console.log(games);

    //console.log(io.sockets.adapter.rooms)
  }
}

// Redis I-O

const redis = require('redis');
const db = 0;
const notificationChannel = "__keyevent@" + db + "__:lpush";

const client = redis.createClient();

client.on('error', err => {
  console.log('Error ' + err);
});

client.on('connect', function(){
 console.log('Connected to redis instance');
});

client.connect();

const subClient = client.duplicate();

subClient.connect();

// Subscribe to the output queue from the NN

subClient.pSubscribe(notificationChannel, async (message, channel) => {
  console.log(`event >>> ${message} on ${channel}`);
  const affectedKey = channel.substring('__keyspace@0__:'.length);
  console.log(`Set cardinality ${affectedKey}`);


  var pred = await client.RPOP("queue:predictions");

  console.log("RPOPPO")

  pred = JSON.parse(pred);

  player_id = pred["id"];
  payload = pred["payload"];

  // TODO: multiplexa in funzione del player_id
  var mux = 0;

  console.log(pred);
  var guess;

  /*
  if (draw_topic == payload["top1"] || draw_topic == payload["top2"] || draw_topic == payload["top3"]) {
    guess = draw_topic
    
  }
  else {
    guess = pred["top1"];
  }
  */

  guess = pred["top1"];
  

  io.to(player_id).emit("neural-guess", guess);
  /*
  if(guess is right ) {
    io.to(game_room).emit("update-score", {"player": player.id, "points": x+1})
  }
  */
});




var Mutex = require('async-mutex').Mutex;

const queue_mux = new Mutex();
var queue_count = 0;
io.on('connection', (socket) => {
    console.log('client connected: \u001b[1;34m',socket.id)
    users.push(new User(socket.id,"nomeutente_placeholer",socket.id));

    socket.on('join-queue', () => {
      queue_mux.runExclusive( () => {
        if(! socket.rooms.has('queue-room')) {
          console.log("User \u001b[1;34m" + socket.id + "\u001b[0m joined the Queue")
          socket.join('queue-room')
          queue_count =  queue_count + 1;
          io.to('queue-room').emit('update-queue-count', queue_count)

          tryMatchmaking()
        }
      })
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

    socket.on('upload-event', (lines) => {
      // TODO: Il server deve assicurarsi che il client sia un una partita
      //       e individuare la particolare partita

      data = {
        "id": socket.id,    
        // TODO: sostuire socket.id ad user.uuid
        "payload": lines
      }

      console.log("RPUSHO")

      client.RPUSH('queue:images', JSON.stringify(data), (err, reply) => {
        if (err) throw err;
        console.log(reply);
    });
    })

    socket.on('disconnecting', () => {
      if(socket.rooms.has('queue-room')) {
        queue_count -= 1;
        console.log("User \u001b[1;34m" + socket.id + "\u001b[0m left the Queue")
        socket.to('queue-room').emit('update-queue-count', queue_count)
      }

      console.log(users)

      users = users.filter(function(u) {
        return u.uuid !== socket.id
      })

      console.log(users)
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


function randomString(size = 21) {  
  return crypto
    .randomBytes(size)
    .toString('hex')
    .slice(0, size)
}
