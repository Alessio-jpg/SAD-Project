const { WseCCDemon } = require('wse-cc')
const crypto = require("crypto")

function randomString(size = 21) {  
  return crypto
    .randomBytes(size)
    .toString('hex')
    .slice(0, size)
}

// Master server
const my_master_url = 'ws://localhost:5001/demons'

const demon = new WseCCDemon(my_master_url)

// ports range demon can use for cores.
demon.ports_range = [ 5000, 5100 ]

// how quickly demon will try to reconnect
// if master falls
demon.re_connect_time = 1500

demon.connect({
      id: 'demon-' + randomString(4),
      secret: 'ULTRA-SECRET-KEY',
    },
    {
      // by default master will recognise demon's host by IPv4
      // but you can use domain instead
      pub_host: 'localhost',
    })

console.log('starting...')

demon.on('ready', (e) => {
  console.log('ready', e)
})