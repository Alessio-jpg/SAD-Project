import Observable from "./observable";

export default class Giocatore {
    constructor() {
        this.username = '';
        this.score = '';
    }

    setScore(score) {
        this.score = score;
    }

    setUsername(username) {
        this.username = username;
    }

    getScore() {
        return this.score;
    }

    getUsername() {
        return this.username;
    }
}