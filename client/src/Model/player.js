import Observable from "./observable";

export default class Player {
    constructor() {
        this.uuid = '';
        this.username = '';
        this.score = '';
        this.isLogged = false;
    }

    setPlayerID(uuid) {
        this.uuid = uuid;
    }

    getPlayerID() {
        return this.uuid;
    }

    setScore(score) {
        this.score = score;
    }

    setUsername(username) {
        this.username = username;
    }

    setIsLogged(auth) {
        this.isLogged = auth;
    }

    getScore() {
        return this.score;
    }

    getUsername() {
        console.log(this.username);
        return this.username;
    }

    getIsLogged() {
        return this.isLogged;
    }
}