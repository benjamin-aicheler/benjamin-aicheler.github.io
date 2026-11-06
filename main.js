/**
 * Benjamin Aicheler - Portfolio Javascript logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DESIGN SYSTEM AND INITIALIZATION ---
  initTheme();
  initNavigation();
  initTerminalSimulator();
  initHomelabDiagram();
  initRepositoryExplorer();
  initScrollEffects();
  initContactForm();
});

// --- THEME TOGGLE (DARK / LIGHT MODE) ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  
  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch {}
  if (!['dark', 'light'].includes(savedTheme)) {
    savedTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('theme', newTheme); } catch {}
  });
}

// --- STICKY NAV AND MOBILE MENU ---
function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinksList = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile navigation drawer toggle
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    mobileMenuToggle.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
  });

  // Close menu when a link is clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- TERMINAL SIMULATOR FOR VAULTWARDEN BACKUP ---
function initTerminalSimulator() {
  const trigger = document.getElementById('run-terminal-trigger');
  const terminalContent = document.getElementById('terminal-content');
  
  const backupLines = [
    { type: 'prompt', text: 'benjamin@homelab:~$ ', delay: 200 },
    { type: 'command', text: './backup-vaultwarden.sh', delay: 1000 },
    { type: 'log', text: '[2026-06-08 12:00:01] [INFO] Starting vaultwarden backup sequence...', delay: 600 },
    { type: 'log', text: '[2026-06-08 12:00:02] [INFO] Locating configuration and preparing export API request...', delay: 800 },
    { type: 'log', text: '[2026-06-08 12:00:03] [INFO] Triggering Vaultwarden export API...', delay: 700 },
    { type: 'log', text: '[2026-06-08 12:00:04] [INFO] Syncing backup files to storage endpoint via rclone...', delay: 1500 },
    { type: 'success', text: '[2026-06-08 12:00:06] [SUCCESS] Backup upload completed. (vaultwarden_backup_20260608.json)', delay: 500 },
    { type: 'log', text: '[2026-06-08 12:00:06] [INFO] Cleaning up local temporary folder...', delay: 600 },
    { type: 'success', text: '[2026-06-08 12:00:07] [SUCCESS] Backup task finished without errors.', delay: 400 },
    { type: 'prompt-end', text: 'benjamin@homelab:~$ ', delay: 100 }
  ];

  let typingTimer = null;

  function runSimulation() {
    // Clear any active typing sequence
    if (typingTimer) clearTimeout(typingTimer);
    terminalContent.innerHTML = '';
    
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      backupLines.filter(line => line.type !== 'command').forEach(line => {
        const row = document.createElement('div');
        row.textContent = line.text + (line.type === 'prompt' ? backupLines[1].text : '');
        terminalContent.appendChild(row);
      });
      return;
    }

    let lineIdx = 0;
    
    function printNextLine() {
      if (lineIdx >= backupLines.length) return;
      
      const line = backupLines[lineIdx];
      const lineEl = document.createElement('div');
      lineEl.className = 'terminal-line';
      
      if (line.type === 'prompt') {
        const promptSpan = document.createElement('span');
        promptSpan.className = 't-prompt';
        promptSpan.textContent = line.text;
        lineEl.appendChild(promptSpan);
        
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 't-command';
        lineEl.appendChild(cmdSpan);
        
        terminalContent.appendChild(lineEl);
        
        // Type the command letter by letter
        let charIdx = 0;
        const cmdText = backupLines[lineIdx + 1].text;
        
        function typeCmd() {
          if (charIdx < cmdText.length) {
            cmdSpan.textContent += cmdText[charIdx];
            charIdx++;
            typingTimer = setTimeout(typeCmd, 60);
          } else {
            lineIdx += 2; // skip command line in next iteration
            typingTimer = setTimeout(printNextLine, 400);
          }
        }
        typingTimer = setTimeout(typeCmd, 200);
        return;
      }
      
      if (line.type === 'log') {
        lineEl.className = 'terminal-line t-log';
        lineEl.textContent = line.text;
      } else if (line.type === 'success') {
        lineEl.className = 'terminal-line t-success';
        lineEl.textContent = line.text;
      } else if (line.type === 'prompt-end') {
        const promptSpan = document.createElement('span');
        promptSpan.className = 't-prompt';
        promptSpan.textContent = line.text;
        lineEl.appendChild(promptSpan);
        
        const blinkSpan = document.createElement('span');
        blinkSpan.className = 'cursor-blink';
        blinkSpan.textContent = '█';
        lineEl.appendChild(blinkSpan);
      }
      
      terminalContent.appendChild(lineEl);
      terminalContent.scrollTop = terminalContent.scrollHeight;
      lineIdx++;
      
      typingTimer = setTimeout(printNextLine, line.delay);
    }
    
    printNextLine();
  }

  trigger.addEventListener('click', runSimulation);
}

// --- HOMELAB ARCHITECTURE DIAGRAM NODE INSPECTOR ---
function initHomelabDiagram() {
  const nodeCards = document.querySelectorAll('.node-card');
  const infoDisplay = document.getElementById('arch-info-display');
  
  const nodeData = {
    'k3s': {
      title: 'k3s Cluster',
      sub: 'Compute layer',
      body: 'A lightweight Kubernetes distribution certified by CNCF. Perfect for resources-constrained homelabs, orchestrating container deployments, networking ingress services, and hosting high-availability systems with standard Kubernetes manifest APIs.'
    },
    'docker': {
      title: 'Docker Engine',
      sub: 'Compute layer',
      body: 'Standalone docker container host for running isolated services that do not require full orchestration. Ideal for lightweight services, database backing, and development sandboxes with docker-compose.'
    },
    'synapse': {
      title: 'Matrix Synapse',
      sub: 'Active service',
      body: 'A secure, federated chat homeserver implementing the open Matrix standard. Enables end-to-end encrypted messaging, media storage, voice/video calls, and decentralization capabilities matching industry-grade chats.'
    },
    'vaultwarden': {
      title: 'Vaultwarden',
      sub: 'Active service',
      body: 'An alternative Bitwarden compatible server API written in Rust. Features minimal CPU and memory footprints, complete compatibility with standard Bitwarden browser extensions and mobile apps, and robust secure vault hosting.'
    },
    'synapse-admin': {
      title: 'SynapseAdmin.NET',
      sub: 'Management Tool (Featured Project)',
      body: 'My admin panel for Matrix Synapse, built in C# and .NET 10. It uses the Synapse Admin API to manage users, rooms, and server media through a web interface.'
    },
    'vaultwarden-export': {
      title: 'vaultwarden-export-rclone',
      sub: 'Backup Utility (Featured Project)',
      body: 'A containerized backup tool I built for my Vaultwarden instance. It automatically exports my vault data using the built-in export features and uploads the backup files to my configured rclone destination.'
    }
  };

  nodeCards.forEach(card => {
    card.addEventListener('click', () => {
      const nodeKey = card.getAttribute('data-node');
      const data = nodeData[nodeKey];
      
      if (!data) return;
      
      // Update active states in diagram
      nodeCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      card.setAttribute('aria-pressed', 'true');
      card.classList.add('active');
      
      // Update details box with slide / fade transition
      infoDisplay.style.opacity = 0;
      setTimeout(() => {
        infoDisplay.innerHTML = `
          <h4>Homelab Infrastructure</h4>
          <p>Selected node details:</p>
          <div class="info-details-box glass">
            <h5>${data.title}</h5>
            <div class="info-sub">${data.sub}</div>
            <div class="info-body">${data.body}</div>
          </div>
        `;
        infoDisplay.style.opacity = 1;
      }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200);
    });
  });
}

// --- DYNAMIC REPOSITORIES LIST (GITHUB API WITH LOCAL FALLBACK) ---
async function initRepositoryExplorer() {
  const searchInput = document.getElementById('repo-search');
  const filterGroup = document.getElementById('filter-group');
  const grid = document.getElementById('repos-grid');
  
  // Cache of our repos in case GitHub API fails, hits rate limit, or is offline
  const fallbackRepos = [
    {
      name: "SynapseAdmin.NET",
      description: "A modern .NET 10 Blazor Server web application for administering Synapse (Matrix homeservers).",
      language: "C#",
      stargazers_count: 0,
      html_url: "https://github.com/benjamin-aicheler/SynapseAdmin.NET"
    },
    {
      name: "vaultwarden-export-rclone",
      description: "Export your Vaultwarden Vault and send using rclone",
      language: "Shell",
      stargazers_count: 0,
      html_url: "https://github.com/benjamin-aicheler/vaultwarden-export-rclone"
    },
    {
      name: "k3s",
      description: "Documenting my homelab setup and sharing it with you",
      language: "Shell",
      stargazers_count: 0,
      html_url: "https://github.com/benjamin-aicheler/k3s"
    },
    {
      name: "docker",
      description: "Documenting docker setups / custom container builds.",
      language: "Shell",
      stargazers_count: 0,
      html_url: "https://github.com/benjamin-aicheler/docker"
    }
  ];

  let repositories = fallbackRepos;

  // Render repositories function
  function renderRepos(searchQuery = '', activeLang = 'all') {
    grid.innerHTML = '';
    
    const filtered = repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            repo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeLang !== 'all') {
        const repoLang = (repo.language || '').toLowerCase();
        if (activeLang === 'c#') {
          matchesFilter = repoLang === 'c#';
        } else if (activeLang === 'shell') {
          matchesFilter = repoLang === 'shell';
        } else if (activeLang === 'other') {
          matchesFilter = repoLang !== 'c#' && repoLang !== 'shell';
        }
      }
      
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results glass" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-secondary);">
          <p>No repositories match your current search/filters.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-card glass';
      
      // Only static markup enters innerHTML; all remote values are text nodes.
      card.innerHTML = `
        <div class="repo-card-header"><span class="repo-name"></span></div>
        <p class="repo-card-desc"></p>
        <div class="repo-card-footer"><span class="repo-lang"></span>
          <div class="repo-meta"><span class="meta-item"></span></div></div>`;
      card.querySelector('.repo-name').textContent = repo.name;
      card.querySelector('.repo-card-desc').textContent = repo.description;
      const language = card.querySelector('.repo-lang');
      const chip = document.createElement('span');
      const langClass = ({'C#': 'csharp', 'Shell': 'shell'})[repo.language] || 'other';
      chip.className = `chip-color ${langClass}`;
      language.append(chip, document.createTextNode(repo.language || 'Other'));
      card.querySelector('.meta-item').textContent = `★ ${repo.stargazers_count}`;
      const url = safeGitHubUrl(repo.html_url);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.className = 'repo-link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = '↗';
        link.setAttribute('aria-label', `View ${repo.name} on GitHub`);
        card.querySelector('.repo-card-header').appendChild(link);
      }
      grid.appendChild(card);
    });
  }

  // Hook up event search input
  searchInput.addEventListener('input', (e) => {
    const activeFilterBtn = filterGroup.querySelector('.filter-btn.active');
    const lang = activeFilterBtn ? activeFilterBtn.getAttribute('data-lang') : 'all';
    renderRepos(e.target.value, lang);
  });

  // Hook up filter buttons
  filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      renderRepos(searchInput.value, lang);
    });
  });

  // Initial render
  function renderCurrent() {
    const active = filterGroup.querySelector('.filter-btn.active');
    renderRepos(searchInput.value, active ? active.getAttribute('data-lang') : 'all');
  }
  renderCurrent();

  // Profile errors must never discard repository results.
  const profileTask = fetchGitHubJson('https://api.github.com/users/benjamin-aicheler')
    .then(profile => {
      if (Number.isFinite(profile.followers)) {
        document.getElementById('stat-followers').textContent = profile.followers;
      }
    }).catch(() => {});
  try {
    const data = [];
    for (let page = 1; ; page++) {
      const batch = await fetchGitHubJson(`https://api.github.com/users/benjamin-aicheler/repos?per_page=100&page=${page}`);
      if (!Array.isArray(batch)) throw new Error('Invalid repository response');
      data.push(...batch);
      if (batch.length < 100) break;
    }
    data.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    repositories = data.filter(repo => !repo.fork && repo.name !== 'benjamin-aicheler.github.io' && typeof repo.name === 'string')
      .map(repo => ({
        name: repo.name,
        description: typeof repo.description === 'string' ? repo.description : 'No description provided yet.',
        language: typeof repo.language === 'string' ? repo.language : null,
        stargazers_count: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0,
        html_url: repo.html_url
      }));
    document.getElementById('stat-repos').textContent = data.length;
    renderCurrent();
  } catch (err) {
    console.warn('Using local fallback repositories:', err);
  }
  await profileTask;
}

// --- INTERSECTION OBSERVER ANIMATION FALLBACK & UTILS ---
function initScrollEffects() {
  const scrollToTop = document.getElementById('scroll-to-top');
  
  // Show / hide scroll to top button
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollToTop.classList.add('visible');
    } else {
      scrollToTop.classList.remove('visible');
    }
  });

  scrollToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });

  // JS Fallback for Scroll Entry/Exit Animations
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && typeof IntersectionObserver !== 'undefined' && !CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    console.log('Scroll-driven timelines unsupported; invoking IntersectionObserver fallback.');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          // stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    // Elements to animate
    const elementsToAnimate = document.querySelectorAll('main > section, .featured-card');
    elementsToAnimate.forEach(el => {
      // Set initial styles for fallback
      el.style.opacity = 0;
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });
  }
}

// --- CONTACT FORM SUBMISSION AND COPY EMAIL ---
function initContactForm() {
  const copyBtn = document.getElementById('copy-matrix-trigger');
  const matrixVal = document.getElementById('matrix-value').textContent;
  const btnText = copyBtn.querySelector('.btn-text');

  // Copy Matrix handle functionality
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(matrixVal).then(() => {
      btnText.textContent = 'Copied!';
      copyBtn.style.color = 'var(--accent)';
      setTimeout(() => {
        btnText.textContent = 'Copy';
        copyBtn.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy Matrix handle:', err);
    });
  });
}

// A deadline covers both the response and its body, even if a transport stalls.
async function fetchGitHubJson(url, timeoutMs = 5000) {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      (async () => {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('GitHub request failed');
        return response.json();
      })(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error('GitHub request timed out'));
        }, timeoutMs);
      })
    ]);
  } finally { clearTimeout(timer); }
}

function safeGitHubUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
