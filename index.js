import dotenv from 'dotenv'
dotenv.config()
import Pusher from 'pusher';
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: "a23f34aeab88a463959e",
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

import { SerialPort }  from 'serialport'
import { ReadlineParser }  from '@serialport/parser-readline'
const serialport = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 })

var lines = ""
var linesCount = 0
function addLine(data){
	lines += data + "\n"
	linesCount ++
	console.log("got line num" + linesCount)
	if (linesCount > 10) // arbitrary amount
	{
		pusher.trigger('my-channel', 'my-event', {
		    message: lines,
		  });
		console.log(lines);
	linesCount = 0
	lines = ""
	}

}
const parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', addLine)


