import Axios from "axios";

export default class LoginController {
    constructor(user, socket) {
        this.giocatore = user;
        this.socket = socket;

    }

    async login(username, password) {
        

        Axios.defaults.withCredentials = true;

        await Axios.post("http://localhost:4000/login", {
        username: username,
        password: password,
        }).then((response) => {
            console.log(response);
            if(!response.data.auth) {
                console.log('Non autenticato');
                this.giocatore.setIsLogged(false);
            } else {
                console.log(response.data);
                localStorage.setItem("token", response.data.token);
                this.socket.connect(response.data.token);
                this.socket.login_connect(response.data.token);
                this.giocatore.setUsername(username);
                this.giocatore.setPlayerID(response.data.uuid);
                this.giocatore.setIsLogged(true);
            }
        });
    }




    async userAuthenticated() {

        Axios.defaults.withCredentials = true;

        if(localStorage.getItem("token")) {
            await Axios.get("http://localhost:4000/isUserAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                console.log(response);
                if(response.data.auth) {
                    this.giocatore.setIsLogged(true);
                }
            });
        } else {
            console.log("Token non presente");
            this.giocatore.setIsLogged(false);
        }       
    }


    async userLogged() {
        Axios.defaults.withCredentials = true;
      
        const authed = await Axios.get("http://localhost:4000/isLogged", {        
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }).then((response) => {
            if(!response.data.loggedIn) {
                console.log(response);
                return true;
            } else {
              return false;
            }
        });
      
        return authed;
      }

}
