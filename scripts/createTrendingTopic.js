isAddingTrendingTopics = false;
trendingTopicsObserver = null;

function addTrendingTopics() {
    if (isAddingTrendingTopics) return;
    
    isAddingTrendingTopics = true;
    const trendingTopicsAlreadyAdded = document.querySelector('.trending-topics');
    if (trendingTopicsAlreadyAdded) {
        isAddingTrendingTopics = false;
        return;
    }

    let suggestedUsersDiv = document.querySelector('div.r-1d5kdc7:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)');
    if (!suggestedUsersDiv) {
        suggestedUsersDiv = document.querySelector('.r-sa2ff0');
    }

    if (!suggestedUsersDiv) {
        console.error('Suggested Users div not found');
        isAddingTrendingTopics = false;
        return;
    }

    let feedDivsRemoved = false;

    function removeFeedDivs() {
        const children = Array.from(suggestedUsersDiv.children);
        let keep = true;
        let removedAny = false;

        children.forEach((child) => {
            if (!keep) {
                suggestedUsersDiv.removeChild(child);
                removedAny = true;
                return;
            }

            const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';
            if (button) keep = false;
        });

        if (removedAny) {
            feedDivsRemoved = true;
        } else {
            feedDivsRemoved = children.every(child => !keep || child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON');
        }
    }

    function tryRemoveFeedDivs() {
        removeFeedDivs();

        if (!feedDivsRemoved) {
            console.error('Feed divs not removed');
            setTimeout(tryRemoveFeedDivs, 500); 
            return;
        }

        if (!document.querySelector('.trending-topics')) {
            const trendingDiv = document.createElement('div');
            trendingDiv.classList.add('trending-topics', 'css-175oi2r');

            if (suggestedUsersDiv && suggestedUsersDiv.parentNode) {
                suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);
            } else {
                console.error('Suggested Users div has no parent node');
                isAddingTrendingTopics = false;
                return;
            }

            function callGetTrends() {
                try {
                    window.getTrends();
                } catch (error) {
                    console.warn('Error calling getTrends', error);
                    setTimeout(callGetTrends, 500);
                } finally {
                    isAddingTrendingTopics = false;
                }
            }

            callGetTrends();
        }

        if (trendingTopicsObserver) {
            trendingTopicsObserver.disconnect(); // Stop observing after successful insertion
        }
        isAddingTrendingTopics = false; // Reset flag after execution
    }

    // Observe changes in the suggestedUsersDiv to ensure divs are removed
    if (!trendingTopicsObserver) {
        trendingTopicsObserver = new MutationObserver(() => {
            if (!feedDivsRemoved) tryRemoveFeedDivs();
        });

        trendingTopicsObserver.observe(suggestedUsersDiv, { childList: true, subtree: true });
    }

    setTimeout(tryRemoveFeedDivs, 300); // Add a small delay to ensure elements are in the DOM
}

function isRootUrl() {
    return window.location.pathname === '/search';
}

function onUrlChange(callback) {
    let oldHref = document.location.href;
    const body = document.querySelector("body");

    const observer = new MutationObserver(() => {
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

// function initTrendingTopics() {
//     if (isRootUrl()) {
//         if (document.readyState === 'complete') {
//             addTrendingTopics();
//         } else {
//             document.addEventListener('DOMContentLoaded', addTrendingTopics);
//             window.addEventListener('load', addTrendingTopics);
//         }
//     }
// }

// initTrendingTopics();
onUrlChange(initTrendingTopics);
