(function() {
    const newIconUrl = window.pluginAssets['newIcon'];

    function replaceSvgIcon() {
        const svgIcon = document.evaluate('/html/body/div[1]/div/div/div[1]/div/div/div[1]/div/div/div/div/div/div[1]/div/svg', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

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
