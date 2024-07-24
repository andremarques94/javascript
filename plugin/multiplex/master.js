(function() {

    // Don't emit events from inside of notes windows
    if (window.location.search.match(/receiver/gi)) {
        return;
    }

    var multiplex = Reveal.getConfig().multiplex;

    var location = Object.keys(multiplex).find(function(location) {
        return window.location.host.startsWith(location);
    });

    multiplex = multiplex[location];

    if (!multiplex) {
        throw new Error('master: multiplex not configured!');
    }

    var socket = io.connect(multiplex.url);

    function post() {

        var messageData = {
            state: Reveal.getState(),
            secret: multiplex.secret,
            socketId: multiplex.id
        };

        if (messageData.state.overview) {
            return;
        }

        console.log('sending websocket message', messageData);
        socket.emit('multiplex-statechanged', messageData);

    };

    // Monitor events that trigger a change in state
    Reveal.addEventListener('slidechanged', post);
    Reveal.addEventListener('fragmentshown', post);
    Reveal.addEventListener('fragmenthidden', post);
    Reveal.addEventListener('overviewhidden', post);
    //Reveal.addEventListener('overviewshown', post);
    Reveal.addEventListener('paused', post);
    Reveal.addEventListener('resumed', post);

}());
