const express = require('express');
const http = require('http');
const port = 4000;
const mysql = require('mysql');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require("express-session");
const cors = require('cors');

const admin = require("firebase-admin");
const credentials = require("./key.json");
//const { send } = require('process');

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


admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore();


/* Registretion call */

app.post("/register", (req, res) => {
    const {username , password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {

        db.collection("users").add({
            username: username,
            password: hash
        }).then((result) => {
            res.send("Utent registrato");
        }).catch((error) => {
            res.status(400).json({err: error, message: "Errore nell'inserimento del db"});
        });
    });
});



const addUserSession = (username,id) => {
    db.collection("session").doc(id).set({
        username: username,
    }).then((result) => {
        //console.log(result);
    }).catch((error) => {
        console.log(error);
    });
}


app.get("/isLogged", (req, res) => {
    if(req.session.user) {
        res.json({loggedIn: true, message: "e comm stai fort"});
    } else {
        res.json({loggedIn: false, message: 'iesc for'});
    }
})

app.post("/login", (req, res) => {
    console.log("ci sono nel login");
    const username = req.body.username; 
    const password = req.body.password;
    var dbId = "";
    var dbPassword = "";
    var dbUsername = "";

    const sessionCollection = db.collection('session');
    const query1 = sessionCollection.where('username', '==', username);
    query1.get().then(snapshot1 => {
        if(snapshot1.empty) {
            const usersCollection = db.collection('users');
            const query = usersCollection.where('username', '==', username);
            query.get().then(snapshot => {
            if(!snapshot.empty) {
                
                snapshot.forEach(user => {
                    dbId = user.id;
                    dbUsername = user.data().username;
                    dbPassword = user.data().password;
                });
    
                const userData = {
                    id: dbId,
                    username: dbUsername,
                    password: dbPassword
                }
    
                bcrypt.compare(password, userData.password, (error, response) => {
                    if(response) {
                        const token = jwt.sign({id: userData.id, username: userData.username}, "{Wt%98WO*1m)jp2", {
                            expiresIn: 30,
                        });
                        req.session.user = userData;
                        addUserSession(userData.username, userData.id);
                        console.log("Login ok");
                        res.json({auth: true, token: token});
                    } else {
                        res.json({auth: false, message: "Username o password errati"});
                        console.log("Login no ok");
                    }
                });
            } else {
                res.json({auth: false, message: "L'utente non esiste"});
                console.log("Login non esiste");
            }
            })
            .catch(error => {
                res.status(400).json({error: error});
                console.log("Login err");
            });
        } else {
            res.json({auth: false, message: "Già stai loggat o frat stut t cos"});
            console.log("Login sta già");
        }
    });
});



const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.json({auth: false, message: "Fratm, cacc o token"});
    } else {
        jwt.verify(token, "{Wt%98WO*1m)jp2", (err, decoded) => {
            if(err) {
                res.json({auth: false, message: "fratm, o token è pezzotto"});
                const userId = req.session.user.id;
                db.collection('session').doc(userId).delete();
                req.session.destroy();
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get("/isUserAuth", verifyJWT , (req, res) => {
    res.json({auth: true, message: "Fratttm, stai conness"});
});

app.get("/logout", (req, res) => {
    const userId = req.session.user.id;
    db.collection('session').doc(userId).delete();
    req.session.destroy();
    res.json({logout: true, message: "Sei fuori"});
});


app.listen(port);
console.log("App " + port);