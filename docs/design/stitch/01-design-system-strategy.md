# Design System Strategy: The Cinematic Curator

_Sourced from Stitch MCP `list_design_systems` — project **6747508532178572615**, asset **Cinema Noir** (`assets/edd57418919f4c5e80996eaf341072c3`). This file mirrors `theme.designMd` from the API._

## 1. Overview & Creative North Star

The North Star for this design system is **"The Cinematic Curator."**

In a world of cluttered OTT interfaces, this system rejects the "infinite grid" in favor of a high-end editorial experience. We treat digital real estate like a luxury film program. To move beyond a "template" look, we leverage **intentional asymmetry**—such as oversized hero titles overlapping content cards—and a rigorous **tonal layering** strategy. This creates a sense of "physical" depth where content isn't just displayed; it is presented. The interface should feel like a darkened theater where only the most important elements catch the light.

---

### 2. Colors & Surface Architecture

Our palette is rooted in the "Absolute Dark" philosophy. We do not use pure black (#000) for surfaces to avoid "crushing" the visual depth. Instead, we use deep charcoals and warm bordeaux-tinted grays.

#### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers.

Boundaries must be defined solely through:

1. **Background Shifts:** Moving from `surface` (#131313) to `surface_container_low` (#1C1B1B).
2. **Vertical Breathing Room:** Utilizing the `8` (2.75rem) or `10` (3.5rem) spacing tokens to signal a change in context.

#### Surface Hierarchy & Nesting

Treat the UI as a series of stacked layers. The closer an element is to the user, the "brighter" its surface becomes:

- **Base Layer:** `surface` (#131313) for the main application background.
- **Sectional Layer:** `surface_container_low` (#1C1B1B) for large content groupings.
- **Interactive Layer:** `surface_container_highest` (#353534) for cards, modals, or hovering states.

#### Glass & Gradient Implementation

To move beyond a flat "flat" look, use **Glassmorphism** for floating navigation bars or player controls.

- **The Recipe:** Use `surface_container` at 70% opacity with a `backdrop-filter: blur(20px)`.
- **Signature Gradients:** For primary CTAs, use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` (#FFB3AE) to `primary_container` (#FF5351) to add a "pulse" of energy to the Coral-Red accent.

---

### 3. Typography

The system uses a sophisticated pairing of **Manrope** (Display/Headlines) and **Inter** (Body/Labels).

- **Display (Manrope):** These are our "Editorial Statements." Use `display-lg` (3.5rem) for movie titles in hero sections. Use negative letter-spacing (-0.02em) to create a high-fashion, dense look.
- **Headline & Title (Manrope/Inter):** `headline-md` (1.75rem) serves as the primary gateway into a category. It should feel authoritative.
- **Body & Label (Inter):** `body-md` (0.875rem) is used for synopses and metadata. Inter’s high x-height ensures legibility against the dark `surface` backdrop.
- **The Tonal Hierarchy:** Primary information uses `on_surface` (#E5E2E1). Secondary metadata (Year, Rating, Genre) must use `on_surface_variant` (#E4BDBA) to reduce visual noise.

---

### 4. Elevation & Depth

We eschew traditional drop shadows for **Tonal Layering**.

- **The Layering Principle:** Place a `surface_container_lowest` (#0E0E0E) card inside a `surface_container_high` (#2A2A2A) section. This "recessed" look creates an elegant, carved-out feel without the need for a single pixel of stroke.
- **Ambient Shadows:** If an element must float (e.g., a Context Menu), use a shadow with a 40px blur and 6% opacity, using the `surface_container_lowest` color as the shadow tint. This mimics natural light dissipation.
- **The Ghost Border:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. This provides a "hint" of a container without breaking the minimal aesthetic.

---

### 5. Components

#### Buttons

- **Primary:** Background: `primary` gradient. Shape: `0.5rem` (8px). Typography: `title-sm` (Inter Semi-Bold).
- **Secondary:** Background: `surface_container_highest` (#353534). For a premium feel, add a 10% opacity `primary` tint to the background.
- **Ghost/Tertiary:** No background. Use `on_surface` text with a `primary` icon.

#### Content Cards (The Core Unit)

- **Geometry:** Always use `lg` (1rem/16px) for the outer container and `md` (0.75rem/12px) for internal elements (like "New" badges).
- **Nesting:** Place `on_surface` typography directly onto the image using a `surface_container_lowest` gradient overlay at the bottom 30% of the card.
- **Spacing:** Content within cards uses `3` (1rem) padding.

#### Chips & Badges

- **Selection Chips:** Use `secondary_container` (#822625) for the active state to provide a moody, deep-red glow that isn't as aggressive as the primary CTA.

#### Lists & Carousels

- **Strict Rule:** **Forbid dividers.** Use `6` (2rem) of horizontal whitespace between carousel items. If list items require separation, use a subtle background shift to `surface_container_low` on hover.

#### Navigation Rail (Unique OTT Component)

- Instead of a top bar, use a side-aligned Navigation Rail. Use **Glassmorphism** (70% opacity + blur) to allow movie poster art to bleed through as the user scrolls, keeping the experience immersive.

---

### 6. Do’s and Don'ts

- **DO** use `surface_bright` (#3A3939) for hover states on dark cards to create a "lit from within" effect.
- **DO** use intentional asymmetry—allow a "Featured" movie poster to take up 65% of the screen width while metadata takes up 35%.
- **DON'T** use 100% white (#FFFFFF) for long-form text; use `on_surface` (#E5E2E1) to reduce eye strain in dark environments.
- **DON'T** ever use a solid `outline` at 100% opacity. It breaks the "Cinematic" immersion and looks like a generic web app.
- **DO** prioritize "The Breath." If a screen feels crowded, double the spacing token (e.g., move from `5` to `10`). High-end design is defined by what you leave out.
