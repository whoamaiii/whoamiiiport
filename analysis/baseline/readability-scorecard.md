# Hero Text Readability Scorecard - Baseline

**Assessment Date:** 2026-03-28  
**Assessor:** Code Analysis  
**Component:** Hero Title ("Altered Perceptions.")

---

## Scoring Criteria

**Scale: 1-10**
- 1-3: Poor - Significant difficulty reading
- 4-5: Fair - Readable with effort
- 6-7: Good - Readable, minor issues
- 8-9: Very Good - Easy to read
- 10: Excellent - Perfect readability

---

## Current Scores

### Desktop (1920x1080)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Overall Legibility | 5 | Shadows too subtle for complex background |
| Edge Definition | 4 | Single shadow layer, lacks depth |
| Contrast - Light Areas | 4 | Text blends with bright regions |
| Contrast - Dark Areas | 7 | Visible but could be enhanced |
| Visual Aesthetic | 8 | Nice colors, good animation |
| Performance | 9 | Smooth 60fps observed |

**Desktop Average: 6.2/10**

### Tablet (768x1024)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Overall Legibility | 5 | Similar issues to desktop |
| Edge Definition | 4 | Shadows reduced on smaller screens |
| Contrast - Light Areas | 4 | Background details compete |
| Contrast - Dark Areas | 7 | Acceptable visibility |
| Visual Aesthetic | 8 | Animation scales well |
| Performance | 8 | Slight frame drops possible |

**Tablet Average: 6.0/10**

### Mobile (375x667)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Overall Legibility | 4 | Reduced shadow blur hurts readability |
| Edge Definition | 3 | 5px blur insufficient |
| Contrast - Light Areas | 3 | Often disappears against bright sky |
| Contrast - Dark Areas | 6 | Better but not optimal |
| Visual Aesthetic | 7 | Still attractive |
| Performance | 7 | Reduced scale helps |

**Mobile Average: 5.0/10**

---

## Target Scores (Post-Enhancement)

### Desktop Targets

| Criterion | Target | Priority |
|-----------|--------|----------|
| Overall Legibility | 8 | High |
| Edge Definition | 8 | High |
| Contrast - Light Areas | 7 | High |
| Contrast - Dark Areas | 9 | Medium |
| Visual Aesthetic | 8 | High |
| Performance | 9 | Critical |

**Target Desktop Average: 8.2/10**

### Mobile Targets

| Criterion | Target | Priority |
|-----------|--------|----------|
| Overall Legibility | 7 | High |
| Edge Definition | 7 | High |
| Contrast - Light Areas | 6 | High |
| Contrast - Dark Areas | 8 | Medium |
| Visual Aesthetic | 7 | Medium |
| Performance | 8 | Critical |

**Target Mobile Average: 7.2/10**

---

## Improvement Priorities

### P0 (Critical)
1. Increase shadow blur and opacity
2. Implement multi-layer shadow system
3. Boost shader brightness

### P1 (High)
4. Add inner highlight for edge definition
5. Strengthen CSS container shadows
6. Optimize mobile shadow scaling

### P2 (Medium)
7. Adjust shader vignette
8. Optimize backlight positioning
9. Add visual regression testing

---

## WCAG Contrast Targets

### Current State (Estimated)
- Hero Title (Large Text): ~2.8:1 in worst areas
- Hero Subtitle: ~3.2:1 in worst areas

### Target State
- Hero Title (Large Text): 4.5:1 (WCAG AAA for large text)
- Hero Subtitle: 4.5:1 (WCAG AA for normal text)

---

## Test Environment

- **Primary Browser:** Chrome (latest)
- **Test Device:** Development workstation
- **Display:** Retina/High DPI
- **Viewport Sizes Tested:** 375, 768, 1440, 1920

---

## Sign-Off

This baseline establishes the starting point for readability enhancements. All future improvements will be measured against these scores.
