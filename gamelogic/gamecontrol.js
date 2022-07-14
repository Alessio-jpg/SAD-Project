const jwt = require('jsonwebtoken')

const User = require("./User.js");
const Game = require('./Game.js');

const WseCCCore = require("wse-cc").WseCCCore
const database = require("./dbInterface.js")
//const updateScoreboard = require("./updateScoreboard.js")

const TIME_DURATION = 60 //In seconds
const TIME_INTERVAL_BETWEEN_PREDICTIONS = 1 // In seconds

//var TOPICS = shuffle(await(drawingTopics.getTopics()))


var TOPICS = null;
/*
await drawingTopics.getTopics().then(
  (t) => {
    TOPICS = shuffle(t);
  }
  )
  */
  
  var core = new WseCCCore({server: "ws://localhost:5001/demons"})
  
  
  // Parse argvs
  
  var players_ingame = []
  
  process.argv.forEach(a => {
    if(a.startsWith("data=")) {
      JSON.parse(a.substring(5)).forEach( (data) => {
        players_ingame.push(new User(data.id, data.username, null)) 
      })
    }
  });
  
  console.log("PLAYERS")
  console.log(players_ingame)
  
  var game = new Game(core.id, players_ingame)
  
  // Utils
  
  function shuffle(array) {
    var i = array.length,
    j = 0,
    temp;
    
    while (i--) {
      j = Math.floor(Math.random() * (i+1));
      // swap
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  
  function findUserFromSocket(socket_id) {
    filtered_user = players_ingame.filter(function(u) {
      return u.socket.id === socket_id
    })
    
    return filtered_user[0]
  }
  
  function findUserFromUUID(user_uuid) {
    filtered_user = players_ingame.filter(function(u) {
      return u.uuid === user_uuid
    })
    
    return filtered_user[0]
  }
  
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
      var token = socket.handshake.query.token
      var decoded = jwt.decode(token);
      
      socket.decoded = decoded;
      
      var pass = false;
      players_ingame.forEach(p => {
        if(p.uuid == decoded.id) {
          p.socket = socket;
          
          console.log(" >>>> {" + p.uuid + "} , {" + p.username + "}")
          pass = true;
        }
      });
      if(pass) {
        next();
      }
      else {
        console.log("Wrong user tried to connect")
        socket.close();
      }
    }
    else {
      console.log("User tried to connect without providing token")
      next(new Error('Authentication error'));
    }    
  })
  
  var Mutex = require('async-mutex').Mutex;
  
  const token_mux = new Mutex();
  
  io.on('connection', async (socket) => {
    console.log('client connected: \u001b[1;34m',socket.id, "\u001b[0m")
    
    token_mux.runExclusive( async () => {
      if(TOPICS === null) {
        TOPICS = await database.getTopics();
        TOPICS = shuffle(TOPICS);
        
        TOPICS[0] = 'the_great_wall_of_china';
      }
      
      socket.emit("drawing-topics", {
        topic1: TOPICS[0],
        topic2: TOPICS[1]
      })
    });
    
    socket.on("upload-event", (lines) => {
      console.log("Ricevute Lines")
      
      var u = findUserFromSocket(socket.id);
      console.log(socket.id);
      console.log(u);
      if(u.canSubmit == true) {
        var msg = {
          id: u.uuid,
          queue_id: core.id,
          payload: lines
        }
        
        redis_push("queue:images", msg);
        
        var update_msg = {
          id: u.uuid,
          payload: lines
        }
      }
      
      console.log("Emitto al game a tutti tranne che " + u.username);
      
      socket.broadcast.emit("other-player-lines-update",update_msg);
    })
    
    
    socket.on('disconnect', (reason)=>{
      console.log(reason)
    })
  })
  
  server.listen(0, err=> {
    if(err) console.log(err)
    console.log('Server running on Port ', server.address().port)
  })
  
  
  
  
  
  // Redis I-O
  
  const {redis_connect, redis_enable_keyevent_notification, redis_subscribe, redis_pop, redis_push} = require("./redis.js");
  
  redis_connect();
  
  redis_enable_keyevent_notification();
  
  // Subscribe to the output queue from the NN
  
  redis_subscribe(core.id , async (message, channel) => {
    console.log("MESSAGE: " + message)
    if(message != 'lpush') {
      return
    }
    console.log("POPPO");
    var pred = await redis_pop("queue:predictions:" + core.id);
    console.log(pred)
    player_id = pred["id"];
    var top1 = pred["top1"];
    var top2 = pred["top2"];
    var top3 = pred["top3"];
    
    console.log("PLAYER : " + player_id)
    
    console.log(top1,top2,top3)
    
    
    // TODO: Controlla se il guess è corretto
    /*
    if (draw_topic == payload["top1"] || draw_topic == payload["top2"] || draw_topic == payload["top3"]) {
      guess = draw_topic
      
    }
    else {
      guess = pred["top1"];
    }
    */
    
    
    var guess = pred["top1"];
    
    var cur_usr = findUserFromUUID(player_id);
    var socket_id = cur_usr.socket.id;
    
    var player_score = game.getPlayerScore(cur_usr.uuid);
    
    var correct_guesses = [TOPICS[2*player_score], TOPICS[2*player_score+1]];
    
    var guess_right = false;
    
    correct_guesses.forEach(correct_guess => {
      if(correct_guess == pred["top1"] || correct_guess == pred["top2"] || correct_guess == pred["top3"]) {
        pred = correct_guess;
        guess_right = true;
      }
    });
    
    console.log("Sending to player {" + player_id + ","+ socket_id +"}" + " the guess " + guess )
    io.to(socket_id).emit("neural-guess", guess);
    
    if(guess_right) {
      console.log("The player guess is right, player ", player_id, "'s score is ", (player_score+1))
      cur_usr.socket.emit("update-score", player_score + 1)
      
      cur_usr.socket.emit("drawing-topics", {
        topic1: TOPICS[2*(player_score+1)], 
        topic2: TOPICS[2*(player_score+1)+1]
      })
      
      game.incrementPlayerScore(cur_usr.uuid);
    }
  });
  
  var payload = JSON.stringify({id: process.argv[2].substring(3), 
    address: server.address().address,
    port: server.address().port})
    
    core.ipc("game_start",payload)
    
    
    
    
    
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    } 
    
    delay(1000 * TIME_DURATION)
    .then(async () => {
      console.log("GAME END")
      var winners = game.getWinners();
      
      var payload = [];
      winners.forEach(u => {
        if(u.socket !== null) {
          u.socket.emit("winning-event")
        }
        payload.push(u.username)
      });
      
      var losers = game.users;
      
      losers = losers.filter((u) => {
        for (let index = 0; index < winners.length; index++) {
          if(u.uuid == winners[index].uuid) {
            return false;
          }
        }
        return true;
      })
      
      console.log("LOSERS:")
      console.log(losers)
      
      losers.forEach(u => {
        if(u.socket !== null) {
          u.socket.emit("losing-event")
        }
      });
      
      
      if(game.getPlayerScore(winners[0].uuid) > 0) {
        // Set Score in DB
        winners.forEach(u => {
         database.updateScoreboard(u.uuid)
        });
        resolve();
      }
      
      console.log("Scoreboard aggiornata con il/i vincitore/i")
      core.ipc("game_end", {winners: payload})
    })
    
    
    setInterval(() => {
      players_ingame.forEach(u => {
        u.canSubmit = true;
      });
    }, TIME_INTERVAL_BETWEEN_PREDICTIONS * 1000);