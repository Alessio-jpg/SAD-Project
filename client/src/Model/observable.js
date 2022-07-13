export default class Observable {

    subscribe(observer, data) {
        this.observer = observer;
        this.observer(data);
    }

    unsubscribe() {
        this.observer = null;
    }

    update(data) {
        if(this.observer != null) {
            this.observer(data);
        }
    }
}