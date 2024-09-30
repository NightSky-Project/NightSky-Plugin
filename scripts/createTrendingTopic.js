console.log('Trending topics script loaded');   
var removedFeeds = false;
function addTrendingTopics() {
    const trendingTopicsAlreadyAdded = document.querySelector('.trending-topics');
    if (trendingTopicsAlreadyAdded) {
        return;
    }

    let suggestedUsersDiv = document.querySelector('div.r-1d5kdc7:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)');
    if(!suggestedUsersDiv) {
        suggestedUsersDiv = document.querySelector('.r-sa2ff0');  
    }

    if (!suggestedUsersDiv) {
        if(!suggestedUsersDiv) {
            console.error('Suggested Users div not found');
        }
        return;
    }

    console.log('Adding trending topics');
    // Keep all divs up to the div that contains the button and remove the subsequent ones
    let keep = true;
    console.log(suggestedUsersDiv.children.length);
    if(!removedFeeds && suggestedUsersDiv.children.length > 5) {
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
        });
        removedFeeds = true;
    } else {
        setTimeout(() => {
            addTrendingTopics();
        }, 1000);
        return;
    }

    function callGetTrends() {
        if(!removedFeeds)return;
        try {
            if(!window.getTrends) {
                setTimeout(callGetTrends, 500);
                return;
            }
            if(!document.querySelector('.trending-topics')) {
                const trendingDiv = document.createElement('div');
                trendingDiv.classList.add('trending-topics', 'css-175oi2r');
                suggestedUsersDiv.insertBefore(trendingDiv, suggestedUsersDiv.firstChild);
            }
            window.getTrends();
        } catch (error) {
            console.warn('Error calling getTrends', error);
        }
    }

    callGetTrends();
}

(function() {
    if(!window.addTrendingTopics){
        window.addTrendingTopics = addTrendingTopics;
    }
})();

function isSearchUrl() {
    return window.location.pathname === '/search';
}

var called = false;
function onUrlChange() {
    const body = document.querySelector("body");

    const observer = new MutationObserver(() => {
        if (isSearchUrl()) {
            if (!document.querySelector('.trending-topics') && !called) {
                console.log('Adding trending topics on URL change');
                window.addTrendingTopics();
                called = true;
            }
        } else {
            const trendingTopics = document.querySelector('.trending-topics');
            if (trendingTopics) {
                trendingTopics.remove();
                called = false;
            }
        }
    });

    observer.observe(body, { childList: true, subtree: true });

    window.addEventListener('popstate', () => {
        called = false;
        observer.disconnect();
        onUrlChange();
    });
}

onUrlChange();
