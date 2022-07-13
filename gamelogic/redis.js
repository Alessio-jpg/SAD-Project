const redis = require("redis")
// Consts

const db = 0;
const notificationChannel = "__keyspace@" + db + "__:queue:predictions:";

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
    client.configSet("notify-keyspace-events","KA");
}

const subClient = client.duplicate();
function redis_subscribe(id,func) {
    subClient.connect();

    subClient.pSubscribe(notificationChannel + id, func);
}

async function redis_pop(from) {
    var data = await client.RPOP(from, (err, reply) => {
        if (err) throw err;
        return reply;
    });
    return JSON.parse(data);
}

function redis_push(to, data) {
    client.RPUSH(to, JSON.stringify(data), (err, reply) => {
        if (err) throw err;
        return reply;
    });
}

module.exports = {redis_connect, redis_enable_keyevent_notification, redis_subscribe, redis_pop, redis_push} // 👈 Export funcs