import Observable from "./observable";

export default class WatchLive extends Observable {
    constructor() {
        super();

        this.lines = [];
    }

    subscribeWatchLive(observer) {
        this.subscribe(observer, this.lines);
    }

    unsubscribeWatchLive() {
        this.unsubscribe();
    }

    updateWatchLive(data) {
        this.lines = data;

        this.update(this.lines);
    }
}