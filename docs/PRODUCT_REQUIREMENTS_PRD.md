# Product Requirements Document (PRD)
## Modern AI-Powered GRC Platform – Phase 1 Web Application

**Target Markets:** Saudi Arabia, UAE, Egypt  
**Platforms:** Web (Next.js 14 + React 18 + TypeScript frontend, Node.js/NestJS + FastAPI backend services)  
**Document Version:** 0.1 (Draft)  
**Date:** 2024  
**Author:** Product Team

---

## 1. Executive Summary

This PRD defines the foundational web application experience for the Modern AI-Powered GRC platform. Phase 1 focuses on:

- Public marketing site (multi-language)
- Authentication & onboarding flow
- Core application shell (navigation, dashboard)
- Initial integrations with backend services (Node.js REST/GraphQL + FastAPI AI endpoints)

This phase establishes the UX/UI framework, security baseline, and extensible frontend architecture to support future modules (policy, risk, compliance, audit) and is intentionally built to support future Arabic localization, even though Phase 1 launches with English content only.

---

## 2. Goals and Non-Goals

### Goals
1. Deliver a production-ready public marketing site (English at launch) engineered to easily enable Arabic/RTL content in Phase 2.
2. Implement secure authentication (email/password + SSO readiness) built on Keycloak/NextAuth.
3. Provide a responsive application shell with navigation, role-based menus, and dashboard scaffolding.
4. Integrate frontend with backend authentication APIs and placeholder data endpoints.
5. Establish design system, localization support, and analytics instrumentation.

### Non-Goals
- Full implementation of GRC modules (policy, risk, compliance) – deferred to Phase 2+.
- Mobile apps (will reuse responsive web for now).
- Advanced AI features (provide placeholders and feature flags only).
- Arabic copy/RTL launch (content ships in English first; infrastructure and toggles prepared now).

---

## Localization Strategy (Phase 1 Assumption)

- **Launch Language:** English-only UI and content for MVP/beta.
- **Architecture Readiness:** All components, layouts, and data models must be i18n-/RTL-ready (Next.js i18n routing, translation files, typography, CSS utilities).
- **Feature Flags:** Arabic locale toggle exists but remains hidden/disabled until localized content is delivered.
- **Content Workflow:** Translation strings stored centrally (e.g., JSON/PO), allowing translators to populate without code changes.

---

---

## 3. User Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Compliance Officer** | Oversees compliance programs in Saudi/UAE/Egypt organizations. | Clear overview, localized content, trust in security. |
| **CISO / Risk Officer** | Manages enterprise risk and cybersecurity programs. | Quick insights, integration readiness, AI roadmap. |
| **Executive Sponsor** | Decision maker evaluating procurement. | Marketing site, ROI messaging, demo request funnel. |
| **Internal Admin** | Platform admin configuring accounts, languages, onboarding. | Efficient authentication flow, RBAC, localization tools. |

---

## 4. User Stories & Acceptance Criteria

### 4.1 Public Marketing Site
1. **As a prospective customer**, I can view a modern landing page (English at launch, Arabic to follow) so I understand product value.  
   - *Acceptance*: English content live in Phase 1; locale toggle/RTL styles ready but hidden until Arabic copy is available; key sections (Hero, Value Props, Modules, AI, Compliance, Testimonials, Contact).

2. **As a prospect**, I can submit a demo/contact form so Sales can follow up.  
   - *Acceptance*: Validate fields, reCAPTCHA, send via backend, success messaging.

3. **As a returning visitor**, I can view localized case studies and compliance references relevant to my country.  
   - *Acceptance*: Country filter, dynamic content cards, link to resources; English copy live now, translation slots and CMS fields ready for future Arabic copy.

### 4.2 Authentication
1. **As a registered user**, I can log in with email/password to access the platform.  
   - *Acceptance*: NextAuth UI, Keycloak backend, error states, password reset link.

2. **As an enterprise admin**, I can log in via SSO (Azure AD/ADFS) when configured.  
   - *Acceptance*: Display SSO button when tenant enables, fallback to password.

3. **As a new user**, I can initiate password reset and receive localized email instructions.  
   - *Acceptance*: Form validations, email templates (Arabic/English), token expiration, success state.

4. **As an internal tester**, I can switch between staging and production auth endpoints for testing.  
   - *Acceptance*: Environment toggle, config-driven endpoints.

### 4.3 Application Shell & Navigation
1. **As a logged-in user**, I see a personalized dashboard with key widgets (Risk Summary, Compliance Status, Tasks).  
   - *Acceptance*: Placeholder widgets pulling mock API data, skeleton states, timezone aware.

2. **As a user with role X**, I only see navigation items I have permission for.  
   - *Acceptance*: RBAC-driven sidebar (Dashboard, Policies, Risks, Compliance, Audits, AI Insights (placeholder), Settings).

3. **As a user**, I can switch between Arabic and English within the app shell.  
   - *Acceptance*: Toggle exists but remains English-only in Phase 1 (Arabic option hidden/disabled via feature flag); locale state persists; RTL layout verified via internal QA mode.

4. **As a user**, I receive notifications in the header (alerts, tasks, AI recommendations).  
   - *Acceptance*: Notification bell with count, dropdown list, real-time updates via WebSocket mock.

### 4.4 Dashboard Widgets (Phase 1 placeholders)
1. **Risk Heatmap (placeholder)** – Static sample derived from mock API (FastAPI endpoint).  
   - *Acceptance*: Responsive chart (e.g., Recharts), states: loading, empty, sample data.

