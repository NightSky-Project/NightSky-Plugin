
function addTrendingTopics() {
    const suggestedUsersDiv = document.querySelector('.r-sa2ff0');
    const trendingHtml = window.pluginAssets['opensky-plugin-default/html/trending-topics.html'];

    if (!suggestedUsersDiv || !trendingHtml) {
        if(!suggestedUsersDiv) {
            console.error('Suggested Users div not found');
        }
        if(!trendingHtml) {
            console.error('Trending Topics HTML not found');
        }
        return;
    }

    // Keep all divs up to the div that contains the button and remove the subsequent ones
    let keep = true;
    Array.from(suggestedUsersDiv.children).forEach((child) => {
        if (!keep) { // Remove all subsequent divs
            suggestedUsersDiv.removeChild(child);
            return;
        }

        // Check if there is a single div with a single button inside
        const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';

        // If the button is found, mark to stop removing subsequent divs
        if (button) {
            keep = false;
        }
    });

    // Create the new div for Trending Topics
    const trendingDiv = document.createElement('div');
    trendingDiv.innerHTML = trendingHtml; 
    trendingDiv.classList.add('css-175oi2r');

    // Insert the new Trending Topics div before the suggested users div
    suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);
}

function isRootUrl() {
    return window.location.pathname === '/search';
}

// Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
if (isRootUrl()) {
    if (document.readyState === 'complete') {
        addTrendingTopics();
    } else {
        document.addEventListener('DOMContentLoaded', addTrendingTopics);
        window.addEventListener('load', addTrendingTopics);
    }

    // Observe DOM changes and reapply if necessary
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            addTrendingTopics();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}
else {
    console.error('Trending Topics script not executed');
}
