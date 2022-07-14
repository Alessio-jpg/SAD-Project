const express = require('express');
const http = require('http');
const port = 4000;

const app = express();
const session = require("express-session");
const cors = require('cors');

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(
    cors({
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    })
);

app.use(
    session({
      key: "userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
    })
);

const { isLogged, login, isUserAuth, logout} = require("./modules/login");
const {register} = require("./modules/registration");
const {updateScoreBoard} = require("./setScoreBoard");

app.post("/register", async(req, res) => {
    const {username , password} = req.body;
    register(username,password,res);
});


app.get("/isLogged", async(req, res) => {
    const token = req.headers["x-access-token"];
    const isLog = await isLogged(token);
    if(isLog) {
        res.json({loggedIn: true, message: "user logged"});
    } else {
        res.json({loggedIn: false, message: 'user not logged'});
    }
});

app.post("/login", async(req, res) => {
    const username = req.body.username; 
    const password = req.body.password;

    login(username, password, req, res);
});


app.get("/isUserAuth", (req, res) => {
    isUserAuth(req,res);
});

app.get("/logout", (req, res) => {
    logout(req,res);
});

/*
app.post("/updateScoreBoard", (req,res) => {
    const id = req.body.id;
    updateScoreBoard(id)
    res.send("Aggiornato");
});*/


app.listen(port);
console.log("App " + port);