2. **Compliance Status** – Cards for Saudi NCA, SAMA, UAE ADGM, Egypt DP.  
   - *Acceptance*: Pull sample percentages, show compliance trend arrow.

3. **AI Insights (coming soon)** – Placeholder card explaining upcoming AI features with request access CTA.  
   - *Acceptance*: Feature flag to hide/show.

4. **Task List** – Upcoming reviews/audits.  
   - *Acceptance*: List of tasks with due dates, status badges, link to module.

---

## 5. Functional Requirements

### 5.1 Public Site
- Multi-page Next.js site with static generation + incremental regeneration.
- Localized content (i18n) with fallback.
- SEO optimization (metadata, Open Graph, schema).
- Contact/demo form submission (API route).
- Analytics: Google Analytics 4 + Matomo (self-hosted option).

### 5.2 Authentication
- NextAuth.js integration with Keycloak (OIDC).
- Session handling (HTTP-only cookies).
- MFA support (future toggle in Keycloak).
- Password reset workflow.
- SSO configuration panel (admin-only).

### 5.3 Application Shell
- Layout components (Header, Sidebar, Content, Footer).
- Responsive design (desktop/tablet/mobile).
- Global state management (Zustand/Redux) for user session, navigation, notifications.
- Route protection (middleware).

### 5.4 Dashboard
- Widget-based layout (grid system).
- Each widget fetches from API (mock for now).
- Configurable widgets (pin/unpin for future).
- Export to PDF/CSV (future).

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Largest Contentful Paint < 2.5s on 4G in target regions; API response < 300ms for cached endpoints. |
| Localization | Full Arabic/English support, RTL compliance, Hijri/Gregorian toggle. |
| Accessibility | WCAG 2.1 AA compliance. |
| Security | OWASP Top 10, CSP headers, rate limiting, reCAPTCHA. |
| Reliability | 99.5% uptime target for Phase 1 (SLA to be defined). |
| Compliance | Data residency awareness, audit logging for auth events. |

---

## 7. UX/UI Guidelines

### Design System
- Base: Tailwind CSS + shadcn/ui components.
- Typography: Variable font with Arabic support (e.g., Inter + IBM Plex Sans Arabic).
- Color Palette: Trust-oriented (deep blue, emerald accents), high-contrast for accessibility.
- Iconography: Lucide icons, custom compliance icons.

### Layout
- Public pages: Hero, modules, AI section, compliance logos, testimonials, CTA.
- Auth pages: Minimal, brand-consistent, Arabic support.
- Dashboard: Left sidebar navigation, top header with search/notifications/profile.

### Illustrations & Imagery
- Use culturally relevant imagery (Middle Eastern enterprises, data centers).
- Custom illustrations for AI components.

---

## 8. Technical Architecture Alignment

| Layer | Implementation Notes |
|-------|----------------------|
| Frontend | Next.js App Router, Server Components where beneficial, Edge-ready. |
| State | React Query/TanStack for data fetching, Zustand for app state. |
| Backend Integration | Node.js/NestJS REST/GraphQL for auth/user data; FastAPI for AI placeholder endpoints. |
| Auth | Keycloak (OIDC). NextAuth adapters. |
| CMS (optional) | Sanity/Contentful/Strapi for marketing content. |
| Localization | next-intl or next-i18next with JSON resource files. |
| Analytics | GA4 + Matomo. |

---

## 9. Dependencies & Risks

### Dependencies
- Design team delivering UI kit and assets.
- Keycloak deployment and configuration.
- API contracts for user profile, dashboard widgets (even if mocked).
- AI service placeholders (FastAPI) for demo data.

### Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Localization delays | Delayed Arabic launch | Parallel translation workflow, use translation agency. |
| Keycloak setup complexity | Auth delays | Start POC early, leverage Keycloak Helm charts. |
| Performance in target regions | Poor UX | Use edge caching (Vercel/AWS CloudFront), optimize images. |
| Regulatory content accuracy | Trust issues | Engage compliance SMEs for copy review. |

---

## 10. Success Metrics (Phase 1)

- **Marketing Site**: Bounce rate < 45%, form conversion > 4% (prospect form).
- **Auth Flow**: < 1% login error rate, password reset success > 90%.
- **Dashboard Engagement**: > 60% of beta users customize or interact with widgets.
- **Localization**: 100% strings translated; QA sign-off for RTL.

---

## 11. Milestones & Timeline (Indicative)

| Milestone | Deliverable | Duration |
|-----------|-------------|----------|
| M1 | Design system + marketing site wireframes | 2 weeks |
| M2 | Authentication integration (Keycloak + NextAuth) | 3 weeks |
| M3 | Dashboard shell + widgets (mock data) | 3 weeks |
| M4 | Localization + RTL QA | 2 weeks |
| M5 | Beta release (internal) | Week 10 |
| M6 | Public launch (selected clients) | Week 12 |

---

## 12. Open Questions
1. Final decision on CMS for marketing content? (Sanity vs Contentful vs in-house)
2. Which payment gateway(s) will be needed for Saudi/UAE/Egypt? (For future subscription flows)
3. Legal approval for marketing claims per country?
4. AI feature roadmap communication on dashboard – how prominent should \"coming soon\" be?

---

**Next Steps:**  
1. Review PRD with stakeholders (Product, Engineering, Compliance, Design).  
2. Finalize scope & sprint allocations.  
3. Begin detailed design (UX) and technical planning (engineering).  
4. Align backend roadmap (auth APIs, dashboard data contracts) with frontend needs.  


