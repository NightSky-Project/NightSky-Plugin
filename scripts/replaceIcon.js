(function() {
    const newIconUrl = window.pluginAssets['newIcon'];

    function replaceSvgIcon() {
        const svgIcon = document.querySelector('div.r-1wtj0ep:nth-child(1) > div:nth-child(2) > svg:nth-child(1)');

        if (svgIcon) {
            const width = svgIcon.getAttribute('width') || '28px';
            const height = svgIcon.getAttribute('height') || '24.93px';

            const img = document.createElement('img');
            img.src = newIconUrl;
            img.width = width;
            img.height = height;
            img.alt = 'New Icon';

            svgIcon.parentNode.replaceChild(img, svgIcon);
        }
        else{
            console.warn('SVG icon not found');
        }
    }

    replaceSvgIcon();
})();
