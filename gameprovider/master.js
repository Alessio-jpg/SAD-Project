//const Game = require('./Game.js');

const WseCCMaster = require("wse-cc").WseCCMaster
const server = require("http").createServer()

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
} 

var started_games = []

function on_demon_auth(data, resolve) {
    if(data.secret === 'ULTRA-SECRET-KEY') return resolve(data.id)
    resolve(null)
}

const master = new WseCCMaster({server})

master.use_ssl = false

master.logging = false

master.listen_demons({port:5001}, on_demon_auth)

master.on("c:game_start", (core, payload) => {
    console.log(payload)
    payload = JSON.parse(payload)
    started_games[payload.id] = payload.port
    
    
    if(payload.address == "::") {
        payload.address = "localhost"
    }
    
    console.log("PORTAAAAAAAAAAAA\n" + payload.address + ":" + payload.port)
})

master.on("c:game_end", (core, payload) => {
    if(payload.winners.length > 1) {
        console.log("game_"+ core + " has ended, game ended in a tie between: " + payload.winners);    
    }
    else {
        console.log("game_"+ core + " has ended, " + payload.winners + " won!");
    }
    
    master.despawn_core(core)
})

/*
async function wait_for_game_start(game_core) {
    while(core.state) 
}
*/

function define_master_event(event, callback) {
    master.on(event, callback)
}


async function spawn_game(game_id, player_data) {
    started_games[game_id] = false
    var core = master.spawn_core (
        game_id,
        "./gamecontrol.js",
        {debug: false, data: JSON.stringify(player_data)}
        )
        
        while(!started_games[game_id]) {
            await delay(200);
        }
        
        console.log(master.cores[game_id])
        
        return started_games[game_id]
    }
    
    setInterval(()=>{master.distribute_cores(1)},100)
    
    console.log("master started")
    
    
    module.exports = {define_master_event, spawn_game}