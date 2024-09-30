(function() {
    function changeSvgIcon() {
        const svgIcon = document.querySelector('div.r-1wtj0ep:nth-child(1) > div:nth-child(2) > svg:nth-child(1) > path:nth-child(1)');

        if (svgIcon) {
            const svgElement = svgIcon.closest('svg');
            const gradientId = 'customGradient';

            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('style', 'stop-color: #f6bf75; stop-opacity: 1'); 

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '35%');
            stop2.setAttribute('style', 'stop-color: #d77185; stop-opacity: 1'); 

            const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop3.setAttribute('offset', '65%');
            stop3.setAttribute('style', 'stop-color: #8766ac; stop-opacity: 1');

            const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop4.setAttribute('offset', '100%');
            stop4.setAttribute('style', 'stop-color: #4150b1; stop-opacity: 1'); 

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);
            gradient.appendChild(stop4);

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.appendChild(gradient);

            svgElement.insertBefore(defs, svgElement.firstChild);
            svgIcon.setAttribute('fill', `url(#${gradientId})`);
        } else {
            // console.warn('SVG icon not found');
        }
    }


    function isRootUrl() { // Check if the current URL is the root that contains the SVG logo
        return window.location.pathname === '/';
    }

    // Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
    if (isRootUrl()) {
        if (document.readyState === 'complete') {
            changeSvgIcon();
        } else {
            document.addEventListener('DOMContentLoaded', changeSvgIcon);
            window.addEventListener('load', changeSvgIcon);
        }

        // Observe DOM changes and reapply if necessary
        const observer = new MutationObserver((mutations) => {
            changeSvgIcon();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

})();
