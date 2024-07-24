(function() {
    // Enables multiplex, blocking the clients keyboard.
    // Presentation master must have a token which will be used
    // as an argument for 's' in the query string
    Reveal.getConfig().multiplex = {
        ['lisboa-gotham']: {
            url: "http://socketio.academiadecodigo.org:1948",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        ['lisboa-metropolis']: {
            url: "http://socketio.academiadecodigo.org:1949",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        terceira: {
            url: "http://socketio.academiadecodigo.org:1950",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        ['oportounity-darkmode']: {
            url: "http://socketio.academiadecodigo.org:1951",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        ['lisboa-sin-city']: {
            url: "http://socketio.academiadecodigo.org:1953",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        workshop: {
            url: "http://socketio.academiadecodigo.org/remote:1955",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        ['oportounity-lightmode']: {
            url: "http://socketio.academiadecodigo.org:1956",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        },
        ['oportounity-glass']: {
            url: "http://socketio.academiadecodigo.org:1957",
            id: "907872b700b886a4",
            secret: Reveal.getQueryHash().s || null
        }
    };
})();
