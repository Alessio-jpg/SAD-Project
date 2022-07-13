import Axios from "axios";


export default class RegistrationController {

    register(usernameReg, passwordeReg) {
        Axios.defaults.withCredentials = true;
        Axios.post("http://localhost:4000/register", {
            username: usernameReg,
            password: passwordeReg,
        }).then((response) => {
            console.log(response); //return true or false for navigate
        });
    }

}