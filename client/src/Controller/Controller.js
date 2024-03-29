import Socket from "../Utils/Socket";
import Player from "../Model/player";
import LoginController from "./LoginController";
import RegistrationController from "./RegistrationController";
import ScoreboardController from "./ScoreboardController";
import Lobby from "../Model/lobby";
import LobbyController from "./LobbyController";
import GameController from "./GameController";
import Game from "../Model/Game";
import $ from 'jquery';

export default class Controller {
    constructor() {
        this.giocatore = new Player();
        this.game = new Game();
        this.socket = new Socket(this);
        this.gameSocket = new Socket(this);
        try {
            this.lobby = new Lobby();
            console.log('instanz');
        } catch(e) {
            console.log(e);
        }

        this.loginController = new LoginController(this.giocatore, this.socket);
        this.registerController = new RegistrationController();
        this.scoreboardController = new ScoreboardController(this.giocatore);
        this.lobbyController = new LobbyController(this.lobby, this.socket);
        this.gameController = new GameController(this.game, this.giocatore, this.gameSocket);
    }

    setPlayerID(uuid) {
        this.giocatore.setPlayerID(uuid);
    }

    getPlayerID() {
        return this.giocatore.getPlayerID();
    }

    getUsername() {
        return this.giocatore.getUsername();
    }


    getIsLogged() {
        console.log("Controller" + this.giocatore.getIsLogged());
        return this.giocatore.getIsLogged();
    }

    async login(username, password) {
        return await this.loginController.login(username,password);
    }

    userLogged() {
        return this.loginController.userLogged();
    }

    async userAuthenticated() {
        await this.loginController.userAuthenticated();
    }

    register(username, password) {
        this.registerController.register(username, password);
    }

    getScoreBoard(date) {
        console.log("User prima score" + this.giocatore.getUsername());
        return this.scoreboardController.getScoreBoard(date);
    }

    subscribeLobbyObserve(observer) {
        this.lobbyController.subscribeLobbyObserve(observer);
    }

    unsubscribeLobbyObserve() {
        this.lobbyController.unsubscribeLobbyObserve();
    }

    updateLobbyCount(value) {
        this.lobbyController.updateLobbyCount(value);
    }

    subscribeIsStartObserve(observer) {
        this.gameController.subscribeIsStartObserve(observer);
    }

    unsubscribeIsStartObserve() {
        this.gameController.unsubscribeIsStartObserve();
    }

    updateIsStartObserve(value) {
        this.gameController.updateIsStartObserve(value);
    }

    update_queue_count() {
        this.lobbyController.update_queue_count();
    }

    enqueue() {
        this.lobbyController.enqueue();
    }

    dequeue() {
        this.lobbyController.dequeue();
    }

    start_game() {
        this.lobbyController.start_game();
    }

    handleMouseDown(x,y) {
        this.gameController.handleMouseDown(x,y);
    }

    handleMouseMove(x,y) {
        this.gameController.handleMouseMove(x,y);
    }

    getLines() {
        return this.gameController.getLines();
    }

    subscribeWordToDraw1(observer) {
        this.gameController.subscribeWordToDraw1(observer);
    }

    subscribeWordToDraw2(observer) {
        this.gameController.subscribeWordToDraw2(observer);
    }

    subscribeMatchedWord(observer) {
        this.gameController.subscribeMatchedWord(observer);
    }

    clearWatchLive() {
        this.gameController.clearWatchLive();
    }

    clearDrawing() {
        this.gameController.clearDrawing();
    }

    updateWatchLive(id, lines) {
        this.gameController.updateWatchLive(id, lines);
    }

    subscribeWatchLive1(observer) {
        this.gameController.subscribeWatchLive1(observer);
    }  

    subscribeWatchLive2(observer) {
        this.gameController.subscribeWatchLive2(observer);
    }  

    subscribeWatchLive3(observer) {
        this.gameController.subscribeWatchLive3(observer);
    }  

    subscribeWatchLive4(observer) {
        this.gameController.subscribeWatchLive4(observer);
    }  

    subscribePartecipation(observer) {
        this.gameController.subscribePartecipation(observer);
    }

    unsubscribeWordToDraw1() {
        this.gameController.unsubscribeWordToDraw1();
    }

    unsubscribeWordToDraw2() {
        this.gameController.unsubscribeWordToDraw2();
    }

    unsubscribeMatchedWord() {
        this.gameController.unsubscribeMatchedWord();
    }

    unsubscribeWatchLive1() {
        this.gameController.unsubscribeWatchLive1();
    }   

    unsubscribeWatchLive2() {
        this.gameController.unsubscribeWatchLive2();
    }    

    unsubscribeWatchLive3() {
        this.gameController.unsubscribeWatchLive3();
    }
    
    unsubscribeWatchLive4() {
        this.gameController.unsubscribeWatchLive4();
    }   
    
    unsubscribePartecipation() {
        this.gameController.unsubscribePartecipation();
    }

    updateWordToDraw1(value) {
        this.gameController.updateWordToDraw1(value);
    }

    updateWordToDraw2(value) {
        this.gameController.updateWordToDraw2(value);
    }

    updateMatchedWord(value) {
        this.gameController.updateMatchedWord(value);
    }

    updateWatchLive1(value) {
        this.gameController.updateWatchLive1(value);
    }
    
    updateWatchLive2(value) {
        this.gameController.updateWatchLive2(value);
    }

    updateWatchLive3(value) {
        this.gameController.updateWatchLive3(value);
    }

    updateWatchLive4(value) {
        this.gameController.updateWatchLive4(value);
    }

    updatePartecipation(data) {
        this.gameController.updatePartecipation(data);
    }
    
    neural_guess() {
        this.gameController.neural_guess();
    }

    other_player_lines_update() {
        this.gameController.other_player_lines_update();
    }

    connectGameSocket(addr) {
        this.gameController.connect(addr, localStorage.getItem("token"))
    }

    end_game(win) {
        this.gameController.end_game(win);
    }
}