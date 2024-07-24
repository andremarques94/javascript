(function () {
    'use strict';

    var SEASON = 'season';

    var seasons = [
        { id: 0, name: 'The Flashback', path: SEASON + '-0.html' },
        { id: 1, name: 'Java and OOP', path: SEASON + '-1.html' },
        { id: 2, name: 'Advanced Java', path: SEASON + '-2.html' },
        { id: 3, name: 'Building Software', path: SEASON + '-3.html' },
        { id: 4, name: 'Going Pro', path: SEASON + '-4.html' },
        { id: 5, name: 'JavaScript', path: SEASON + '-5.html' }
    ]

    var campuses = Reveal.getConfig().campuses;

    if (!campuses) {
        return;
    }

    loadScript('../../plugin/hide-slides/nanoajax.js', 'script', function () {

        var campus = campuses[window.location.hostname.split(".")[0]]

        if (!campus) {
            throw Error(
                'host has no corresponding campus id.'
            );
        }

        var activeBoundariesUrl =
            'https://api.noire.codeforall.io/api/campus/' +
            campus +
            '/boundary?active=true';

        nanoajax.ajax(
            {
                url: activeBoundariesUrl
            },
            function (code, response) {
                var boundaries = JSON.parse(response);
                showSeasons(boundaries);
            }
        );
    });

    function showSeasons(boundaries) {
        // get active seasons
        var boundarySeasons = boundaries.map(boundary => boundary.episode.season)
            .sort((current, next) => current - next);
        var activeSeasons = [...new Set(boundarySeasons)];

        buildSeasonList(activeSeasons);
    }

    function buildSeasonList(activeSeasons) {
        var seasonList = document.getElementById('season-list');

        activeSeasons.forEach(id => {
            var li = document.createElement('li');
            var a = document.createElement('a');

            a.setAttribute('href', seasons.find(season => id === season.id).path);
            a.innerHTML = '<strong>Season ' + id + '</strong> - ' + seasons.find(({ id: seasonId }) => id === seasonId).name;
            li.appendChild(a);
            seasonList.appendChild(li);
        });
    }

    // modified from math plugin
    function loadScript(url, type, callback) {
        var head = document.querySelector('head');
        var resource = document.createElement('script');
        resource.type = 'text/javascript';
        resource.src = url;

        // Wrapper for callback to make sure it only fires once
        var finish = function () {
            if (typeof callback === 'function') {
                callback.call();
                callback = null;
            }
        };

        resource.onload = finish;

        // IE
        resource.onreadystatechange = function () {
            if (this.readyState === 'loaded') {
                finish();
            }
        };

        // Normal browsers
        head.appendChild(resource);
    }
})();
