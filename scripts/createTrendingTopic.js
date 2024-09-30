var isAddingTrendingTopics = false;
var trendingTopicsObserver = null;

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
                if (suggestedUsersDiv.contains(child)) {
                    suggestedUsersDiv.removeChild(child);///////////
                }
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

            try{
                if (suggestedUsersDiv && suggestedUsersDiv.parentNode) {
                    suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);
                } else {
                    console.error('Suggested Users div has no parent node');
                    return;
                }
            } catch (error) {
                console.error('Error adding trending topics', error);
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
                } finally {
                    isAddingTrendingTopics = false;
                }
            }

            callGetTrends();
        }
    }

    tryRemoveFeedDivs();
}

function isSearchUrl() {
    return window.location.pathname === '/search';
}

function onUrlChange() {
    const body = document.querySelector("body");

    const observer = new MutationObserver(() => {
        if(isSearchUrl()) {
            const readyState = document.readyState;
            if(readyState === 'complete') {
                addTrendingTopics();
            } else {
                window.addEventListener('load', addTrendingTopics);
            }
        } else{
            const trendingTopics = document.querySelector('.trending-topics');
            if(trendingTopics) {
                trendingTopics.remove();
            }
        }
    });

    observer.observe(body, { childList: true, subtree: true });
    // window.addEventListener('popstate', () => {
    //     callback();
    // });
}

// function initTrendingTopics() {
//     if (isSearchUrl()) {
//         if (document.readyState === 'complete') {
//             addTrendingTopics();
//         } else {
//             // document.addEventListener('DOMContentLoaded', addTrendingTopics);
//             window.addEventListener('load', addTrendingTopics);
//         }
//     }
// }

onUrlChange();
