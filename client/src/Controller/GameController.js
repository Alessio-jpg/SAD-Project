import $ from 'jquery';

export default class GameController {
    constructor(game, player, socket) {
        this.game = game;
        this.socket = socket;
        this.player = player;
        //this.game = game

        this.skipping = 0;
    }

    clearDrawing() {
        this.game.clearDrawing();
        this.socket.upload_event([]);
    }

    handleMouseDown(x,y) {
        this.game.initializeLines(x,y);
    }

    handleMouseMove(x,y) {
        this.game.updateDrawing(x,y);
        const lines = this.game.getDrawing();

        if(this.skipping === 5) {
            this.socket.upload_event(lines);
            this.skipping = 0;
        }
        else {
            this.skipping += 1;
        }
    }

    getLines() {
        return this.game.getDrawing();
    }

    updateWatchLive(player_id, lines) {
        var player_data = JSON.parse(localStorage.getItem("players_ingame"));
        var id = [];

        var this_id = this.player.getPlayerID();

        player_data.forEach(element => {
            if(!(element["id"] == this_id))
              id.push(element["id"])
            });

            /*
            if(message.id === id[0]) {
                console.log("Aggiorno vista di 1")
                this.updateWatchLive1(message.payload);
            }
            */
            if(player_id === id[0]) {
                console.log("Aggiorno vista di 2" )
                this.updateWatchLive2(lines);
            }
            if(player_id === id[1]) {
                console.log("Aggiorno vista di 3" )
                this.updateWatchLive3(lines);
            }
            if(player_id === id[2]) {
                console.log("Aggiorno vista di  4" )
                this.updateWatchLive4(lines);
            }
    }

    subscribeIsStartObserve(observer) {
        this.game.subscribeIsStartObserve(observer);
    }

    unsubscribeIsStartObserve() {
        this.game.unsubscribeIsStartObserve();
    }

    updateIsStartObserve(value) {
        this.game.updateIsStart(value);
    }

    subscribeWordToDraw1(observer) {
        this.game.subscribeWordToDraw1(observer);
    }

    subscribeWordToDraw2(observer) {
        this.game.subscribeWordToDraw2(observer);
    }

    subscribeMatchedWord(observer) {
        this.game.subscribeMatchedWord(observer);
    }

    subscribeWatchLive1(observer) {
        this.game.subscribeWatchLive1(observer);
    }

    subscribeWatchLive2(observer) {
        this.game.subscribeWatchLive2(observer);
    }

    subscribeWatchLive3(observer) {
        this.game.subscribeWatchLive3(observer);
    }

    subscribeWatchLive4(observer) {
        this.game.subscribeWatchLive4(observer);
    }

    subscribePartecipation(observer) {
        this.game.subscribePartecipation(observer);
    }

    unsubscribeWordToDraw1() {
        this.game.unsubscribeWordToDraw1();
    }

    unsubscribeWordToDraw2() {
        this.game.unsubscribeWordToDraw2();
    }

    unsubscribeMatchedWord() {
        this.game.unsubscribeMatchedWord();
    }

    unsubscribeWatchLive1() {
        this.game.unsubscribeWatchLive1();
    }

    unsubscribeWatchLive2() {
        this.game.unsubscribeWatchLive2();
    }

    unsubscribeWatchLive3() {
        this.game.unsubscribeWatchLive3();
    }

    unsubscribeWatchLive4() {
        this.game.unsubscribeWatchLive4();
    }

    unsubscribePartecipation() {
        this.game.unsubscribePartecipation();
    }

    updateWordToDraw1(value) {
        this.game.updateWordToDraw1(value);
    }

    updateWordToDraw2(value) {
        this.game.updateWordToDraw2(value);
    }

    updateMatchedWord(value) {
        this.game.updateMatchedWord(value);
    }

    updateWatchLive1(data) {
        this.game.updateWatchLive1(data);
    }

    updateWatchLive2(data) {
        this.game.updateWatchLive2(data);
    }

    updateWatchLive3(data) {
        this.game.updateWatchLive3(data);
    }

    updateWatchLive4(data) {
        this.game.updateWatchLive4(data);
    }
    
    updatePartecipation(data) {
        this.game.updatePartecipation(data);
    }

    neural_guess() {
        return
        this.socket.neural_guess();
    }

    other_player_lines_update(val) {
        return
        this.socket.other_player_lines_update(val);
    }
    connect(addr) {
        console.log("connessione in corso . . ")
        var JWT = localStorage.getItem("token")
        this.socket.connect(JWT, addr);
    }

    end_game(win) {
        if(win) {
          $('.overlay-content p').text("You win!");
        } else {
          $('.overlay-content p').text("You lose!");
        }
        $('.overlay').width('100%');
      }

}