# CLAUDE.md

Guidelines and commands for development on the Benjamin Aicheler Portfolio Page.

## Development Commands

*   **Preview Site Locally**: Starts a local web server to serve the page.
    ```bash
    npx -y http-server ./
    ```
*   **Validate Code Integrity**: Validates the HTML tags balancing, file structure, reference links, and Javascript syntax.
    ```bash
    node scripts/validate.js
    ```

## Technology Stack

*   **HTML5**: Clean semantic hierarchy (`<header>`, `<main>`, `<section>`, `<footer>`), SEO metadata, single `<h1>` for page header.
*   **CSS3**: Custom variables for dark/light themes, flexbox/grid alignments, and native **Scroll-driven animations** (`view-timeline`).
*   **JavaScript (ES6)**: Real-time queries to GitHub API with fallback arrays, interactive dashboard inspector, and command line typing simulators.
*   **Hosting**: Configured for GitHub Pages bypass via `.nojekyll`.

## Design Conventions & Guidelines

*   **Aesthetics**: Glassmorphism, tech-oriented default dark theme (indigo/violet gradients), and smooth micro-animations.
*   **Zero Dependencies**: Avoid linking heavy libraries or frameworks. Use vanilla implementation and inline SVGs instead of external webfonts or icons packages (keeps LCP fast).
*   **Theme Control**: Set initial theme via system preference or local storage. Toggle theme using `data-theme` attribute on the root `<html>` element.
*   **Privacy**: Personal email address is intentionally omitted. Use the Matrix handle and link to `matrix.to` for direct chat setups.
*   **Scroll Animations**: Use native CSS view-timelines inside `@supports ((animation-timeline: view()) and (animation-range: entry))`. Provide an `IntersectionObserver` fallback for unsupported engines (Firefox/older Safari).
*   **Copywriting Tone (Language Style)**: Keep all site copy modest, down-to-earth, and realistic. Avoid corporate jargon, agency marketing buzzwords (e.g., "robust", "systems architect", "high-performance"), and exaggeration. Use a personal first-person perspective ("I", "my") for original projects and describe third-party tools simply as services you self-host and manage.
