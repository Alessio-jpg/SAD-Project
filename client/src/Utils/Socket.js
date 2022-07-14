import {io} from "socket.io-client";
//import { SOCKET_URL } from "config";

export default class Socket {
    static SOCKET_URL = "localhost:5000"
    
    constructor(controller) {
        this.socket = null;
        this.controller = controller;
    }
    
    connect(JWT, addr = Socket.SOCKET_URL) { 
        if(this.socket == null) {
            this.socket = io (addr, {
                query: "token=" + JWT 
            });
            
            if(addr !== Socket.SOCKET_URL) {
                this.socket.on("connect", () => {
                    this.drawing_topics();
                    this.neural_guess();
                    this.other_player_lines_update(); 
                    this.update_score();
                    this.game_termination();
                });
                
                this.socket.on("disconnecting", () => {console.log("Disconnessione")});
            }
            else {
                this.start_game();
                this.update_queue_count();
            }
        }
        
    }
    
    enqueue_lobby() {
        this.socket.emit('join-queue');
    }
    
    async dequeue_lobby() {
        console.log("DEQUEUE")
        await new Promise ( resolve => 
            {
            this.socket.emit('leave-queue', (answer) => {
                resolve(answer);
            });
        });
    }
    
    update_queue_count() {
        this.socket.on("update-queue-count", (value) => {
            this.controller.updateLobbyCount(value);
        });
    }
    
    start_game() {
        this.socket.on("start_game", (value) => {
            localStorage.setItem("players_ingame", JSON.stringify(value.players));
            this.controller.connectGameSocket(value.game_server);
            this.controller.updateIsStartObserve(true);
            console.log("naviga App");
        });
    }
    
    /*
    login_connect(token) {
        this.socket.emit("login-event", token);
    }
    */
    
    
    upload_event(lines) {
        if(this.socket != null) {
            this.socket.emit("upload-event", lines);
        }
    }
    
    
    neural_guess() {
        console.log(this.socket)
        this.socket.on("neural-guess", (pred) => {
            this.controller.updateMatchedWord(pred);
        })
    }
    
    other_player_lines_update() {
        this.socket.on("other-player-lines-update", (message) => {
            console.log("\t Ricevuto: ",message.id);
            this.controller.updateWatchLive(message.id, message.payload);
        })
    }
    
    drawing_topics() {
        this.socket.on("drawing-topics", (topics) => {
            console.log(topics);
            this.controller.updateWordToDraw1(topics.topic1);
            this.controller.updateWordToDraw2(topics.topic2);
        })
    }
    
    update_score() {
        this.socket.on("update-score", (score) => {
            console.log("INCARRATO")
            console.log(score)
            this.controller.updatePartecipation(score)
        })
    }
    
    game_termination() {
        this.socket.on("winning-event", () => {
            console.log("VINTO")
            this.controller.end_game(true);
            
            this.socket.disconnect();
            this.socket = null;
        })
        
        this.socket.on("losing-event", () => {
            console.log("PERSO")
            this.controller.end_game(false);
            
            this.socket.disconnect();
            this.socket = null;
        })
    }
    
}