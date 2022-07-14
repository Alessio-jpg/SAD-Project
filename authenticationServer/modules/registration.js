
const {addUser, initializeUserScore} = require("./dbInterface");

const register = async (username, password, res) => {
    var id = await addUser(username, password, res);
    initializeUserScore(id, username);
};


module.exports = {
    register
}