const express = require('express');
const http = require('http');
const port = 4001;
const app = express();
const cors = require('cors');

const admin = require("firebase-admin");
const credentials = require("../authenticationServer/key.json");


app.use(express.json());

app.use(express.urlencoded({extended: true}));


app.use(
    cors({
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    })
);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})


const db = admin.firestore();


app.post("/viewScoreboard", (req, res) => {
    const date = req.body.date;
    var score = [];
    
    const query = db.collection('scoreboard').select(date, 'username').orderBy(date, 'desc');
    query.get().then(snapshot => {
        if(!snapshot.empty) {
            
            snapshot.forEach(user => {
                score.push(user.data());
            });
            
            res.send(score);
        } else {
            res.send("Classifica vuota");
        }
    }).catch(error => {
        console.log(error);
    })
});


app.listen(port);
console.log("App " + port);