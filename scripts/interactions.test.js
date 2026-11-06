const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync('main.js', 'utf8');
function setup(fetch) {
  const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'), { runScripts: 'outside-only', url: 'https://example.test' });
  const w = dom.window;
  w.matchMedia = () => ({ matches: true });
  w.CSS = { supports: () => false };
  w.fetch = fetch || (() => new Promise(() => {}));
  w.console.warn = () => {};
  w.eval(source.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('test-start', () => {"));
  return { dom, w, d: w.document };
}
test('denied storage still initializes navigation and repository controls', () => {
  const { dom, w, d } = setup();
  Object.defineProperty(w, 'localStorage', { get() { throw Error('Denied'); } });
  d.dispatchEvent(new w.Event('test-start'));
  d.getElementById('theme-toggle').click();
  d.getElementById('mobile-menu-toggle').click();
  assert.equal(d.getElementById('mobile-menu-toggle').getAttribute('aria-expanded'), 'true');
  assert.equal(d.querySelectorAll('.repo-card').length, 4);
  const input = d.getElementById('repo-search');
  input.value = 'not found';
  input.dispatchEvent(new w.Event('input'));
  assert.ok(d.querySelector('.no-results'));
  assert.equal(d.querySelector('main > section').style.opacity, '');
  dom.window.close();
});
test('remote metadata stays text and profile failure preserves live repositories', async () => {
  const payload = '<img src=x onerror=alert(1)>';
  const { dom, w, d } = setup(async url => {
    if (!url.includes('/repos?')) throw Error('Profile unavailable');
    return { ok: true, json: async () => [{name: payload, description: payload, language: payload, html_url: 'javascript:alert(1)', stargazers_count: 2}] };
  });
  await w.initRepositoryExplorer();
  assert.equal(d.querySelector('.repo-name').textContent, payload);
  assert.equal(d.querySelector('.repo-card-desc').textContent, payload);
  assert.equal(d.querySelectorAll('.repo-card img, .repo-card a').length, 0);
  assert.equal(d.getElementById('stat-repos').textContent, '1');
  assert.equal(w.safeGitHubUrl('https://github.com/user/repo'), 'https://github.com/user/repo');
  assert.equal(w.safeGitHubUrl('https://github.com.evil.test/repo'), null);
  dom.window.close();
});
test('request deadline handles stalled transport and response body', async () => {
  for (const bodyStalls of [false, true]) {
    const { dom, w } = setup(() => bodyStalls ? Promise.resolve({ok:true, json: () => new Promise(() => {})}) : new Promise(() => {}));
    await assert.rejects(w.fetchGitHubJson('https://example.test', 5), /timed out/);
    dom.window.close();
  }
});
test('pagination loads all pages and refresh preserves search', async () => {
  const { dom, w, d } = setup(async url => ({ok:true, json: async () => url.includes('/repos?') ? (url.includes('page=2') ? [{name:'last', description:'last', stargazers_count:0}] : Array.from({length:100}, (_, i) => ({name:`repo${i}`,description:'repo',stargazers_count:0}))) : {followers:3} }));
  const task = w.initRepositoryExplorer();
  const input = d.getElementById('repo-search');
  input.value = 'last'; input.dispatchEvent(new w.Event('input'));
  await task;
  assert.equal(d.getElementById('stat-repos').textContent, '101');
  assert.equal(d.querySelectorAll('.repo-card').length, 1);
  assert.equal(d.querySelector('.repo-name').textContent, 'last');
  dom.window.close();
});
test('homelab nodes expose native button selection and announced details', async () => {
  const { dom, w, d } = setup();
  w.initHomelabDiagram();
  const nodes = [...d.querySelectorAll('.node-card')];
  assert.equal(nodes.length, 6);
  assert.ok(nodes.every(node => node.tagName === 'BUTTON'));
  nodes[0].click(); nodes[1].click();
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(nodes[0].getAttribute('aria-pressed'), 'false');
  assert.equal(nodes[1].getAttribute('aria-pressed'), 'true');
  assert.match(d.getElementById('arch-info-display').textContent, /Docker Engine/);
  assert.equal(d.getElementById('arch-info-display').getAttribute('aria-live'), 'polite');
  dom.window.close();
});
