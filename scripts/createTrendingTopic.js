function addTrendingTopics() {
    const trendingTopicsAlreadyAdded = document.querySelector('.trending-topics');
    if (trendingTopicsAlreadyAdded) {
        return;
    }

    let suggestedUsersDiv = document.querySelector('div.r-1d5kdc7:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)');
    if (!suggestedUsersDiv) {
        suggestedUsersDiv = document.querySelector('.r-sa2ff0');
    }

    if (!suggestedUsersDiv) {
        console.error('Suggested Users div not found');
        return;
    }

    // Keep all divs up to the div that contains the button and remove the subsequent ones
    let keep = true;
    let feedDivsRemoved = false;
    Array.from(suggestedUsersDiv.children).forEach((child) => {
        if (!keep) { // Remove all subsequent divs
            suggestedUsersDiv.removeChild(child);
            return;
        }

        // Check if there is a single div with a single button inside
        const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';

        if (button) {
            keep = false;
        }
        feedDivsRemoved = true;
    });

    // Create the new div for Trending Topics
    const trendingDiv = document.createElement('div');
    trendingDiv.classList.add('trending-topics');
    trendingDiv.classList.add('css-175oi2r');
    suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);

    function callGetTrends() {
        try {
            if(!feedDivsRemoved) {
                throw new Error('Feed divs not removed yet');
            }
            window.getTrends();
        } catch (error) {
            console.warn('Error calling getTrends', error);
            setTimeout(callGetTrends, 1000);
        }
    }

    callGetTrends();
}

function isRootUrl() {
    return window.location.pathname === '/search';
}

// Observe URL changes and reapply if necessary
function onUrlChange(callback) {
    let oldHref = document.location.href;

    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            callback();
        }
    });

    observer.observe(body, { childList: true, subtree: true });

    window.addEventListener('popstate', () => {
        callback();
    });
}

// Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
function initTrendingTopics() {
    if (isRootUrl()) {
        if (document.readyState === 'complete') {
            addTrendingTopics();
        } else {
            document.addEventListener('DOMContentLoaded', addTrendingTopics);
            window.addEventListener('load', addTrendingTopics);
        }
    }
}

// Initialize on page load
initTrendingTopics();

// Reinitialize on URL change
onUrlChange(initTrendingTopics);