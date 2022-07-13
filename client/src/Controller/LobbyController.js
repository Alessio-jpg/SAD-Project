export default class LobbyController {
    constructor(lobby, socket) {
        this.lobby = lobby;
        this.socket = socket;
    }

    setIsStart(val) {
        this.lobby.setIsStart(val);
    }

    getIsStart() {
        return this.lobby.getIsStart();
    }

    subscribeIsStartObserve(observer) {
        this.lobby.subscribeIsStartObserve(observer);
    }

    unsubscribeIsStartObserve() {
        this.lobby.unsubscribeIsStartObserve();
    }

    updateIsStartObserve(value) {
        this.lobby.updateIsStart(value);
    }

    subscribeLobbyObserve(observer) {
        this.lobby.subscribeLobbyObserve(observer);
    }

    unsubscribeLobbyObserve() {
        this.lobby.unsubscribeLobbyObserve();
    }

    updateLobbyCount(count) {
        this.lobby.updateLobbyCount(count);
    }

    enqueue() {
        this.socket.enqueue_lobby();
    }

    dequeue() {
        this.socket.dequeue_lobby();
    }

    start_game() {
        this.socket.start_game();
    }

    update_queue_count() {
        this.socket.update_queue_count();
    }


}