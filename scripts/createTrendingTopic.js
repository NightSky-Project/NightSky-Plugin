console.log('Trending topics script loaded');   
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

    if(!document.querySelector('.trending-topics')) {
        const trendingDiv = document.createElement('div');
        trendingDiv.classList.add('trending-topics', 'css-175oi2r');
        suggestedUsersDiv.insertBefore(trendingDiv, suggestedUsersDiv.firstChild);
    }

    function callGetTrends() {
        try {
            if(!window.getTrends) {
                setTimeout(callGetTrends, 500);
                return;
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

let called = false;
function onUrlChange() {
    const body = document.querySelector("body");

    const observer = new MutationObserver(() => {
        if (isSearchUrl()) {
            const readyState = document.readyState;
            if (readyState === 'complete') {
                if (!document.querySelector('.trending-topics') && !called) {
                    setTimeout(() => {
                        console.log('Adding trending topics on complete');
                        window.addTrendingTopics();
                    }, 1000);
                    called = true;
                }
            } else {
                window.addEventListener('load', () => {
                    if (!document.querySelector('.trending-topics') && !called) {
                        setTimeout(() => {
                            console.log('Adding trending topics on load');
                            window.addTrendingTopics();
                        }, 1000);
                        called = true;
                    }
                });
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
        onUrlChange();
    });
}

onUrlChange();