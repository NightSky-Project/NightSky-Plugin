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
    console.log("Adding trending topics");

    function removeFeedDivs() {
        const feedRemoved = suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].childElementCount === 1 && suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].children[0].childElementCount === 1 && suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].children[0].children[0].tagName === 'BUTTON';
        if(feedRemoved) return;
        const children = Array.from(suggestedUsersDiv.children);
        let keep = true;

        children.forEach((child) => {
            if (!keep) {
                if (suggestedUsersDiv.contains(child)) {
                    suggestedUsersDiv.removeChild(child);
                }
                removedAny = true;
                return;
            }

            const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';
            if (button) keep = false;
        });
    }

    function tryRemoveFeedDivs() {
        removeFeedDivs();
        // verifica se a ultima div de suggestedUsersDiv é um botão
        const feedRemoved = suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].childElementCount === 1 && suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].children[0].childElementCount === 1 && suggestedUsersDiv.children[suggestedUsersDiv.children.length - 1].children[0].children[0].tagName === 'BUTTON';

        if (!feedRemoved) {
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
                }
            }

            callGetTrends();
        }
    }

    tryRemoveFeedDivs();
}

function addTrendingTopicsFunction() {
    if(!window.addTrendingTopics){
        window.addTrendingTopics = addTrendingTopics;
    }
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
                window.addTrendingTopics();
                window.removeEventListener('load', addTrendingTopicsFunction);

            } else {
                window.addEventListener('load', addTrendingTopicsFunction);
            }
        } else{
            const trendingTopics = document.querySelector('.trending-topics');
            if(trendingTopics) {
                trendingTopics.remove();
                window.removeEventListener('load', addTrendingTopicsFunction);
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
