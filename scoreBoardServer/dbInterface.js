const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();


const viewScoreboard = (date, res) => {
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
}


const selectUserScoreboard = async(id, date) =>{
    var val;
	const scoreCollection = db.collection('scoreboard');
	const query = scoreCollection.doc(id);
    const value = await query.get().then(snapshot => {
    	if(!snapshot.empty){
            val = {username: snapshot.data().username, score: snapshot.data()[date]}
            console.log(val);
            return val;
    	} else {
            return false;
        }
	});
    console.log(value);
	return value;
}


module.exports = {
	viewScoreboard,
	selectUserScoreboard
};
