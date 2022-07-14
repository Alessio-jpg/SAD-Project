const bcrypt = require('bcrypt');
const admin = require("firebase-admin");

const credentials = require("../key.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();


const checkSessionUser = (username) => {
    const sessionCollection = db.collection('session');
    const query = sessionCollection.where('username', '==', username);
    const value = query.get().then(snapshot => {
        if(snapshot.empty) {
            return false;
        } else {
            return true;
        }
    });
    
    return value;
}

const checkUserCredentials = (username, password) => {
    var dbId, dbUsername, dbPassword;
    const usersCollection = db.collection('users');
    const query = usersCollection.where('username', '==', username);
    const returnValue = query.get().then(async(snapshot) => {
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
            const compare = await bcrypt.compare(password, userData.password);
            
            if(compare) {
                return userData;
            } else {
                return false;
            }
            
        } else {
            //res.json({auth: false, message: "L'utente non esiste"});
            console.log("Login non esiste");
        }
    })
    .catch(error => {
        //res.status(400).json({error: error});
        console.log(error);
    });
    
    return returnValue;
}


const logOut = (req, res) => {
    const userId = req.session.user.id;
    db.collection('session').doc(userId).delete();
    req.session.destroy();
    res.json({logout: true, message: "Sei fuori"});
}


const addUserSession = (username,id) => {
    db.collection("session").doc(id).set({
        username: username,
    }).then((result) => {
        //console.log(result);
    }).catch((error) => {
        console.log(error);
    });
}

const addUser = async (username, password, res) => {
    
    return bcrypt.hash(password, 10).then( async (hash) => {
        
        return await db.collection("users").add({
            username: username,
            password: hash
        }).then((result) => {
            res.send("Utente registrato");
            console.log(result.id);
            return result.id;
        }).catch((error) => {
            res.send("Utente non registrato");
        });
        
    });
} 

const initializeUserScore = (id, username) => {
    console.log("USER SCORE: ", id ," - ", username)
    
    db.collection("scoreboard").doc(id).set({
        username: username,
        scoreW: 0,
        scoreM: 0,
        scoreA: 0
    }).then((result) => {
        console.log('score creato')
    }).catch((error) => {
        console.log(error);
    });
    
}

const deleteUserSession = (userId) => {
    db.collection('session').doc(userId.id).delete();
}


module.exports = {
    checkSessionUser, 
    checkUserCredentials, 
    logOut, 
    addUserSession, 
    addUser, 
    initializeUserScore, 
    deleteUserSession
};
