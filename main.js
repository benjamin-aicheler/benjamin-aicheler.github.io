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
  
  // Set default theme to dark if not saved
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
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
  });

  // Close menu when a link is clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileMenuToggle.classList.remove('active');
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
    { type: 'log', text: '[2026-06-08 12:00:02] [INFO] Decrypting configuration and locating database...', delay: 800 },
    { type: 'log', text: '[2026-06-08 12:00:03] [INFO] Creating SQLite backup vacuum snapshot...', delay: 700 },
    { type: 'log', text: '[2026-06-08 12:00:04] [INFO] Syncing database to cloud storage via rclone...', delay: 1500 },
    { type: 'success', text: '[2026-06-08 12:00:06] [SUCCESS] Backup upload completed. (vaultwarden_20260608.tar.gz)', delay: 500 },
    { type: 'log', text: '[2026-06-08 12:00:06] [INFO] Cleaning up local temporary folder...', delay: 600 },
    { type: 'success', text: '[2026-06-08 12:00:07] [SUCCESS] Backup task finished without errors.', delay: 400 },
    { type: 'prompt-end', text: 'benjamin@homelab:~$ ', delay: 100 }
  ];

  let typingTimer = null;

  function runSimulation() {
    // Clear any active typing sequence
    if (typingTimer) clearTimeout(typingTimer);
    terminalContent.innerHTML = '';
    
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
      body: 'My custom Blazor Server administration tool built in .NET 10. It interfaces directly with the Synapse Admin API, allowing visual manipulation of server users, rooms, active endpoints, and server diagnostics from a single sleek GUI panel.'
    },
    'vaultwarden-export': {
      title: 'vaultwarden-export-rclone',
      sub: 'Backup Utility (Featured Project)',
      body: 'My automated backup tool designed specifically to prevent data loss in Vaultwarden instances. It safely snapshots the local SQLite DB without pausing the server, and securely uploads compressed, encrypted blobs to cloud backends using rclone.'
    }
  };

  nodeCards.forEach(card => {
    card.addEventListener('click', () => {
      const nodeKey = card.getAttribute('data-node');
      const data = nodeData[nodeKey];
      
      if (!data) return;
      
      // Update active states in diagram
      nodeCards.forEach(c => c.classList.remove('active'));
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
      }, 200);
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

  let repositories = [];

  // Try to load from GitHub API
  try {
    const response = await fetch('https://api.github.com/users/benjamin-aicheler/repos');
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    
    // Sort by updated or stars
    data.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    
    // Map to normalized structure, filtering out forks, portfolio, and explicit third-party mirrors
    const excludedNames = ['benjamin-aicheler.github.io', 'LibMatrix', 'ArcaneLibs'];
    repositories = data
      .filter(repo => !repo.fork && !excludedNames.includes(repo.name))
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description provided yet.',
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        html_url: repo.html_url
      }));
      
    // Update stats on Hero
    const totalRepos = data.length;
    document.getElementById('stat-repos').textContent = totalRepos;
    
    // Try to get profile followers count
    const profileResponse = await fetch('https://api.github.com/users/benjamin-aicheler');
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      document.getElementById('stat-followers').textContent = profileData.followers;
      if (profileData.avatar_url) {
        document.getElementById('github-avatar').src = profileData.avatar_url;
      }
    }
  } catch (err) {
    console.warn('Using local fallback repositories due to GitHub API error:', err);
    repositories = fallbackRepos;
  }

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
      
      const langClass = (repo.language || 'other').toLowerCase().replace('#', 'sharp');
      
      card.innerHTML = `
        <div class="repo-card-header">
          <span class="repo-name">${repo.name}</span>
          <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener noreferrer" aria-label="View repo on GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
        </div>
        <p class="repo-card-desc">${repo.description}</p>
        <div class="repo-card-footer">
          <span class="repo-lang">
            <span class="chip-color ${langClass}"></span>
            ${repo.language || 'Other'}
          </span>
          <div class="repo-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              ${repo.stargazers_count}
            </span>
          </div>
        </div>
      `;
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
  renderRepos();
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
      behavior: 'smooth'
    });
  });

  // JS Fallback for Scroll Entry/Exit Animations
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
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

  // Client-side contact form interceptor for formspree
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        submitBtn.innerHTML = 'Sent Successfully! ✅';
        form.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        }, 5000);
      } else {
        throw new Error('Server response failed');
      }
    } catch (err) {
      submitBtn.innerHTML = 'Failed to Send ❌';
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      }, 5000);
    }
  });
}
