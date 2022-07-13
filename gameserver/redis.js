const redis = require("redis")
// Consts

const db = 0;
const notificationChannel = "__keyevent@" + db + "__:lpush";

const client = redis.createClient();


// funcs
client.on('error', err => {
    console.log('Error ' + err);
  });

client.on('connect', function(){
    console.log('Connected to redis instance');
}); 

function redis_connect() {
    client.connect();
}

function redis_enable_keyevent_notification() {
    client.configSet("notify-keyspace-events","EA");
}

const subClient = client.duplicate();
function redis_subscribe(func) {
    subClient.connect();

    subClient.pSubscribe(notificationChannel, func);
}

async function redis_pop(from) {
    var data = await client.RPOP(from);
    return JSON.parse(data);
}

function redis_push(to, data) {
    client.RPUSH(to, JSON.stringify(data), (err, reply) => {
        if (err) throw err;
        return reply;
    });
}

module.exports = {redis_connect, redis_enable_keyevent_notification, redis_subscribe, redis_pop, redis_push} // 👈 Export funcs