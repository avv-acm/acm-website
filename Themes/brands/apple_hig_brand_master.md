# Apple Human Interface Guidelines — Master Brand & Design Reference
> **Purpose:** Complete institutional knowledge of Apple's design philosophy, brand rules, and visual system — from first principles to current Liquid Glass era. Use this to build interfaces that feel unmistakably native, intentional, and premium.
>
> **Source:** `developer.apple.com/design/human-interface-guidelines` + `developer.apple.com/design/resources/`
> **Last compiled:** June 2026

---

## Table of Contents

1. [The Philosophy — What Apple Is Actually Doing](#1-the-philosophy)
2. [Historical Evolution (1977 → 2026)](#2-historical-evolution)
3. [Core Design Principles](#3-core-design-principles)
4. [iOS 26 — Liquid Glass Era Principles](#4-ios-26-liquid-glass-era)
5. [Typography System](#5-typography-system)
6. [Color System](#6-color-system)
7. [Layout, Spacing & Grid](#7-layout-spacing--grid)
8. [Navigation Architecture](#8-navigation-architecture)
9. [Components & Controls](#9-components--controls)
10. [Iconography — App Icons & SF Symbols](#10-iconography)
11. [Motion & Animation](#11-motion--animation)
12. [Accessibility — Non-Negotiable Rules](#12-accessibility)
13. [Platform-Specific Rules](#13-platform-specific-rules)
14. [Design Resources & Tooling](#14-design-resources--tooling)
15. [Anti-Patterns — What Apple Rejects](#15-anti-patterns)
16. [Human View — The Emotional Contract](#16-human-view)
17. [Quick Reference Cheatsheet](#17-quick-reference-cheatsheet)

---

## 1. The Philosophy

Apple's design is **not aesthetic preference — it is a belief system.**

The belief: *Technology should disappear. Only the experience should remain.*

Every pixel, transition, weight, and label exists to answer one question:
> **"Does this serve the human, or does this serve the interface?"**

If it serves the interface → remove it.
If it serves the human → make it invisible.

### The Three-Word Test
Apple runs every design decision through three implicit questions:
- **Is it clear?** Can a stranger understand this in under 3 seconds?
- **Does it defer?** Does the UI get out of the way of the content?
- **Is it deep?** Does the visual hierarchy tell a story without words?

### Why This Matters for You (CruxLabx / HyperWrike)
Following Apple HIG isn't about making iOS apps. It's about absorbing the **highest standard of human-computer interaction on the planet** and applying that taste to GHOST Station, IntraMind's UI, SOVEREIGN's voice HUD, and every client dashboard you ship through HyperWrike. This is the reference that separates engineers who build tools from engineers who build experiences.

---

## 2. Historical Evolution

Understanding *where* Apple's rules came from tells you *why* they are rules.

| Era | Year(s) | What Happened | Design Impact |
|---|---|---|---|
| **Foundation** | 1977 | Apple II HIG — first documented UI guidelines in personal computing | Consistency as a principle born |
| **GUI Revolution** | 1984 | Macintosh HIG — menu bar, windows, icons, mouse-driven interaction | Direct manipulation, user control, undo/forgiveness |
| **Classic Mac** | 1985–2006 | Desktop metaphor matures; skeuomorphism begins | Real-world object metaphors to explain digital |
| **iPhone Touch** | 2007–2012 | Touch-first, small screen, one thumb. Skeuomorphism peaks (leather, felt, wood) | Fat fingers need big targets; metaphors teach new paradigms |
| **iOS 7 Flat Revolution** | 2013 | Jony Ive redesign — skeuomorphism stripped. Flat. Translucent. Thin fonts. | Birth of modern HIG: Clarity, Deference, Depth as explicit principles |
| **Refinement** | 2014–2019 | San Francisco font (2014). Dynamic Type. Rounded corners. Large Titles (2017). Gesture nav. | Typography becomes the primary design element |
| **Unified Platform** | 2020–2023 | Single HIG for all platforms. Widgets, extensions, SwiftUI. visionOS prep. | Cross-device consistency; design tokens standardised |
| **Liquid Glass** | 2025–2026 (iOS 26) | Full visual redesign. Translucent glass surfaces. Motion-responsive depth. Unified across ALL Apple OSes | Interface becomes a material, not a layer |

### Key Turning Points in Taste

**1984 → Principles that still hold:**
- Consistency across all apps
- Direct manipulation (touch the thing to change it)
- User always in control
- Forgiveness (undo must exist)

**2013 → The philosophy crystallises:**
> *"Design is not just what it looks like and feels like. Design is how it works."* — Steve Jobs
- Ornamentation is not design
- Every added element must justify its existence
- Typography carries hierarchy — not gradients or shadows

**2025 → The evolution completes:**
- Glass surfaces connect 2D apps to the 3D spatial future (Vision Pro)
- Interface responds to light, motion, and content dynamically
- The UI is no longer a skin — it is a material with physical properties

---

## 3. Core Design Principles

These are **immutable.** Every HIG update since 2013 has lived inside these.

### Principle 1: CLARITY

> *Every element should be immediately understandable. The interface communicates without instruction.*

**What this means in practice:**
- Text must be legible at all sizes — never sacrifice readability for style
- Icons must be precise and instantly recognisable — not decorative
- Labels over icons when the icon's meaning is ambiguous
- Ornamentation that obscures function must be removed
- Users should never need to experiment to understand what a control does

**Test:** Show any screen to someone for 3 seconds. If they can't tell what the primary action is → you failed clarity.

---

### Principle 2: DEFERENCE

> *The interface defers to content. UI chrome supports; it never competes.*

**What this means in practice:**
- Controls recede when not in use (translucency, thin lines)
- Animation draws attention to content transitions, not itself
- Empty space is NOT a design failure — it is deference in action
- No background textures that fight with content
- Navigation bars collapse on scroll to give content more room

**The discipline:** Designers want their work noticed. Apple's best work is invisible. The Camera app is 90% viewfinder. Notes is an almost-blank canvas. The more your UI disappears, the better the design.

---

### Principle 3: DEPTH

> *Visual layers and realistic motion communicate hierarchy and spatial relationships.*

**What this means in practice:**
- Translucency hints at content beneath surfaces (you're not alone in this space)
- Modal sheets slide up from below — they exist "above" the content
- Parallax and scaling create a sense of three-dimensional space
- Push transitions (right = deeper) vs pop (left = back/up)
- Shadows are not decorative — they indicate elevation and layer order

**Not to confuse with decoration:** Depth is functional. A shadow on a menu tells you it's floating above the page. A parallax effect on the home screen tells you depth exists. Remove depth cues and users lose spatial orientation.

---

### Principle 4: CONSISTENCY

> *Leverage familiar patterns. When users know where things are, they focus on what they're doing — not how to use the app.*

**What this means in practice:**
- Use system components before building custom ones
- Standard gestures must work the same (swipe to go back, pinch to zoom)
- Destructive actions are red. Always.
- Navigation bars at the top. Tab bars at the bottom.
- Back button in top-left. Confirm in top-right.
- "Cancel" vs "Done" — not "Nope" vs "Yep"

**The counterintuitive truth:** A slightly "boring" app that follows conventions outperforms a "creative" app that invents new patterns. Users spend 99% of their time in OTHER apps. Your app borrows trust from patterns they already know.

---

## 4. iOS 26 Liquid Glass Era

iOS 26 (WWDC 2025) introduced the most significant visual redesign since iOS 7 in 2013. These are the **new rules** on top of the classic four principles.

### New HIG Principles for iOS 26

**1. HIERARCHY (evolved from Depth)**
> *Controls and interface elements elevate and distinguish the content beneath them.*
- Glass controls float above content as a distinct functional layer
- Navigation layer and content layer are now physically separated materials
- Dynamic layout adjusts hierarchy based on user's focus context
- Never apply Liquid Glass to content itself — only to navigation/controls

**2. HARMONY (new)**
> *The design balances hardware, content, and controls into one coherent experience.*
- Interface aligns with device hardware geometry (rounded corners, edge-to-edge)
- HDR display capabilities are leveraged — not ignored
- Liquid Glass tints adapt to the underlying content's dominant color
- Personalisation (Lock Screen wallpapers, folder colors) flows into the UI layer seamlessly

**3. CONSISTENCY (elevated)**
> *For the first time, one unified design language across ALL Apple platforms simultaneously.*
- iOS 26, iPadOS 26, macOS Tahoe, watchOS 26, tvOS 26, visionOS 26 — same glass material
- Cross-device users experience zero visual jarring when switching platforms
- Core design token system (colors, spacing, materials) shared system-wide

### What Liquid Glass IS

Liquid Glass is **Apple's first dynamic UI material** — not a style, not a skin, but a physics-based rendering system.

Properties of a Liquid Glass surface:
- **Refracts light** — doesn't just blur, it bends light like real glass
- **Adapts to content** — tints based on what's beneath it dynamically
- **Responds to motion** — shifts with device orientation and parallax
- **Has variants:** `.regular` (medium transparency), `.clear` (high transparency for media-rich backgrounds), `.identity` (disabled — no effect)
- **Ambient-aware** — adjusts to environmental lighting conditions

### Where to Apply Liquid Glass
| Apply | Never Apply |
|---|---|
| Navigation bars | Content lists |
| Tab bars | Tables and data |
| Control Center widgets | Media (images, video) |
| Toolbars | Main app content area |
| System overlays | Text blocks |

### The Philosophical Signal of Liquid Glass
Apple is using glass as a **bridge between 2D and spatial computing.** Vision Pro established that interfaces can exist in 3D space as floating glass panels. iOS 26 brings that material vocabulary to 2D devices — preparing users' eyes and muscle memory for a spatial future. This is not a visual refresh. It is a strategic design roadmap.

---

## 5. Typography System

### The San Francisco Type Family

Apple built San Francisco in 2014 specifically for screen legibility. This is the most engineered typeface in consumer technology — not chosen for aesthetics, engineered for reading on glass at every size.

| Font | Use Case | Key Feature |
|---|---|---|
| **SF Pro** | iOS, iPadOS, macOS, tvOS | Optical sizing; primary system font |
| **SF Pro Text** | ≤ 19pt (body, captions) | Wider spacing, heavier strokes for small size legibility |
| **SF Pro Display** | ≥ 20pt (titles, headlines) | Tighter spacing, refined strokes for large text elegance |
| **SF Compact** | watchOS | Tighter letterforms for tiny round displays |
| **SF Mono** | Code editors, terminals | Fixed-width, optimised for code reading |
| **New York** | Companion serif | Long-form reading, editorial contexts |

### The Type Scale (iOS Standard)
| Style | Size | Weight | Use |
|---|---|---|---|
| Large Title | 34pt | Regular | Primary screen header |
| Title 1 | 28pt | Regular | Section header |
| Title 2 | 22pt | Regular | Sub-section header |
| Title 3 | 20pt | Regular | Sub-section variant |
| Headline | 17pt | **Semibold** | Emphasised content |
| Body | 17pt | Regular | Standard text — most of your app |
| Callout | 16pt | Regular | Secondary emphasis |
| Subheadline | 15pt | Regular | Supporting text |
| Footnote | 13pt | Regular | Secondary information |
| Caption 1 | 12pt | Regular | Labels, captions |
| Caption 2 | 11pt | Regular | Minimum readable size |

### Typography Rules — Non-Negotiable
1. **Minimum 11pt** — never go below, even at smallest Dynamic Type setting
2. **Support Dynamic Type** — layouts must flex from Small to Accessibility Extra Extra Extra Large
3. **SF Pro is the default** — justify custom fonts with branding requirements; they add complexity and weight
4. **Line length 45–75 characters** — optimal reading comfort
5. **Hierarchy through size AND weight** — don't rely on color alone to create hierarchy

### Critical: Optical Sizing is Automatic in System APIs
If you use SwiftUI's `.font(.title)` or UIKit's `UIFont.preferredFont(forTextStyle:)` — optical sizing is handled. If you're mocking in Figma, manually select SF Pro Text vs SF Pro Display based on size.

---

## 6. Color System

### Apple's Color Philosophy
Apple does **not publish hex codes.** This is deliberate. Colors are **adaptive by design** — they change based on:
- Light mode vs Dark mode
- High Contrast accessibility mode
- Display capabilities (HDR, P3 wide gamut)
- Liquid Glass tinting from underlying content

### Semantic System Colors (Use Names, Not Hexes)
```
systemBlue        → Interactive links, CTAs
systemGreen       → Success, confirmation, health
systemRed         → Destructive actions, errors, danger
systemOrange      → Warnings
systemYellow      → Alerts, highlights
systemPink        → Playful accents
systemPurple      → Premium, creative
systemTeal        → Secondary interactive
systemIndigo      → Information
systemGray        → Disabled, secondary text
systemBackground  → Primary background (white/black adaptive)
secondaryBackground → Grouped content background
tertiaryBackground  → Inset grouped elements
label             → Primary text
secondaryLabel    → Secondary text
tertiaryLabel     → Placeholder text
quaternaryLabel   → Very subtle text
separator         → Divider lines
```

### Color Rules
1. **Never rely on color alone** — always pair with a secondary indicator (icon, label, pattern) for accessibility
2. **Red = Destructive** — this is a system contract. Never use red for non-destructive actions
3. **4.5:1 contrast minimum** for normal text; **3:1 minimum** for large text (WCAG AA)
4. **Support both Light and Dark appearances** — no exceptions in iOS 26
5. **Color blindness affects 8% of men, 0.5% of women** — design for this, not around it

### Liquid Glass Color Behavior (iOS 26)
- Glass surfaces auto-tint from content beneath them
- Don't fight the tinting — design your color palette to harmonise
- Test your UI with various wallpapers and content types as backgrounds

---

## 7. Layout, Spacing & Grid

### The 4pt Grid
All Apple UI is built on a **4-point base grid.** Preferred increments: 4, 8, 12, 16, 20, 24, 32, 40, 48.

### Minimum Touch Target: 44 × 44 points
This is a research-validated requirement. Controls smaller than 44×44pt cause **25%+ higher tap error rates** — especially for users with motor impairments. The visual element can be smaller; the tappable region must not be.

### Safe Areas
Every screen has safe areas that account for:
- iPhone notch / Dynamic Island
- Home indicator bar
- Navigation bars and tab bars

Content must respect safe area insets. Clipping to the notch = automatic quality signal of a low-effort app.

### Layout Patterns
- **Edge-to-edge** background fills — content bleeds to screen edges
- **Grouped lists** — use inset grouped table view style for Settings-like content
- **Sidebar + content** — iPad primary layout; never a hamburger menu on iPad
- **Card-based layouts** — rounded corners, subtle shadow, white on light backgrounds

### Spacing System
```
Micro:   4pt   (icon-to-label gaps)
Small:   8pt   (related elements)
Base:    16pt  (standard margins, content padding)
Medium:  20pt  (section spacing)
Large:   24pt  (inter-card gaps)
XLarge:  32pt  (section headers)
XXLarge: 48pt+ (major section separations)
```

---

## 8. Navigation Architecture

### The Three Navigation Modes

#### 1. Tab Bar (Global Navigation)
- **Position:** Bottom of screen, always visible
- **Use for:** Top-level, parallel sections of the app
- **Limit:** 3–5 tabs on iPhone; more on iPad
- **Icons:** Filled = selected; Outlined = unselected
- **Rule:** Each tap reveals a completely distinct section — never same content
- **Don't:** Change the selected tab without user action

#### 2. Navigation Stack (Hierarchical)
- **Position:** Top (navigation bar with back button)
- **Use for:** Drilling into content depth
- **Transition:** Push right (go deeper) / pop left (go back)
- **Labels:** Back button shows *destination* title, not "Back"
- **Large Titles:** Collapse on scroll to maximise content room
- **Gesture:** Swipe from left edge always goes back — never disable this

#### 3. Modal / Sheet (Focused Task)
- **Position:** Slides up from bottom, covers content partially or fully
- **Use for:** Self-contained tasks requiring completion or cancellation (compose, edit, configure)
- **Dismissal:** "Done" (saves) or "Cancel" (discards); swipe down is shortcut
- **Warning:** Disable swipe-dismiss if unsaved data would be lost
- **Don't:** Use modals for navigational content — that's hierarchical, not modal

### Navigation Anti-Patterns
- Hamburger menus on iOS — banned. Move content to tab bar or simplify IA
- Nested modals — confuses user's mental model of where they are
- Modal chains — if you need 3 modals deep, redesign the IA
- Custom back gestures — breaks system expectation

---

## 9. Components & Controls

### Buttons
- **Primary action:** Filled, rounded, full-width or prominent
- **Secondary action:** Outlined or tinted
- **Destructive:** Red tint — always confirm before executing
- **Minimum size:** 44 × 44pt tappable area

### Lists & Tables
- **Plain:** Continuous rows, no visual grouping
- **Grouped/Inset:** Rounded card groups — preferred for Settings-style content
- **Disclosure chevron `>`:** Indicates drill-down to more content
- **Detail labels:** Secondary info on the right side of rows

### Pickers & Selectors
- **Date/Time:** Scrolling wheel (iOS) — never calendar-grid (that's Android)
- **Segmented Control:** 2–5 mutually exclusive options
- **Toggles:** Boolean on/off — green = on, grey = off (system contract)

### Alerts & Action Sheets
- **Alert:** Critical information requiring immediate decision; max 2 actions; destructive action goes last and is red
- **Action Sheet:** Multiple actions for current context; appears from bottom; Cancel always present

### Text Fields
- Clear button appears when field has text
- Placeholder text is grey — never mistake it for real content
- Keyboard type matches input (number pad for phone, email keyboard for email)

---

## 10. Iconography

### App Icons

**Design Principles:**
1. **Instantly recognisable at smallest size** — complex detail becomes invisible at 20×20
2. **Simple concept, 2–3 colors max** for the core symbol
3. **No screenshots** inside the icon
4. **No text** unless it's an inseparable part of the brand (like a single letter mark)
5. **Fill the canvas** — neither cramped nor floating in dead space
6. **Optical centering** — math center ≠ visual center; adjust for perceived balance

**Required Sizes (iOS):**
| Context | Points | @3x Pixels |
|---|---|---|
| Home Screen | 60 × 60 | 180 × 180 |
| iPad Pro Home | 83.5 × 83.5 | 167 × 167 |
| App Store | 1024 × 1024 | 1024 × 1024 |
| Spotlight | 40 × 40 | 120 × 120 |
| Notifications | 20 × 20 | 60 × 60 |

**iOS 26 Icon Variants Required:**
- **Light appearance** — default, clean background
- **Dark appearance** — adjusted for dark backgrounds (not just color-inverted)
- **Tinted** — single-color version that adopts user's accent color
- **Icon Composer** (Apple's new tool) — creates layered Liquid Glass icons from one design

### SF Symbols — The Icon Language

SF Symbols is Apple's **7,000+ symbol library** designed to integrate seamlessly with San Francisco type.

Key properties:
- **9 weights** — Ultralight to Black (matches text weight)
- **3 scales** — Small, Medium, Large
- **Auto-alignment** — symbols optically align with adjacent text at any size
- **Multi-layer** — built for motion and animation
- **Localisation-aware** — adapts to RTL scripts and 20+ international writing systems
- **Animations built-in** — wiggle, rotate, breathe, bounce effects

**Usage Rules:**
- Use SF Symbols before building custom icons — they carry system meaning
- When there's no clear symbol shorthand, use a **text label** (Apple's own WWDC25 guidance: *"A pencil might suggest annotate, and a checkmark can look like confirm — making actions like Select or Edit easy to misread. When there's no clear shorthand, a text label is always the better choice."*)
- Match symbol weight to adjacent text weight
- Don't recolour SF Symbols in ways that conflict with semantic meaning (red = stop/danger, green = go/confirm)

---

## 11. Motion & Animation

### Apple's Motion Philosophy
> *Motion communicates. It is never decorative.*

Every animation answers a spatial question: *Where did this come from? Where is it going? What does this change mean?*

### Motion Rules

**Purposeful:**
- Sheet slides up → it lives above the current screen
- Push transition → you went deeper into a hierarchy
- Fade → content appeared / disappeared in place (no spatial relationship)
- Parallax → multiple depth layers exist in this space

**Durations:**
- Micro interactions: 100–200ms
- Standard transitions: 300–400ms
- Full-screen transitions: 400–600ms
- Never exceed 600ms for a standard transition — it feels broken

**Physics:**
- Apple uses spring animations, not linear or ease-in-out curves
- Springs feel alive — they overshoot slightly and settle
- Linear animations feel mechanical and wrong for touch interfaces

**Reduce Motion:**
- Must be respected system-wide
- Sliding transitions → crossfades
- Parallax effects → removed
- Autoplay animations → stopped
- Never assume animation can convey critical information — always provide static fallback

---

## 12. Accessibility

This is **not optional.** App Store reviewers specifically evaluate accessibility. Poor accessibility = rejection risk.

### VoiceOver (Screen Reader)
- Every interactive element needs a meaningful `accessibilityLabel`
- Label describes **purpose**, not appearance: "Submit Order" not "Blue Button"
- Hints describe behavior: "Double tap to purchase"
- Traits declare type: button, link, header, image, adjustable
- Test by navigating your entire app sequentially with VoiceOver enabled

### Touch Targets
- **Minimum 44 × 44 points** — absolute floor
- Adequate spacing between targets to prevent mis-taps
- If visual element is smaller, expand the hit area with invisible padding

### Color & Contrast
- **4.5:1 ratio** — normal text (≤ 18pt regular or 14pt bold)
- **3:1 ratio** — large text
- **Never color-only** — all information conveyed by color must also have a text, icon, or pattern indicator
- Test: would a monochrome version of your screen still communicate the same information?

### Dynamic Type
- Support all text size settings — from xSmall to Accessibility XXXLarge
- Layouts must flex: text wraps, containers expand, elements stack vertically
- Never truncate critical information at large sizes

### Haptics
- Use system haptic feedback patterns consistently
- Light: selection changes
- Medium: confirmation
- Heavy: critical alerts or significant actions
- Custom haptics must follow these intensity conventions

---

## 13. Platform-Specific Rules

### iOS / iPhone
- **One hand operation** — primary actions within thumb reach (bottom half of screen)
- **Tab bar bottom navigation** — always visible, max 5 tabs
- **Swipe from left edge** = go back — NEVER disable or override this
- **Dynamic Island** — live activities, alerts, and notifications flow through it
- **Safe area** around Dynamic Island and home indicator

### iPadOS
- **Sidebar + content** is the primary layout — not tab bar for complex apps
- **Multitasking** must be handled — Split View, Stage Manager
- **Apple Pencil** input should be considered for drawing/note apps
- **Larger tap targets** aren't required but benefit keyboard+trackpad users
- **Multiple windows** — apps should support multiple scene sessions

### macOS
- **Menu bar** is the primary command surface — keyboard shortcuts matter
- **Pointer precision** — smaller hit areas acceptable (cursor is precise)
- **Window resizing** must be supported
- **Toolbar** replaces tab bar as primary action surface
- **Keyboard navigation** — full app navigable by keyboard alone

### watchOS
- **5-second interaction model** — glanceable, one-action interactions
- **SF Compact** font only
- **Complications** are primary entry points — design for them
- **Crown interaction** = scroll/zoom/adjust — use it

### visionOS (Vision Pro)
- **Eye tracking + hand gestures** replace touch
- **Windows float in 3D space** — design for comfortable viewing distance (~1.5–3m)
- **Immersive vs passthrough** — know when to use each
- **No hover states** — eye tracking handles what cursor hover did on macOS
- **Liquid Glass** is native material here — this is where it originated

---

## 14. Design Resources & Tooling

### Official Downloads (developer.apple.com/design/resources/)

| Resource | What It Is | Format |
|---|---|---|
| **iOS 26 UI Kit** | Full component library for iOS 26 | Sketch (118.3MB), Figma |
| **SF Symbols App** | Browse + export all 7,000+ symbols | macOS app (requires Sonoma+) |
| **San Francisco Font** | SF Pro, SF Compact, SF Mono, New York | .otf / .ttf |
| **Icon Composer** | Create Liquid Glass layered icons | macOS app (Sonoma+) |
| **Parallax Previewer** | Preview parallax icon layers | macOS app |
| **Device Bezels** | iPhone/iPad/Mac frames for mockups | Sketch, Figma, PSD |
| **Figma UI Kit (iOS 26)** | Community Figma file — full iOS components | Figma |

### Design Token Naming Convention
Apple's HIG uses **semantic names**, not raw values. Follow this in your own systems:

```
// Colors
color.label.primary
color.label.secondary
color.background.primary
color.fill.tertiary

// Typography
font.largeTitle
font.title1
font.body
font.caption1

// Spacing
spacing.xs  → 4pt
spacing.sm  → 8pt
spacing.md  → 16pt
spacing.lg  → 24pt
spacing.xl  → 32pt
```

### Recommended Workflow
1. Start in **Figma** using iOS 26 UI Kit
2. Use **SF Symbols app** to find and export symbols
3. Validate accessibility with **Accessibility Inspector** (Xcode)
4. Test typography with **Dynamic Type** at max accessibility size in Simulator
5. Test colors with **Color Contrast Analyser**
6. Use **Icon Composer** for Liquid Glass icon variants (Light/Dark/Tinted)

---

## 15. Anti-Patterns

These will get your app rejected, tanked in reviews, or flagged by experienced designers instantly.

### UX Anti-Patterns
| ❌ Don't | ✅ Do |
|---|---|
| Hamburger menu on iOS | Tab bar or simplified IA |
| Custom navigation gestures | System gestures always work |
| Nested modals (3+ deep) | Redesign the information architecture |
| Auto-dismiss dialogs | User must consciously dismiss |
| Splash screens over 2s | Launch images + instant load |
| Blocking UI during network | Skeleton screens + optimistic updates |
| Bottom sheet + tab bar fighting | One or the other per context |
| Modal for content browsing | Navigation stack |

### Visual Anti-Patterns
| ❌ Don't | ✅ Do |
|---|---|
| Red for non-destructive actions | Red = destructive ONLY |
| Color-only information | Color + icon/label/pattern |
| Text smaller than 11pt | Use Dynamic Type, respect floor |
| Custom font compromising legibility | SF Pro unless brand demands otherwise |
| Excessive shadows everywhere | Shadows signal elevation — use sparingly |
| Decorative animations | Motion must communicate something |
| Icons without text when meaning is ambiguous | Add label |
| Applying Liquid Glass to content | Glass on controls only |

### Accessibility Anti-Patterns
| ❌ Don't | ✅ Do |
|---|---|
| Touch targets < 44×44pt | Always 44×44pt minimum |
| No VoiceOver labels | Label every interactive element |
| Ignore Dynamic Type | Test at all sizes, build flexible layouts |
| Color < 4.5:1 contrast | Verify with contrast tool |
| Hardcode animations ignoring Reduce Motion | Respect system preference |
| No keyboard navigation (macOS) | Full keyboard support |

---

## 16. Human View — The Emotional Contract

This section is the part most developers skip. It's also the part that separates a $5M-ARR app from a mediocre tool.

### What Apple Understands About Humans That Others Don't

**1. Cognitive Load is Real**
The human brain has limited working memory. Every interface element the user has to consciously *notice* consumes a unit of that budget. The best interfaces spend the user's cognitive budget on THEIR task — not on figuring out your UI. This is why clarity and deference are the top two principles. They are cognitive load principles, not aesthetic ones.

**2. Trust is Transferred**
When your app follows iOS conventions, users transfer their existing trust in Apple's platform to your app instantly. When you break conventions, you break that trust bridge and the user has to rebuild it from scratch — if they bother.

**3. Familiarity is Invisible**
Good design goes unnoticed. Users don't say "I love the way that navigation bar collapsed when I scrolled." They say "This app just works." That's the highest design compliment — invisibility.

**4. Delight Exists in Micro-Interactions**
Apple obsesses over the 100ms animations between states. The slight bounce when you hit the end of a list. The haptic when you toggle something. These are not engineering extras — they are the interface saying *"I felt that. Did you?"* They create a sense of aliveness that users feel but can't articulate. SOVEREIGN, your voice-first AI, needs this thinking — every feedback signal between voice and response is a micro-interaction.

**5. Respect > Engagement**
Apple explicitly does NOT maximise engagement. Dark patterns, addictive UX loops, infinite scroll manipulation — none of this is in the HIG. The HIG philosophy is: **get the user to their goal, then get out of their way.** An app that wastes someone's time is not a good app, even if the metrics look great. Respect the user's time. This is what "deference" means at a human level.

**6. The Disabled User Reveals Design Truth**
The 44×44pt touch target didn't start as an accessibility rule — it started as a usability finding. Motor accessibility improvements *always* improve experience for everyone. When you design for VoiceOver, you are forced to think about hierarchy and labeling more clearly — which makes the visual design clearer too. Accessibility is not a constraint; it is a design quality test.

**7. Consistency is Social Contract**
When you use a standard component, you are making a promise: *"This will behave the way you expect."* Breaking that contract — even in small ways — chips away at trust. Users have spent thousands of hours with iOS apps. They have deep, unconscious expectations. Violate them and they feel it, even if they don't know why.

### The Apple Emotional Hierarchy
```
DELIGHTED   ← micro-interactions, surprising polish, invisible excellence
CONFIDENT   ← clear hierarchy, familiar patterns, predictable behavior
FOCUSED     ← deference in action, content over chrome
COMFORTABLE ← accessible, legible, respectful of time
TRUSTED     ← consistent with platform, no dark patterns
```

Build upward from Trusted. Trying to delight users who don't trust your app first is wasted effort.

---

## 17. Quick Reference Cheatsheet

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPLE HIG — INSTANT REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRINCIPLES
  Classic:  Clarity → Deference → Depth → Consistency
  iOS 26:   Hierarchy → Harmony → Consistency

TYPOGRAPHY
  Body:           17pt Regular   (SF Pro Text)
  Headline:       17pt Semibold  (SF Pro Text)
  Large Title:    34pt Regular   (SF Pro Display)
  Minimum:        11pt           (Dynamic Type floor)
  System font:    SF Pro (don't use custom unless required)

LAYOUT
  Grid:           4pt base
  Margin:         16pt standard
  Touch target:   44 × 44pt minimum  ← NEVER VIOLATE
  Safe area:      Always respect

NAVIGATION
  Global:         Tab bar (bottom, 3–5 tabs)
  Hierarchy:      Navigation stack (push/pop)
  Focused task:   Modal / Sheet (slides up)
  Back:           Swipe from left edge ALWAYS works

COLOR
  Red:            Destructive ONLY
  Green:          Success / on-state
  Blue:           Interactive / CTA
  Contrast:       4.5:1 minimum (normal text)
  Rule:           Never color-only for information

MOTION
  Micro:          100–200ms
  Standard:       300–400ms
  Physics:        Spring curves, not linear
  Reduce Motion:  Always respect

ACCESSIBILITY
  VoiceOver:      Label every interactive element by PURPOSE
  Contrast:       4.5:1 normal, 3:1 large
  Dynamic Type:   Support all sizes
  Touch target:   44 × 44pt minimum

LIQUID GLASS (iOS 26)
  Apply to:       Controls, nav bars, tab bars, toolbars
  Never apply to: Content, lists, media, text
  Variant:        .regular / .clear / .identity
  Philosophy:     Interface as material, not layer

SF SYMBOLS
  Library:        7,000+ symbols, 9 weights, 3 scales
  Rule:           Use before building custom
  Text labels:    When symbol meaning is ambiguous, use text

ICONS (Required Variants)
  Light / Dark / Tinted
  1024×1024 for App Store (always)
  60×60pt Home Screen (@3x = 180×180px)

THE TEST
  Clear?   → User understands in 3 seconds?
  Defers?  → UI disappears behind content?
  Deep?    → Hierarchy readable without color?
  Consistent? → Behaves like iOS already does?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## References

- **Primary Source:** [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) — `developer.apple.com/design/human-interface-guidelines`
- **Design Resources:** [Apple Design Resources](https://developer.apple.com/design/resources/) — `developer.apple.com/design/resources/`
- **SF Symbols:** [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- **Fonts:** [developer.apple.com/fonts](https://developer.apple.com/fonts)
- **Get Started:** [developer.apple.com/design/get-started](https://developer.apple.com/design/get-started/)
- **WWDC Sessions:** Search "design" at [developer.apple.com/videos](https://developer.apple.com/videos/)

---

*Compiled by CruxLabx — Sovereign. Private. Precise.*
