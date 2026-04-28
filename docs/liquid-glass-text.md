# Liquid Glass Text Retired

`LiquidGlassText` is no longer part of the active portfolio code. The component and its direct support/test surface were retired when the hero moved to the current [`HeroTitleHybrid`](./hero-title-hybrid.md) wordmark system.

Do not import or recreate the old component for routine hero or heading work. The active paths are:

- hero lockup: [`src/components/HeroTitleHybrid.tsx`](../src/components/HeroTitleHybrid.tsx)
- section shader headings: [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx)
- shared shader text lifecycle: [`src/components/shared/ShaderTextWord.tsx`](../src/components/shared/ShaderTextWord.tsx)

The separate [`src/glass-effect/`](../src/glass-effect) subsystem is intentionally preserved as future/reference infrastructure. It is not a replacement for the removed text component and is not live in navigation for this release.

If glass-text work returns later, treat it as a new feature: create a new active component, document the current API, add accessibility/fallback tests, and keep it separate from the hero semantic heading contract.
