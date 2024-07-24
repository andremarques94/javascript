(function() {
    console.log("Configuring...");

    // Opening new campuses? Just add limits-app id bellow!
    Reveal.getConfig().campuses = {
        ['lisboa-gotham']: 1,
        fundao: 2,
        terceira: 3,
        ['oportounity-darkmode']: 4,
        aveiro: 5,
        iscte: 6,
        utrecht: 7,
        migration: 8,
        arcade: 9,
        caboverde: 10,
        sintra: 11,
        ['lisboa-sin-city']: 12,
        ['lisboa-metropolis']: 15,
        ['oportounity-lightmode']: 13,
        ['oportounity-glass']: 16
    };

    // select theme based on campus location
    const codeForAllLocations = ["utrecht", "caboverde"];

    if (
        codeForAllLocations.some(function(location) {
            return window.location.host.startsWith(location);
        })
    ) {
        setCodeForAll();
    }

    function setCodeForAll() {
        document
            .getElementById("theme")
            .setAttribute("href", "css/theme/ac-codeforall.css");
        document.title = "<Code for All_>";
        let header = document.getElementById("cfa-header");
        if (header) {
            header.textContent = "<Code for All_> Bootcamp";
        }
    }
})();
