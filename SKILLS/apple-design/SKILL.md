---
name: apple-design
description: Create distinctive, production-grade frontend interfaces adhering to Apple's Human Interface Guidelines (HIG). Produces polished, native-feeling code with Apple typography and materials.
---

## Purpose

The **apple-design** skill guides an AI agent to create **visually distinctive, production-grade frontend interfaces** that strictly follow Apple's Human Interface Guidelines (HIG).

It solves a core problem in AI-generated UI:
- generic web layouts
- non-native feeling components
- predictable styling and spacing
- “AI-looking” design

This skill forces the agent to:
- commit to Apple's clean, functional aesthetic
- design intentionally using HIG principles (translucency, depth, typography)
- implement real, working frontend code

Core principle:
Every UI must feel like a premium, intentionally designed native Apple ecosystem experience.

---

## When to Use

Use this skill when:

- Building:
  - landing pages
  - dashboards
  - web apps
  - UI components
- Styling or redesigning frontend interfaces to feel like iOS or macOS
- Improving the visual quality of existing UI with Apple aesthetics
- Generating HTML/CSS/JS, React, Vue, Next.js, Tailwind CSS, etc.

Use especially when:
- Output looks “too generic”
- You want **high-end design quality** reflecting Apple's standards
- You need a **native-feeling, polished UI**

DO NOT use when:
- Backend-only tasks
- Pure logic or algorithm problems
- Non-visual code generation

---

## Step-by-step Instructions for the agent

### 1. Understand Context First

Before coding, extract:

- Purpose  
  → What problem does this UI solve?

- Audience  
  → Who will use it? (macOS vs iOS web context)

- Constraints  
  → Framework, performance, layout rules

---

### 2. Choose a Bold Aesthetic Direction

You MUST align with Apple's core design language. Choose ONE specific context:

- iOS/iPadOS App Style (Cards, grouped lists, bottom tabs, large headers)
- macOS App Style (Sidebars, dense toolbars, window-like floating panels)
- Apple Product Landing Page (Minimalist, oversized typography, dramatic scroll reveals, deep blacks or clean whites)

Rule:
Do NOT mix randomly. Commit to ONE native-feeling direction.

---

### 3. Define Differentiation

Ask:

What makes this Apple-style UI unforgettable?

Pick ONE defining trait:
- San Francisco typography hierarchy
- Liquid glass / Translucent materials (Vibrancy & blur)
- Physically-based spring animations
- Cupertino-style iconography (SF Symbols style)

This becomes the identity of the design.

---

### 4. Implement Production-Grade Code

Generate real working code:

- HTML / CSS / JS OR
- React / Vue / framework requested

Code MUST be:
- functional
- clean
- structured
- strictly using `px` for all layout, spacing, and typography sizing.

---

### 5. Apply Aesthetic Systems

#### Typography
- Use Apple's system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif`.
- Apply strict hierarchy (Large Titles, Headlines, Body, Footnotes).
- Avoid:
  - Inter
  - Arial (as a primary)
  - Roboto

#### Color & Theme
- Use Apple's semantic system colors (e.g., iOS Blue: `#007AFF`, System Gray variants).
- Create strong hierarchy between background, elevated cards, and primary content.
- Avoid flat, generic hex colors; use native-feeling shades.

#### Motion & Interaction
- Use physically-based spring animations (avoid linear easing).
- Keep animations swift but smooth (typically 300-500ms).
- Focus on:
  One strong moment (like a satisfying button press scale) > many weak effects.

#### Layout & Composition
- Use strict spacing scales based on multiples of 4px or 8px (e.g., 8px, 16px, 24px, 32px).
- Utilize rounded corners appropriately (`10px`, `16px`, `24px` for cards) mimicking Apple's continuous corner smoothing.
- Balance dense structured layouts with significant, intentional whitespace.

#### Background & Visual Detail
Add depth using:
- translucency (`backdrop-filter: blur(20px)`)
- layered, subtle drop shadows for elevation
- thin 1px borders with low opacity (`rgba(0,0,0,0.1)`)
- clean gradients (non-generic)

Avoid plain flat backgrounds unless it is a pure white or pure black base.

---

### 6. Enforce Anti-Generic Rules

NEVER use:
- `rem` units for sizing (always use `px`)
- default system fonts outside of the Apple stack
- purple-blue generic gradients
- cookie-cutter UI patterns

Every design must feel:
custom, intentional, and intrinsically Apple.

---

### 7. Match Complexity to Style

- Landing Page → Dramatic typography, large imagery, cinematic spacing
- Web App → Precision, compact pixel spacing, native UI controls

Rule:
Design quality = execution consistency

---

### 8. Final Check Before Output

Ensure:
- strong Apple visual identity
- cohesive design system based on HIG
- ONLY `px` units used
- working, complete code

---

## Expected Output Format

The agent MUST output:

1. Short explanation of chosen HIG aesthetic (1–3 lines)

2. Full working code:

```html
<!-- or React / Vue -->