import Giocatore from "./player";


export default class Classifica {
    constructor() {

        this.giocatore = [];

    }

    setClassifica(arr, date) {
        if(date == "scoreW") {
            arr.forEach(element => {
                var giocatore = new Giocatore(element.username, element.scoreW);
                this.giocatore.push(giocatore);
            });
        } else if (date == "scoreM") {
            arr.forEach(element => {
                var giocatore = new Giocatore(element.username, element.scoreM);
                this.giocatore.push(giocatore);
            });            
        } else {
            arr.forEach(element => {
                var giocatore = new Giocatore(element.username, element.scoreA);
                this.giocatore.push(giocatore);
            });           
        }
    }

    getClassifica() {
        return this.giocatore;
    }

} 