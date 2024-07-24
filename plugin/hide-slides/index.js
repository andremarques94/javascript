(function() {
    'use strict';
    var config = {
        episode: Reveal.getConfig().episode,
        campuses: Reveal.getConfig().campuses
    };

    if (!config.episode && !config.campuses) {
        return;
    }

    loadScript('plugin/hide-slides/nanoajax.js', 'script', function() {

        var campus = config.campuses[window.location.hostname.split(".")[0]]

        if (!campus) {
            throw Error(
                'host has no corresponding campus id.'
            );
        }

        var boundaryUrl =
            'https://api.noire.codeforall.io/api/campus/' +
            campus +
            '/boundary/' +
            config.episode;

        nanoajax.ajax(
            {
                url: boundaryUrl
            },
            function(code, response) {
                var boundary = JSON.parse(response);
                if (!boundary.horizontalBoundary || !boundary.verticalBoundary) {
                    throw Error('boundary is not an valid object');
                }
                setBoundary(boundary);
            }
        );
    });

    function setBoundary(boundary) {
        console.log(
            'Configured limits are: ' +
                boundary.horizontalBoundary +
                '/' +
                boundary.verticalBoundary
        );
        Reveal.addEventListener('slidechanged', function(event) {
            if (event.indexh > boundary.horizontalBoundary - 1) {
                Reveal.slide(boundary.horizontalBoundary - 1);
                return;
            }
            if (
                event.indexh === boundary.horizontalBoundary - 1 &&
                event.indexv > boundary.verticalBoundary - 1
            ) {
                Reveal.slide(boundary.horizontalBoundary - 1, boundary.verticalBoundary - 1);
            }
        });
    }

    // modified from math plugin
    function loadScript(url, type, callback) {
        var head = document.querySelector('head');
        var resource = document.createElement('script');
        resource.type = 'text/javascript';
        resource.src = url;

        // Wrapper for callback to make sure it only fires once
        var finish = function() {
            if (typeof callback === 'function') {
                callback.call();
                callback = null;
            }
        };

        resource.onload = finish;

        // IE
        resource.onreadystatechange = function() {
            if (this.readyState === 'loaded') {
                finish();
            }
        };

        // Normal browsers
        head.appendChild(resource);
    }
})();
