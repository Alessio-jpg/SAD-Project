import Observable from "./observable";

export default class WordToDraw extends Observable {
    constructor() {
        super();

        this.wordToDraw = "";
    }

    subscribeWordToDrow(observer) {
        this.subscribe(observer, this.wordToDraw);
    }

    unsubscribeWordToDrow() {
        this.unsubscribe();
    }

    updateWordToDrow(data) {
        this.wordToDraw = data;

        this.update(this.wordToDraw);
    }
}