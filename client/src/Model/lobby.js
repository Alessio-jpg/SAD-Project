import Observable from "./observable";

let instance;
export default class Lobby extends Observable {
    constructor() {
        super();
        if(instance) {
            throw new Error("Lobby già istaziata");
        }
        instance = this;
        this.count = 0;
    }

    subscribeLobbyObserve(observer) {
        this.subscribe(observer, this.count);
    }

    unsubscribeLobbyObserve() {
        this.unsubscribe();
    }

    updateLobbyCount(value) {
        this.count = value;

        this.update(this.count);
    }

    getCount() {
        return this.count;
    }

    getIstance() {
        return this;
    }
    
    /*
    setIsStart(val) {
        console.log("Mi HANNO STARTATO")
        this.isStart = val;
    }

    getIsStart() {
        return this.isStart;
    }
    */
    
}