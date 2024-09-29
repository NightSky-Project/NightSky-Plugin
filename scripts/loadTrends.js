async function getTrends() {
    let apiFetched = false;
    const trendingTopicsDiv = document.querySelector('.trending-topics');
    if (!trendingTopicsDiv) {
        console.warn('Trending Topics div not found');
        setTimeout(getTrends, 1000);
    }
    const lang = navigator.language.startsWith('pt') ? 'pt' : 'en';
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

    function fetchTrendsApi(pluginSlug) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            messageType: 'FETCH_API',
            name: `${pluginSlug}-fetch-trends`,
            url: apiUrl,
        }));
    }

    try {
        let trends = [];
        let savedTrends = [];
        let timeSavedTrends = 0;

        window.receiveData = function(name, content) {
            if (!content) {
                return;
            }
            try {
                console.log('Received data:', content);
                const parsedContent = JSON.parse(content);
                if(name === 'nightsky-plugin-default-trends') {
                    savedTrends = parsedContent.trends || [];
                    console.log('Saved trends:', savedTrends);
                    timeSavedTrends = parsedContent.time || 0;
                }
                if(name === 'nightsky-plugin-default-fetch-trends') {
                    console.log('Fetched trends:', parsedContent);
                    if(parsedContent.trends && parsedContent.trends[lang]) {
                        const langTrends = parsedContent.trends[lang];
                        trends = [
                            ...(langTrends.words || []),
                            ...(langTrends.phrases || []),
                            ...(langTrends.hashtags || []),
                            ...(langTrends.globalWords || [])
                        ];
                        saveTrends('nightsky-plugin-default', trends);
                    }
                }
            } catch (error) {
                console.error('Error parsing content:', error);
            }
        }

        requestSavedTrends('nightsky-plugin-default', 'trending-topics');

        if(savedTrends.length === 0 || Date.now() - timeSavedTrends > 1000 * 60 * 10) {
            if (!apiFetched) {
                fetchTrendsApi('nightsky-plugin-default');
                apiFetched = true; // Set the control variable to true after fetching
            }
        }

        if (trends.length === 0 && savedTrends.length === 0) {
            trendingTopicsDiv.innerHTML = `<h2>${translations.trendingTopics[lang]}</h2>`;
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

// Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
function initTrendingTopics() {
    if (isRootUrl()) {
        if (!initTrendingTopics.called) {
            getTrends();
            initTrendingTopics.called = true;
        }
    } else {
        initTrendingTopics.called = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTrendingTopics);

// Reinitialize on URL change
onUrlChange(initTrendingTopics);