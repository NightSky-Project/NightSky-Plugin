(async function() {
    const trendingTopicsDiv = document.querySelector('.trending-topics');
    const lang = navigator.language || 'pt';
    const apiUrl = `https://bsky-trends.deno.dev/trend?lang=${lang}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const trends = [...data[lang].words, ...data[lang].phrases, ...data[lang].hashtags, ...data[lang].globalWords];
        
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

            trendRank.textContent = `${index + 1} - ${trend.category}`;
            trendName.textContent = trend.topic.startsWith('#') ? trend.topic : `#${trend.topic}`;
            trendPosts.textContent = `${(trend.count / 1000).toFixed(1)}mil Posts`;

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
            trendingTopicsDiv.innerHTML = '<h2>Trending Topics</h2>';
            trendingTopicsDiv.appendChild(ul);

            if (displayedTrends < totalTrends) {
                const showMoreButton = document.createElement('button');
                showMoreButton.textContent = 'Mostrar mais';
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
})();