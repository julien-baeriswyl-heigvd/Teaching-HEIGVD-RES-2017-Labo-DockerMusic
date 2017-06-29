/*
 * Include standard and third-party npm modules
 */
var net      = require('net');
var readline = require('readline');

var clients = new Map();
var count   = 0;

function getInstrumentFromSound (sound)
{
    var instruments = new Map();
    instruments.set("ti-ta-ti",  "piano"  );
    instruments.set("pouet",     "trumpet");
    instruments.set("trulu",     "flute"  );
    instruments.set("gzi-gzi",   "violin" );
    instruments.set("boum-boum", "drum"   );
    return instruments.get(sound);
}

function addClient (client)
{
    var rl = readline.createInterface(
        {
            input: client,
            output: client
        }
    );
    
    var idx = count++;
    clients.set(idx, "");
    
    var time = 0;
    
    rl.on(
        'line',
        function (data)
        {
            clients[idx] = getInstrumentFromSound(data);
            time = Date.now();
            console.log(data);
        }
    );
    
    setInterval(
        function ()
        {
            if (Date.now() - time > 5000)
            {
                clients[idx] = "";
            }
        },
        5000
    );
    
    setInterval(
        function ()
        {
            var instruments = [];
            clients.forEach(
                function (item)
                {
                    if (item.length > 0)
                    {
                        instruments.push(item);
                    }
                }
            );
            
            console.log(JSON.stringify(instruments));
            
            client.write(JSON.stringify(instruments));
        },
        5000
    );
}

function startServer ()
{
    var server = new net.createServer();
    server.on('connection', addClient);
    server.listen(2205);
    
    setInterval(
        function ()
        {
            console.log("PIZZA");
        },
        5000
    );
}

startServer();
