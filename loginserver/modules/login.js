const express = require('express');
const session = require("express-session");
const app = express();
const {createToken, verifyJWT} = require("./jwt");
const {checkSessionUser,checkUserCredentials, logOut, addUserSession} = require("./dbInterface");
const {decode} = require('jsonwebtoken');


app.use(
    session({
      key: "userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
    })
);


const isLogged = async(token) => {
    const username = decode(token).username;
    const checkUserLogin = await checkSessionUser(username);
    if(checkUserLogin) {
        return true;
    } else {
        return false;
    }
};

const login = async(username, password, req, res) => {

    const checkSession = await checkSessionUser(username);
    if(!checkSession) {

        const userData = await checkUserCredentials(username,password);

        if(userData) {
            const token = createToken(userData.id, userData.username);
            req.session.user = userData;
            addUserSession(userData.username, userData.id);
            res.json({auth: true, token: token, uuid: userData.id});
        } else {
            res.json({auth: false, message: "Username o Password errata"});
        }
    } else {
        res.json({auth: false, message: "Già stai loggat o frat stut t cos"});
        console.log("Login sta già");
    }
};


const isUserAuth = (req, res) => {
    verifyJWT(req,res);
};

const logout = (req, res) => {
    logOut(req,res);
};

module.exports = {
    isLogged,
    login,
    isUserAuth,
    logout
}