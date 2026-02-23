# Website Design Best Practices (2026 snapshot)

This is a practical “pattern playbook” built from a mix of:
- **Current practice signals** (what designers are shipping and sharing, including X/Twitter discussions and galleries like Awwwards)
- **Proven UX, accessibility, and performance guidance** (W3C WCAG/ARIA, web.dev, NNGroup, Baymard, major design systems)

Use it like a menu 🍱: pick the site type and the visual/layout patterns that match your goals, then apply the non‑negotiables.

---

## Table of contents
1. [Non‑negotiables (works in every style)](#non-negotiables-works-in-every-style)
2. [Layout patterns people are using right now](#layout-patterns-people-are-using-right-now)
3. [Visual styles people are using right now](#visual-styles-people-are-using-right-now)
4. [Playbooks by website type](#playbooks-by-website-type)
5. [Pre‑launch checklist](#pre-launch-checklist)
6. [Sources](#sources)

---

## Non-negotiables (works in every style)

### 1) Accessibility is not a “finish line item”
**Aim for WCAG 2.2 Level AA** as your default baseline.
- Provide clear focus states, keyboard access, and visible labels.
- Don’t rely on color alone for meaning; keep contrast solid (especially in dark mode).
- Use ARIA *only when needed* and follow established widget patterns.

Why: WCAG 2.2 is the current W3C standard (and adds criteria beyond 2.1). The ARIA Authoring Practices Guide (APG) provides patterns and keyboard interaction guidance for common UI components.

**Practical moves**
- Build forms with explicit labels and clear error recovery.
- For custom widgets (tabs, menus, dialogs, comboboxes), follow APG patterns.
- Always support reduced motion preferences.

### 2) Performance is part of design
People feel performance before they read your copy.
- Treat **Core Web Vitals** as a design constraint: LCP (loading), CLS (stability), INP (responsiveness).
- Avoid heavy hero videos, bloated web fonts, and “everything animates” pages.

**Practical moves**
- Keep layout stable (reserve image/video space; avoid late-loading layout shifts).
- Keep interactions snappy (minimize long main-thread tasks).
- Don’t ship 5 font families “for vibes”; 1–2 families is usually enough.

### 3) Clarity beats cleverness (especially for core tasks)
Minimalism isn’t just “less stuff”; it’s *less noise*. If an element doesn’t help a user complete a task, it’s a suspect.

**Practical moves**
- Make the primary action painfully obvious.
- Use progressive disclosure: show essentials first, details on demand.
- Use consistent patterns: navigation, buttons, and feedback should behave predictably.

### 4) Design for scanning, not reading
Most users scan, bounce, and return later.
- Use clear headings, short paragraphs, and meaningful section anchors.
- Use “chunking”: groups of content that feel like complete thoughts.

### 5) Motion is seasoning, not the meal
Motion can help with hierarchy and feedback, but it can also make people nauseous or slow pages down.

**Practical moves**
- Respect `prefers-reduced-motion` and consider also `prefers-reduced-data` and `prefers-reduced-transparency`.
- Keep motion purposeful: state changes, continuity, guidance.

---

## Layout patterns people are using right now

### 1) Bento grids (tile/card layouts) 🍱
**What it is:** A hero or section laid out as a grid of cards with varied sizes (popular in SaaS and portfolios). It’s a frequent topic in web design threads and examples.

**Best practices**
- Make each tile a self-contained “content unit” with a clear headline.
- Use a consistent grid rhythm (spacing, alignment, baseline).
- Keep the primary narrative clear: one dominant tile, supporting tiles beneath/around.
- On mobile: collapse into a single column with the same story order.

**Common mistakes**
- Every tile shouting at once (same weight, same color, same motion).
- Tiles that look clickable but aren’t.
- Overusing hover effects that don’t exist on touch devices.

**Works great for:** SaaS homepages, “features at a glance,” creator portfolios, product teasers.

---

### 2) Scroll storytelling (scrollytelling)
**What it is:** Long, guided pages where the story unfolds as you scroll (often with sticky sections or subtle animation).

**Best practices**
- Give users a map: section anchors, progress indicator, or clear headings.
- Keep key content usable with reduced motion (and when JS fails).
- Avoid scroll-jacking (don’t steal the wheel from the user).
- Treat animations as enhancements, not requirements.

**Works great for:** product launches, agencies, interactive reports.

---

### 3) Sticky navigation + section anchors
**What it is:** Top or side nav stays visible while content sections are linked via anchors.

**Best practices**
- Make the sticky bar compact and readable.
- Highlight the current section (but don’t over-animate).
- Ensure anchor jumps account for sticky header height.
- Keep “jump to” navigation keyboard accessible.

**Works great for:** docs, landing pages, pricing pages, long-form content.

---

### 4) Search-first navigation (search as the main doorway)
**What it is:** Search is the primary interaction (docs, marketplaces, knowledge bases).

**Best practices**
- Provide strong empty states and suggestions.
- Include filters that are understandable (not just icons).
- Keep results pages readable, with quick preview/snippets.

**Works great for:** docs, marketplaces, internal tools, content-heavy sites.

---

### 5) Dashboard layout (sidebar + top bar + content canvas)
**What it is:** The standard “product app” shell: sidebar nav, top utility actions, main content.

**Best practices**
- Keep navigation stable; don’t constantly reshape the sidebar.
- Use clear system status and feedback (loading, saving, errors).
- Design responsive breakpoints intentionally (not as an afterthought).

**Works great for:** SaaS apps, admin panels, analytics tools.

---

## Visual styles people are using right now

### 1) Modern minimalism (quiet UI, loud hierarchy)
This is still everywhere, but the better versions are about *hierarchy* (not just whitespace).

**Best practices**
- Use whitespace to group related items and reduce noise.
- Use type scale and weight to create a clear reading order.
- Keep iconography consistent and sparse.

---

### 2) Expressive typography (type as a visual hero) 🔤
Type is doing more “brand work” lately: bigger, bolder, more character.

**Best practices**
- Keep headings punchy, but don’t sacrifice readability.
- Prefer variable fonts when they reduce total font payload.
- Ensure contrast and line length remain comfortable.

---

### 3) Dark mode done right 🌙
Dark mode is not “invert the colors.”
- Dark gray surfaces often work better than pure black.
- Contrast and elevation cues matter a lot.

**Best practices**
- Use consistent surface/elevation rules (what’s “on top” should read as such).
- Avoid low-contrast text and “glowy” neon-on-black everywhere.
- Test in real lighting conditions (bright office + dark mode is brutal).

---

### 4) Glassmorphism and translucent layers 🪟
Frosted panels, blur, layered depth. When used carefully, it can clarify hierarchy.

**Best practices**
- Use translucency to *separate layers*, not to decorate everything.
- Ensure text contrast remains strong over changing backgrounds.
- Provide fallbacks for reduced transparency preferences.
- Watch performance: blur and video backgrounds can be expensive.

---

### 5) “Human texture” / anti-slick design
A counter-trend to hyper-polished, AI-looking design: grain, collage, hand-drawn elements, tactile textures.

**Best practices**
- Use texture to support brand personality, not to obscure UI.
- Keep controls and core navigation clean and predictable.
- Make sure contrast and readability survive the texture layer.

---

### 6) 3D and spatial visuals (used like a spotlight) 🧊
3D is popular again, often with soft, rounded forms.

**Best practices**
- Treat 3D as a focal element; don’t make the whole UI 3D.
- Compress and lazy-load heavy assets.
- Keep interaction targets and text strictly 2D and readable.

---

### 7) Neo-brutalism / high-contrast editorial
Bold outlines, strong contrast, intentionally “raw” layouts.

**Best practices**
- Keep spacing systematic even if the visuals feel rebellious.
- Ensure buttons look like buttons, links look like links.
- Avoid making the page feel like a poster when it needs to function like a tool.

---

## Playbooks by website type

### A) Marketing / SaaS homepage
**Goal:** explain value fast and earn a click.

**Best practices**
- Hero: one clear promise + one primary CTA.
- Social proof: logos, testimonials, metrics, but keep it skimmable.
- Feature sections: “what it does” + “why it matters” + “how it works.”
- Keep nav simple: Product, Pricing, Docs, Company, Sign in.

**Patterns that fit**
- Bento grid for features (when content can be chunked)
- Scroll storytelling for launches
- Sticky anchors for longer pages

---

### B) E-commerce store
**Goal:** help people find the right product, feel safe, and check out without friction.

**Best practices**
- Category navigation: clear labels, good filtering, avoid dead ends.
- Product pages: great photos, clear pricing/shipping/returns, easy variant selection.
- Checkout: reduce form friction, show progress, prevent surprise costs.
- Mobile: thumbs-first interactions and sticky “Add to cart” where helpful.

---

### C) Portfolio / personal site
**Goal:** show taste + make contacting you effortless.

**Best practices**
- Lead with your “why you” in one sentence.
- Show 3–6 best projects, not 30 okay ones.
- Each project: role, constraints, decisions, outcome (not just screenshots).
- One obvious contact action, everywhere.

**Patterns that fit**
- Bento grid, bold typography, tasteful motion

---

### D) Editorial / blog / newsletter
**Goal:** reading comfort and discoverability.

**Best practices**
- Strong typography: comfortable line length, clear headings, good spacing.
- Clean TOC and related content.
- Avoid intrusive interstitials.
- Optimize images and keep layout stable.

---

### E) Documentation / knowledge base
**Goal:** fast answers with minimal frustration.

**Best practices**
- Search-first + sensible IA (information architecture).
- Clear versioning, “last updated,” and code blocks that copy cleanly.
- Anchor links for headings (deep links matter).
- Accessible components (tabs, accordions, menus) via ARIA/APG patterns.

---

## Pre-launch checklist

**UX**
- Primary action is obvious on every key page.
- Navigation labels match user language (not internal jargon).
- Forms: inline validation, clear error states, no mystery fields.

**Accessibility**
- Keyboard navigation works end-to-end (including menus, modals, forms).
- Visible focus states everywhere.
- Reduced motion supported.

**Performance**
- Core Web Vitals monitored (field + lab).
- Images are responsive and optimized.
- Fonts are minimal; avoid layout shifts.

**Content**
- Headlines explain value, not hype.
- Pricing and policies are unambiguous.
- Contact path is always easy to find.

---

## Sources

(These are the core references used to compile this playbook.)

### Accessibility
- WCAG 2.2 (W3C): https://www.w3.org/TR/WCAG22/
- What’s new in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- ARIA Authoring Practices Guide (APG): https://www.w3.org/WAI/ARIA/apg/

### Performance & page experience
- web.dev Core Web Vitals: https://web.dev/explore/learn-core-web-vitals
- Google Search: Core Web Vitals & search: https://developers.google.com/search/docs/appearance/core-web-vitals
- Measuring Web Vitals (web.dev): https://web.dev/articles/vitals-measurement-getting-started

### UX research & heuristics
- NNGroup: Aesthetic & Minimalist Design: https://www.nngroup.com/articles/aesthetic-minimalist-design/
- NNGroup: Aesthetic-Usability Effect: https://www.nngroup.com/articles/aesthetic-usability-effect/
- NNGroup: Testing Visual Design: https://www.nngroup.com/articles/testing-visual-design/

### E-commerce UX (research-based)
- Baymard: Checkout UX Best Practices 2025: https://baymard.com/blog/current-state-of-checkout-ux
- Baymard: Navigation UX Best Practices 2025: https://baymard.com/blog/ecommerce-navigation-best-practice

### Design systems guidance
- Apple Human Interface Guidelines (Layout): https://developer.apple.com/design/human-interface-guidelines/layout
- Apple HIG (Materials): https://developer.apple.com/design/human-interface-guidelines/materials
- Material Design (Dark theme): https://m2.material.io/design/color/dark-theme.html
- Fluent 2 (Link cues): https://fluent2.microsoft.design/components/web/react/core/link/usage

### “What people are shipping” signals
- Awwwards trending categories: https://www.awwwards.com/websites/trend/
- X/Twitter examples discussing bento grids and current patterns:
  - https://x.com/freeCodeCamp/status/1776611823506116809
  - https://x.com/i/status/1798766862588842177

### Implementation references (helpful for modern CSS preferences)
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- MDN variable fonts: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts

