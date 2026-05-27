(function() {
    const TOKEN = window.GithubCardToken || null;
    const CARD_STYLE_ID = 'github-card-style';
    
    const CARD_STYLE = `
        .github-repo-card {
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 16px;
            background: var(--card-bg);
            box-shadow: var(--card-shadow);
            transition: all 0.2s ease;
        }
        .github-repo-card:hover {
            box-shadow: var(--hover-shadow);
        }
        .repo-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        .repo-icon {
            margin-right: 8px;
            flex-shrink: 0;
            color: var(--text-color);
        }
        .repo-name {
            font-size: 18px;
            font-weight: 600;
        }
        .repo-name a {
            text-decoration: none;
            color: var(--link-hover);
        }
        .repo-name a:hover {
            text-decoration: underline;
        }
        .repo-description {
            margin: 0 0 16px 0;
            color: var(--description-color);
            font-size: 14px;
            line-height: 1.5;
            flex: 1;
        }
        .repo-stats {
            display: flex;
            gap: 18px;
            color: var(--description-color);
            font-size: 14px;
            align-items: center;
            flex-wrap: wrap;
            margin-top: auto;
        }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .stat-item a,
        .stat-item a:link,
        .stat-item a:visited,
        .stat-item a:hover,
        .stat-item a:active,
        .stat-item a:focus {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-decoration: none !important;
            color: inherit;
        }
        .stat-item a:hover {
            color: var(--link-hover);
        }
        .stat-item a:hover svg {
            fill: var(--link-hover);
        }
        .error-message {
            color: #d73a49;
            font-size: 13px;
            padding: 8px 0;
        }
        :root {
            --bg-color: #f6f8fa;
            --text-color: #24292f;
            --card-bg: #ffffff;
            --card-border: #e1e4e8;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.05);
            --hover-shadow: 0 4px 12px rgba(0,0,0,0.1);
            --description-color: #57606a;
            --link-hover: #0969da;
        }
        body.dark {
            --bg-color: #0d1117;
            --text-color: #c9d1d9;
            --card-bg: #161b22;
            --card-border: #30363d;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.2);
            --hover-shadow: 0 4px 12px rgba(0,0,0,0.4);
            --description-color: #8b949e;
            --link-hover: #58a6ff;
        }
        @media (prefers-color-scheme: dark) {
            body:not(.light) {
                --bg-color: #0d1117;
                --text-color: #c9d1d9;
                --card-bg: #161b22;
                --card-border: #30363d;
                --card-shadow: 0 1px 3px rgba(0,0,0,0.2);
                --hover-shadow: 0 4px 12px rgba(0,0,0,0.4);
                --description-color: #8b949e;
                --link-hover: #58a6ff;
            }
        }
        body.light {
            --bg-color: #f6f8fa;
            --text-color: #24292f;
            --card-bg: #ffffff;
            --card-border: #e1e4e8;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.05);
            --hover-shadow: 0 4px 12px rgba(0,0,0,0.1);
            --description-color: #57606a;
            --link-hover: #0969da;
        }
        .github-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
            gap: 24px;
            align-items: stretch;
        }
        [data-github-repo] {
            height: 100%;
        }
    `;
    
    if (!document.getElementById(CARD_STYLE_ID)) {
        const style = document.createElement('style');
        style.id = CARD_STYLE_ID;
        style.textContent = CARD_STYLE;
        document.head.appendChild(style);
    }
    
    const repoIconSvg = `<svg class="repo-icon" height="20" width="20" viewBox="0 0 16 16" fill="var(--text-color)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>`;
    const starSvg = `<svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.156a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .703 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.155-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694v.001z"></path></svg>`;
    const forkSvg = `<svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>`;
    const codeSvg = `<svg height="16" width="16" viewBox="0 0 16 16" fill="var(--description-color)"><path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25Zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25Z"></path></svg>`;
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, (m) => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function getLoadingHTML(repoFullName) {
        return `
            <div class="github-repo-card">
                <div class="repo-header">
                    ${repoIconSvg}
                    <span class="repo-name">${escapeHtml(repoFullName)}</span>
                </div>
                <div class="repo-description">loading...</div>
                <div class="repo-stats">
                    <span class="stat-item">${starSvg}<span>...</span></span>
                    <span class="stat-item">${forkSvg}<span>...</span></span>
                    <span class="stat-item">${codeSvg}<span>...</span></span>
                </div>
            </div>
        `;
    }
    
    function renderCard(repoFullName, data) {
        const starCount = data.stargazers_count?.toLocaleString() ?? '--';
        const forkCount = data.forks_count?.toLocaleString() ?? '--';
        const language = data.language || 'Unknown';
        const description = data.description?.trim() ? escapeHtml(data.description) : 'No description';
        const repoUrl = `https://github.com/${repoFullName}`;
        const stargazersUrl = `${repoUrl}/stargazers`;
        const forkUrl = `${repoUrl}/fork`;
        
        const starHtml = `<a href="${stargazersUrl}" target="_blank" rel="noopener noreferrer">${starSvg}<span>${starCount}</span></a>`;
        const forkHtml = `<a href="${forkUrl}" target="_blank" rel="noopener noreferrer">${forkSvg}<span>${forkCount}</span></a>`;
        
        return `
            <div class="github-repo-card">
                <div class="repo-header">
                    ${repoIconSvg}
                    <span class="repo-name"><a href="${repoUrl}" target="_blank" rel="noopener">${escapeHtml(repoFullName)}</a></span>
                </div>
                <div class="repo-description">${description}</div>
                <div class="repo-stats">
                    <span class="stat-item">${starHtml}</span>
                    <span class="stat-item">${forkHtml}</span>
                    <span class="stat-item">${codeSvg}<span>${escapeHtml(language)}</span></span>
                </div>
            </div>
        `;
    }
    
    function renderError(repoFullName, errorMsg) {
        const repoUrl = `https://github.com/${repoFullName}`;
        const stargazersUrl = `${repoUrl}/stargazers`;
        const forkUrl = `${repoUrl}/fork`;
        const starHtml = `<a href="${stargazersUrl}" target="_blank" rel="noopener noreferrer">${starSvg}<span>--</span></a>`;
        const forkHtml = `<a href="${forkUrl}" target="_blank" rel="noopener noreferrer">${forkSvg}<span>--</span></a>`;
        return `
            <div class="github-repo-card">
                <div class="repo-header">
                    ${repoIconSvg}
                    <span class="repo-name">${escapeHtml(repoFullName)}</span>
                </div>
                <div class="error-message">Loading Failed：${escapeHtml(errorMsg)}</div>
                <div class="repo-stats">
                    <span class="stat-item">${starHtml}</span>
                    <span class="stat-item">${forkHtml}</span>
                    <span class="stat-item">${codeSvg}<span>Unknown</span></span>
                </div>
            </div>
        `;
    }
    
    async function fetchRepoData(repoFullName) {
        const headers = {};
        if (TOKEN) {
            headers['Authorization'] = `token ${TOKEN}`;
        }
        const res = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers });
        if (!res.ok) {
            if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
                throw new Error('API rate limit exceeded. Please configure your GitHub Token or try again later.');
            }
            throw new Error(`HTTP ${res.status}`);
        }
        return await res.json();
    }
    
    async function processCardElement(el) {
        let repo = el.getAttribute('data-github-repo');
        if (!repo) return;
        repo = repo.trim();
        if (!repo.includes('/')) {
            el.innerHTML = renderError(repo, 'The format should be "owner/repo"');
            return;
        }
        el.innerHTML = getLoadingHTML(repo);
        try {
            const data = await fetchRepoData(repo);
            el.innerHTML = renderCard(repo, data);
        } catch (err) {
            let msg = err.message || 'Request Error';
            if (msg.includes('403')) msg = 'API limited，Check your Token or try again later';
            el.innerHTML = renderError(repo, msg);
        }
    }
    
    function initCards() {
        const containers = document.querySelectorAll('[data-github-repo]');
        if (containers.length === 0) return;
        const parent = containers[0].parentNode;
        if (!parent.classList || !parent.classList.contains('github-cards-grid')) {
            console.info('GitHub Card: Wrap your data-github-repo containers in a <div class="github-cards-grid"> to get a responsive grid');
        }
        containers.forEach(el => {
            if (el.getAttribute('data-github-processed') === 'true') return;
            el.setAttribute('data-github-processed', 'true');
            processCardElement(el);
        });
    }
    
    window.GithubCard = {
        setTheme: function(mode) {
            const body = document.body;
            if (mode === 'dark') {
                body.classList.add('dark');
                body.classList.remove('light');
                localStorage.setItem('github-card-theme', 'dark');
            } else if (mode === 'light') {
                body.classList.add('light');
                body.classList.remove('dark');
                localStorage.setItem('github-card-theme', 'light');
            } else {
                body.classList.remove('dark', 'light');
                localStorage.removeItem('github-card-theme');
            }
        },
        init: initCards
    };
    
    const storedTheme = localStorage.getItem('github-card-theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    } else if (storedTheme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCards);
    } else {
        initCards();
    }
})();
