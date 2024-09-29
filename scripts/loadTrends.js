async function getTrends() {
    const trendingTopicsDiv = document.querySelector('.trending-topics');
    if (!trendingTopicsDiv) {
        setTimeout(getTrends, 1000);
    }
    const lang = navigator.language.startsWith('pt') ? 'pt' : 'en';
    console.log('lang', lang);
    const apiUrl = `https://bsky-trends.deno.dev/trend?lang=${lang}`;

    const translations = {
        categories: {
            science: { en: 'Science', pt: 'Ciência' },
            music: { en: 'Music', pt: 'Música' },
            politics: { en: 'Politics', pt: 'Política' },
            entertainment: { en: 'Entertainment', pt: 'Entretenimento' },
            sports: { en: 'Sports', pt: 'Esportes' },
            technology: { en: 'Technology', pt: 'Tecnologia' },
            health: { en: 'Health', pt: 'Saúde' },
            none: { en: '', pt: '' },
            lgbt: { en: 'LGBT', pt: 'LGBT' },
            economy: { en: 'Economy', pt: 'Economia' },
            education: { en: 'Education', pt: 'Educação' },
            environment: { en: 'Environment', pt: 'Meio Ambiente' },
            food: { en: 'Food', pt: 'Comida' },
            lifestyle: { en: 'Lifestyle', pt: 'Estilo de Vida' },
            religion: { en: 'Religion', pt: 'Religião' },
            social: { en: 'Social', pt: 'Social' },
            travel: { en: 'Travel', pt: 'Viagem' }
        },
        posts: {
            en: 'k Posts',
            pt: 'mil Posts'
        },
        showMore: {
            en: 'Show more',
            pt: 'Mostrar mais'
        },
        trendingTopics: {
            en: 'Trending Topics',
            pt: 'Tópicos em Alta'
        }
    };

    function requestSavedTrends(pluginSlug, data) {
        // Send a message to the WebView to fetch the trends
        window.ReactNativeWebView.postMessage(JSON.stringify({
            messageType: 'FETCH_DATA',
            name: `${pluginSlug}-trends`,
            data: data,
        }));
    }

    function saveTrends(pluginSlug, data) {
        // Send a message to the WebView to save the trends
        window.ReactNativeWebView.postMessage(JSON.stringify({
            messageType: 'SAVE_DATA',
            name: `${pluginSlug}-trends`,
            data: data,
            time: Date.now(),
        }));
    }

    try {
        let trends = [];
        let savedTrends = [];
        let timeSavedTrends = 0;

        window.receiveData = function(slug, content) {
            if (!content) {
                return;
            }
            savedTrends = JSON.parse(content.data);
            timeSavedTrends = content.time;
        }

        requestSavedTrends('nightsky-plugin-default', 'trending-topics');

        if(savedTrends.length === 0 || Date.now() - timeSavedTrends > 1000 * 60 * 10) {
            const response = await fetch(apiUrl).catch((error) => {
                console.error('Error fetching trends:', error);
            });
            console.log('response', response);
    
            response.json().then((data) => {
                trends = [...data[lang].words, ...data[lang].phrases, ...data[lang].hashtags, ...data[lang].globalWords];
                saveTrends('nightsky-plugin-default', trends);
            });
        }

        if (trends.length === 0 && savedTrends.length === 0) {
            return;
        }
        
        let displayedTrends = 6;
        const totalTrends = trends.length;

        function createTrendElement(trend, index) {
            const trendElement = document.createElement('li');
            const trendRank = document.createElement('span');
            const trendName = document.createElement('span');
            const trendPosts = document.createElement('span');

            trendRank.className = 'trend-rank';
            trendName.className = 'trend-name';
            trendPosts.className = 'trend-posts';

            const categoryTranslation = translations.categories[trend.category][lang];
            trendRank.textContent = `${index + 1} - ${categoryTranslation}`;
            trendName.textContent = trend.topic.startsWith('#') ? trend.topic : `#${trend.topic}`;
            trendPosts.textContent = `${(trend.count / 1000).toFixed(1)}${translations.posts[lang]}`;

            trendElement.appendChild(trendRank);
            trendElement.appendChild(trendName);
            trendElement.appendChild(trendPosts);

            const searchUrl = `https://bsky.app/search?q=${encodeURIComponent(trend.topic)}`;
            trendElement.addEventListener('click', () => {
                window.location.href = searchUrl;
            });

            return trendElement;
        }

        function displayTrends() {
            const ul = document.createElement('ul');
            for (let i = 0; i < displayedTrends && i < totalTrends; i++) {
                ul.appendChild(createTrendElement(trends[i], i));
            }
            trendingTopicsDiv.innerHTML = `<h2>${translations.trendingTopics[lang]}</h2>`;
            trendingTopicsDiv.appendChild(ul);

            if (displayedTrends < totalTrends) {
                const showMoreButton = document.createElement('button');
                showMoreButton.textContent = translations.showMore[lang];
                showMoreButton.addEventListener('click', () => {
                    displayedTrends += 6;
                    displayTrends();
                });
                trendingTopicsDiv.appendChild(showMoreButton);
            }
        }

        displayTrends();
    } catch (error) {
        console.error('Error fetching trends:', error);
    }
};

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
            getTrends();
        } else {
            document.addEventListener('DOMContentLoaded', getTrends);
            window.addEventListener('load', getTrends);
        }
    }
}

// Initialize on page load
initTrendingTopics();

// Reinitialize on URL change
onUrlChange(initTrendingTopics);