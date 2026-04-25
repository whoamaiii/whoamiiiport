# ADR 001: Static Portfolio Architecture

## Status

Accepted

## Context

The project is a portfolio experience with heavy visual presentation, local curated content, and no requirement for authenticated users, dynamic content management, or server-side workflows.

## Decision

The app will remain a static Vite + React frontend with:

- local content modules
- local image manifest and generated responsive assets
- section-local state
- shared hooks for cross-cutting browser behavior
- lightweight error reporting and render fallbacks instead of a larger monitoring platform

## Consequences

### Positive

- simpler deployment and preview environments
- strong local control over design and motion systems
- low operational complexity
- easy browser regression coverage

### Tradeoffs

- content updates require repo changes
- asset workflow is manual rather than CMS-driven
- future dynamic features will require an explicit architecture expansion

## Guardrails

- do not add a backend, CMS, or global state library casually
- keep content and asset contracts typed and test-protected
- preserve accessibility and fallback behavior as release criteria
