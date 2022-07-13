import Axios  from "axios";
import Classifica from "../Model/classifica";

export default class ScoreboardController {
    constructor(user) {
        this.classifica = new Classifica();
        this.giocatore = user;
    }

    async getScoreBoard(date) {

        Axios.defaults.withCredentials = true;

        const value = await Axios.post("http://localhost:4001/viewScoreboard", {
            date: date,
        }).then((response) => {
            console.log(this.giocatore.getScore());
            this.classifica.setClassifica(response.data, date);
            return response.data;
        }); 

        return value;
    }


}




