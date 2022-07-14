
const {addUser, initializeUserScore} = require("./dbInterface");

const register = (username, password, res) => {
    addUser(username, password, res);
    initializeUserScore(username);
};


module.exports = {
    register
}