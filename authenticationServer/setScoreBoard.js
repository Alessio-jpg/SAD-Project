const admin = require("firebase-admin");
const cron = require('node-cron');
const credentials = require("./key.json"); //change path
const { FieldValue } = require("@google-cloud/firestore");
/*
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
*/
const db = admin.firestore();


const updateScoreBoard = (id, value = 1) => {
    db.collection('scoreboard').doc(id).update({
        scoreW: FieldValue.increment(value),
        scoreM: FieldValue.increment(value),
        scoreA: FieldValue.increment(value)
    });
};



const scheduleScoreUpdate = () => {
    cron.schedule('0 0 * * 1', () => {
        db.collection('scoreboard').get().then(function(query) {
            query.forEach(function(doc) {
                doc.ref.update({
                    scoreW: 0
                });
            });
        });
    }, {
        timezone: "Europe/Rome",
        scheduled: true
    });


    cron.schedule('0 0 1 * *', () => {
        db.collection('scoreboard').get().then(function(query) {
            query.forEach(function(doc) {
                doc.ref.update({
                    scoreM: 0
                });
            });
        });
    }, {
        timezone: "Europe/Rome",
        scheduled: true
    });
};

module.exports = {scheduleScoreUpdate, updateScoreBoard};