(function () {
    'use strict';

    var EPISODE_BASE_PATH = 'season-';

    var episodes = [
        // season 0 episodes
        { id: 2, path: 'ep-01-numbers.html' },
        { id: 1, path: 'ep-02-electricity.html' },
        { id: 10, path: 'ep-03-boole.html' },
        { id: 3, path: 'ep-04-digital.html' },
        { id: 4, path: 'ep-05-computer.html' },
        { id: 5, path: 'ep-06-os.html' },
        { id: 6, path: 'ep-07-intro.html' },
        { id: 7, path: 'ep-08-vcs.html' },

        // season 1 episodes
        { id: 8, path: 'ep-01-java.html' },
        { id: 9, path: 'ep-02-oop-intro.html' },
        { id: 11, path: 'ep-03-static.html' },
        { id: 37, path: 'ep-04-enum.html' },
        { id: 38, path: 'ep-05-composition.html' },
        { id: 39, path: 'ep-06-inheritance.html' },
        { id: 40, path: 'ep-07-polymorphism.html' },
        { id: 41, path: 'ep-08-interfaces.html' },
        { id: 42, path: 'ep-09-exceptions.html' },
        { id: 43, path: 'ep-10-simple-gfx.html' },
        { id: 44, path: 'ep-11-collections.html' },
        { id: 45, path: 'ep-12-nested-classes.html' },
        { id: 46, path: 'ep-13-io.html' },

        // season 2 episodes
        { id: 13, path: 'ep-01-network.html' },
        { id: 14, path: 'ep-02-intro-web.html' },
        { id: 15, path: 'ep-03-concurrency.html' },
        { id: 36, path: 'ep-04-functional.html' },

        // season 3 episodes
        { id: 17, path: 'ep-00-prompt-view.html' },
        { id: 16, path: 'ep-01-software-engineering.html' },
        { id: 12, path: 'ep-02-doc.html' },
        { id: 19, path: 'ep-03-design-patterns.html' },
        { id: 18, path: 'ep-04-javabank-intro.html' },
        { id: 20, path: 'ep-05-maven.html' },
        { id: 21, path: 'ep-06-testing.html' },
        { id: 23, path: 'ep-07-databases.html' },
        { id: 24, path: 'ep-08-jdbc.html' },
        { id: 22, path: 'ep-09-debugger.html'},

        // season 4 episodes
        { id: 25, path: 'ep-01-hibernate.html' },
        { id: 26, path: 'ep-02-daos.html' },
        { id: 27, path: 'ep-03-spring.html' },
        { id: 47, path: 'ep-04-frontend.html' },
        { id: 28, path: 'ep-05-java-web.html' },
        { id: 48, path: 'ep-06-spring-mvc.html' },
        { id: 49, path: 'ep-07-web-services.html' },

        // season 5 episodes
        { id: 29, path: 'ep-01-js-fundamentals.html' },
        { id: 30, path: 'ep-02-web-development.html' },
        { id: 31, path: 'ep-03-jquery.html' },
        { id: 32, path: 'ep-04-jsdeep.html' },
        { id: 33, path: 'ep-05-jsasync.html' },
        { id: 34, path: 'ep-06-jsnext.html' },
        { id: 35, path: 'ep-07-react.html' }
    ];

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
                showEpisodes(boundaries);
            }
        );
    });

    function showEpisodes(boundaries) {
        var boundariesSeasons = boundaries.map(boundary => boundary.episode.season);
        var activeSeasonIds = [...new Set(boundariesSeasons)];

        activeSeasonIds.forEach(seasonId => {
            var ul = document.getElementById(EPISODE_BASE_PATH + seasonId);

            if (ul === null) {
                return;
            }

            var seasonSpecificBoundaries = boundaries.filter(({ episode }) => episode.season === seasonId);
            buildHtml(seasonSpecificBoundaries, seasonId, ul);
        });
    }

    function buildHtml(boundaries, seasonId, ul) {
        boundaries.forEach(({ episode }) => {
            var li = document.createElement('li');
            var a = document.createElement('a');

            var pathToEpisode = episodes.find(({ id }) => episode.id === id).path

            a.setAttribute('href', EPISODE_BASE_PATH + seasonId + '-' + pathToEpisode);
            a.innerHTML = episode.episodeName;
            li.appendChild(a);
            ul.appendChild(li);
        })
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
