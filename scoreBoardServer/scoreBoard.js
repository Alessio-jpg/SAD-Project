const express = require('express');
const http = require('http');
const port = 4001;
const app = express();
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

const {viewScoreboard,selectUserScoreboard} = require("./dbInterface");

app.post("/viewScoreboard", async (req, res) => {
    const date = req.body.date;
    const score = await viewScoreboard(date);
    if(score){
    	res.send(score);
    } else {
    	res.send("Classifica vuota")
    }
});


app.post("/selectUserScoreboard", async (req, res) => {
    const id = req.body.id;
    const date = req.body.date;
    const score = await selectUserScoreboard(id, date);
    console.log(score);
    if(score){
    	res.send(score);
    } else {
    	res.send("Giocatore non presente")
    }
});


app.listen(port);
console.log("App " + port);




