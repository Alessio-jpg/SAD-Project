const jwt = require('jsonwebtoken');
const {deleteUserSession} = require("./dbInterface");



const createToken = (id, username) => {
    const token = jwt.sign({id: id, username: username}, "{Wt%98WO*1m)jp2", {
        expiresIn: 30,
    });

    return token;
}


const verifyJWT = (req, res) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.json({auth: false, message: "Fratm, cacc o token"});
    } else {
        jwt.verify(token, "{Wt%98WO*1m)jp2", (err, decoded) => {
            if(err) {
                res.json({auth: false, message: "fratm, o token è pezzotto"});
                const userId = jwt.decode(token);
                deleteUserSession(userId);
            } else {
                req.userId = decoded.id;
                res.json({auth: true, message: "Fratttm, stai conness"});
            }
        });
    }
};

module.exports = {createToken, verifyJWT};