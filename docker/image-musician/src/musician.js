/*
 * Include standard and third-party npm modules
 */
var net    = require('net');
var Docker = require('dockerode');

function getSoundFromInstrument(instrumentName)
{
    var instruments = new Map();
    instruments.set("piano",   "ti-ta-ti" );
    instruments.set("trumpet", "pouet"    );
    instruments.set("flute",   "trulu"    );
    instruments.set("violin",  "gzi-gzi"  );
    instruments.set("drum",    "boum-boum");
    return instruments.get(instrumentName);
}

function sendInstrument(socket, instrumentName)
{
    var sound = getSoundFromInstrument(instrumentName);
    socket.write(sound, "UTF-8", function () {});
}

function startClient (err, auditors)
{
    var PORT = 2205;
    var client = new net.Socket();
    client.connect(
        auditors[0].NetworkSettings.Networks.bridge.Port,
        auditors[0].NetworkSettings.Networks.bridge.IPAddress,
        function () {}
    );
    setInterval(
        function ()
        {
            sendInstrument(socket, process.argv[2]);
        },
        2000
    );
}

function lookForAuditorContainers (containersHaveBeenFound)
{
    var auditors = [];
    var docker = new Docker();
    docker.listContainers(
        function(err, containers)
        {
            console.log(err);
            containers.forEach(
                function( container)
                {
                    if (container.Image === "res/auditor")
                    {
                        auditors.push(container);
                    }
                }
            );
            containersHaveBeenFound(null, auditors.sort());
        }
    );
}


console.log(process.argv[2]);
lookForAuditorContainers(startClient);
