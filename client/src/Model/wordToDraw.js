import Observable from "./observable";

export default class WordToDraw extends Observable {
    constructor() {
        super();

        this.wordToDraw = "";
    }

    subscribeWordToDraw(observer) {
        this.subscribe(observer, this.wordToDraw);
    }

    unsubscribeWordToDraw() {
        this.unsubscribe();
    }

    updateWordToDraw(data) {
        this.wordToDraw = data;

        this.update(this.wordToDraw);
    }
}