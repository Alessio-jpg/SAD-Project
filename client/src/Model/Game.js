import Drawing from "./drawing"
import MatchedWord from "./matchedWord";
import Observable from "./observable";
import WatchLive from "./watchLive";
import WordToDraw from "./wordToDraw";

export default class Game extends Observable {
    constructor() {
        super()

        this.drawing = new Drawing();
        this.wordToDraw1 = new WordToDraw();
        this.wordToDraw2 = new WordToDraw();
        this.matchedWord = new MatchedWord();

        this.watchLive1 = new WatchLive();
        this.watchLive2 = new WatchLive();
        this.watchLive3 = new WatchLive();
        this.watchLive4 = new WatchLive();

        this.isStart = false;

    }


    clearDrawing() {
        this.drawing.clearDrawing();
    }

    initializeLines(x,y) {
        this.drawing.initializeLines(x,y);
    }

    updateDrawing(x,y) {
        this.drawing.updateDrawing(x,y);
    }

    getDrawing() {
        return this.drawing.getDrawing();
    }

    subscribeIsStartObserve(observer) {
        this.subscribe(observer, this.isStart);
    }

    unsubscribeIsStartObserve() {
        this.unsubscribe();
    }

    updateIsStart(value) {
        this.isStart = value;

        this.update(this.isStart);
    }

    subscribeWordToDrow1(observer) {
        this.wordToDraw1.subscribeWordToDrow(observer);
    }

    subscribeWordToDrow2(observer) {
        this.wordToDraw2.subscribeWordToDrow(observer);
    }

    subscribeMatchedWord(observer) {
        this.matchedWord.subscribeMatchedWord(observer);
    }

    subscribeWatchLive1(observer) {
        this.watchLive1.subscribeWatchLive(observer);
    }

    subscribeWatchLive2(observer) {
        this.watchLive2.subscribeWatchLive(observer);
    }

    subscribeWatchLive3(observer) {
        this.watchLive3.subscribeWatchLive(observer);
    }

    subscribeWatchLive4(observer) {
        this.watchLive4.subscribeWatchLive(observer);
    }

    unsubscribeWordToDrow1() {
        this.wordToDraw1.unsubscribeWordToDrow();
    }

    unsubscribeWordToDrow2() {
        this.wordToDraw2.unsubscribeWordToDrow();
    }

    unsubscribeMatchedWord() {
        this.matchedWord.unsubscribeMatchedWord();
    }

    unsubscribeWatchLive1() {
        this.watchLive1.unsubscribeWatchLive();
    }

    unsubscribeWatchLive2() {
        this.watchLive2.unsubscribeWatchLive();
    }

    unsubscribeWatchLive3() {
        this.watchLive3.unsubscribeWatchLive();
    }

    unsubscribeWatchLive4() {
        this.watchLive4.unsubscribeWatchLive();
    }

    updateWordToDrow1(data) {
        this.wordToDraw1.updateWordToDrow(data);
    }
    
    updateWordToDrow2(data) {
        this.wordToDraw2.updateWordToDrow(data);
    } 

    updateMatchedWord(data) {
        this.matchedWord.updateMatchedWord(data);
    } 

    updateWatchLive1(data) {
        this.watchLive1.updateWatchLive(data);
    }

    updateWatchLive2(data) {
        this.watchLive2.updateWatchLive(data);
    }

    updateWatchLive3(data) {
        this.watchLive3.updateWatchLive(data);
    }

    updateWatchLive4(data) {
        this.watchLive4.updateWatchLive(data);
    }


}