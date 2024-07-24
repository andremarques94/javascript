(function() {
    var multiplex = Reveal.getConfig().multiplex;

    var location = Object.keys(multiplex).find(function(location) {
        return window.location.host.startsWith(location);
    });

    multiplex = multiplex[location];

    if (!multiplex) {
        throw new Error('client: multiplex not configured!');
    }

    var socketId = multiplex.id;
    var socket;

    socket = io.connect(multiplex.url);

    //ignore client configurations if token from master presentation is found
    if (multiplex.secret) {
        console.log('Found Secret: ', multiplex.secret);
        console.log('Multiplex server enabled with key ' + socketId + ' on ' + multiplex.url);
        return;
    } else if (!window.location.host.startsWith('localhost')) {
        console.log('Multiplex client enabled with key ' + socketId + ' on ' + multiplex.url);
    } else {
        return;
    }

    socket.on(multiplex.id, function(data) {

        console.log('received websocket message:', data);

        // ignore data from sockets that aren't ours
        if (data.socketId !== socketId ||
            window.location.host.startsWith('localhost')) {
            return;
        }

        Reveal.setState(data.state);
        Reveal.configure({
            keyboard: false
        });

    });

}());
