import Observable from "./observable";

export default class MatchedWord extends Observable {
    constructor() {
        super();

        this.matchedWord = "";
    }

    subscribeMatchedWord(observer) {
        this.subscribe(observer, this.matchedWord);
    }

    unsubscribeMatchedWord() {
        this.unsubscribe();
    }

    updateMatchedWord(data) {
        this.matchedWord = data;

        this.update(this.matchedWord);
    } 
}