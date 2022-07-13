import Observable from "./observable";

export default class Partecipation extends Observable {
    constructor() {
        super();

        this.count = 0;
    }


    subscribePartecipation(observer) {
        this.subscribe(observer, this.count);
    }

    unsubscribePartecipation() {
        this.unsubscribe();
    }

    updatePartecipation(data) {
        this.count = data;

        this.update(this.count);
    }
}