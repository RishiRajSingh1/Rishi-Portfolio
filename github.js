// Public, live GitHub data. No tokens, stored snapshots or placeholder counts.
(() => {
  'use strict';
  const panel = document.getElementById('gh');
  if (!panel) return;
  const status = document.getElementById('ghStatus');
  const api = 'https://api.github.com/users/RishiRajSingh1';
  const colors = {
    JavaScript: '#F1E05A', TypeScript: '#3178C6', Java: '#B07219',
    HTML: '#E34C26', CSS: '#563D7C', Python: '#3572A5',
    Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89E051',
  };

  async function request(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return { data: await response.json(), next: /rel="next"/.test(response.headers.get('link') || '') };
    } finally {
      clearTimeout(timer);
    }
  }

  async function repositories() {
    const repos = new Map();
    let page = 1;
    let next;
    do {
      const result = await request(`${api}/repos?type=owner&sort=full_name&per_page=100&page=${page}`);
      if (!Array.isArray(result.data)) throw new Error('Unexpected repository response');
      result.data.forEach(repo => repos.set(repo.id, repo));
      next = result.next;
      page += 1;
    } while (next);
    return [...repos.values()];
  }

  function renderLanguages(repos) {
    const counts = new Map();
    for (const repo of repos) {
      if (typeof repo.language === 'string' && repo.language) {
        counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
      }
    }
    const entries = [...counts].sort((a, b) => b[1] - a[1]);
    document.getElementById('ghLangs').textContent = entries.length.toLocaleString();
    if (!entries.length) return;
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    const bar = document.getElementById('ghLangBar');
    bar.replaceChildren();
    const legend = document.createElement('div');
    legend.className = 'gh__legend';
    for (const [language, count] of entries) {
      const color = colors[language] || '#97A3B8';
      const percent = count / total * 100;
      const segment = document.createElement('i');
      segment.style.width = `${percent}%`;
      segment.style.background = color;
      segment.title = `${language}: ${count} ${count === 1 ? 'repository' : 'repositories'}`;
      bar.appendChild(segment);
      const label = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.background = color;
      label.append(swatch, document.createTextNode(`${language} ${Math.round(percent)}%`));
      legend.appendChild(label);
    }
    bar.hidden = false;
    bar.after(legend);
  }

  async function load() {
    const [profile, repos] = await Promise.allSettled([request(api), repositories()]);
    let profileLoaded = false;
    if (profile.status === 'fulfilled') {
      const user = profile.value.data;
      if (Number.isInteger(user.public_repos) && Number.isInteger(user.followers)) {
        document.getElementById('ghRepos').textContent = user.public_repos.toLocaleString();
        document.getElementById('ghFollowers').textContent = user.followers.toLocaleString();
        const joined = new Date(user.created_at);
        if (!Number.isNaN(joined.getTime())) {
          document.getElementById('ghSince').textContent = `On GitHub since ${joined.getUTCFullYear()}`;
        }
        profileLoaded = true;
      }
    }
    if (repos.status === 'fulfilled') renderLanguages(repos.value);
    if (profileLoaded && repos.status === 'fulfilled') {
      const checked = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      status.textContent = `Live from GitHub · Checked ${checked} · Languages grouped by each repository’s primary language`;
    } else if (profileLoaded || repos.status === 'fulfilled') {
      status.textContent = 'Some live GitHub data is unavailable. Open my profile for the latest activity.';
    } else {
      status.textContent = 'GitHub is temporarily unavailable or rate-limited. Open my profile for current activity.';
    }
    panel.setAttribute('aria-busy', 'false');
  }
  load().catch(() => {
    status.textContent = 'GitHub data is unavailable. Open my profile for current activity.';
    panel.setAttribute('aria-busy', 'false');
  });
})();
