# Design System Document: The Clinical Curator

## 1. Overview & Creative North Star
**Creative North Star: "The Clinical Curator"**
This design system rejects the "template" look of generic SaaS dashboards. In the world of medical insights, trust is not built with heavy borders and standard grids; it is built through precision, clarity, and an authoritative editorial layout. 

The "Clinical Curator" aesthetic treats data as high-end content. We move away from the "box-within-a-box" mentality. Instead, we use intentional asymmetry, expansive breathing room, and sophisticated tonal layering to guide the eye. Imagine a premium medical journal translated into a living, breathing digital interface. Elements don't just sit on a grid—they float, overlap, and exist in a multi-dimensional space defined by light and depth rather than lines.

## 2. Colors & Surface Philosophy
The palette is rooted in deep, authoritative blues (`primary`) and sterile, precise teals (`secondary`), balanced by a sophisticated range of cool neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or cards. Containers must be defined strictly through:
1.  **Background Color Shifts:** Placing a `surface-container-low` component on a `surface` background.
2.  **Tonal Transitions:** Using the hierarchy of `surface-container` tiers (Lowest to Highest) to denote nesting.
3.  **Shadow-Defined Edges:** Letting diffused ambient light create the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent layers. 
- **Base Level:** `surface` (#f8f9ff)
- **Primary Layout Sections:** `surface-container-low` (#eff4ff)
- **Interactive Cards:** `surface-container-highest` (#d3e4fe)
- **Active Modals/Floating Elements:** `surface-container-lowest` (#ffffff) with Glassmorphism.

### Signature Textures & Glass
- **Glassmorphism:** For floating notifications or high-priority overlays, use a semi-transparent `surface-container` with a `backdrop-blur` of 12px–20px. This softens the edges and makes the data feel integrated into the environment.
- **Micro-Gradients:** Main action points (CTAs) should utilize a subtle linear gradient from `primary` (#006194) to `primary-container` (#007bb9). This adds "soul" and prevents the flat, "cheap" feel of single-hex buttons.

## 3. Typography: The Editorial Voice
We use a high-contrast typographic scale to differentiate between "Insights" and "Data."

*   **Headlines (Manrope):** The Manrope font is our "Editorial Voice." Use `display-lg` and `headline-md` to make bold claims or summarize market trends. It should feel expansive and modern.
*   **Data & Interface (Inter):** Inter is our "Precision Voice." It is used for all table data, body copy, and labels. Its high x-height ensures legibility in dense medical reports.

**Hierarchy Tip:** Never center-align headlines in a dashboard. Use left-aligned, asymmetrical placement to create a sophisticated, "magazine-style" layout that breaks the traditional central axis.

## 4. Elevation & Depth
In this system, depth is a functional tool, not a stylistic flourish.

- **The Layering Principle:** Depth is achieved by "stacking." For example, a `surface-container-lowest` card sitting atop a `surface-container-low` section creates a natural, soft lift.
- **Ambient Shadows:** When a float is required, use extra-diffused shadows. 
    - *Shadow Color:* A 6% opacity tint of `on-surface` (#0b1c30). 
    - *Blur:* 24px to 40px for macro-elements.
- **The "Ghost Border" Fallback:** If a border is required for extreme accessibility needs, use a "Ghost Border"—the `outline-variant` (#bfc7d2) at **10% opacity**. High-contrast, 100% opaque borders are strictly forbidden.

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text, `lg` (0.5rem) roundedness.
- **Secondary:** `surface-container-high` background with `primary` text. No border.
- **State:** On hover, increase the gradient intensity; do not use a "darken" overlay.

### Pulsing Notifications (High Priority)
For critical medical alerts, use a "Double Pulse" effect. A central dot in `tertiary` (#825100) with two concentric, expanding rings at 20% and 10% opacity of the same color. This creates urgency without the "alarmist" feel of bright red.

### Tables & Data Lists
- **Rule:** Forbid the use of divider lines.
- **Separation:** Use a `0.5rem` vertical gap between rows, and give each row a `surface-container-low` background that shifts to `surface-container-high` on hover.
- **Typography:** Use `label-md` for headers (uppercase, tracking +5%) and `body-md` for cell data.

### Input Fields
- **Background:** `surface-container-highest` with a `Ghost Border` (10% `outline-variant`).
- **Focus State:** Transition the border to 100% `primary` opacity and add a subtle `primary-fixed` outer glow.

### Cards
Cards should not have a shadow by default. They are defined by their background color vs. the page background. Use `xl` (0.75rem) roundedness for large insight cards to soften the data-heavy layout.

## 6. Do’s and Don’ts

### Do:
- **Do** use whitespace as a separator. If you think you need a line, add 16px of space instead.
- **Do** use `tertiary` (#825100) for "Human Insight" callouts—it breaks the sea of blue and teal.
- **Do** use `secondary` (#006a61) for all positive medical trends and "healthy" data points.

### Don't:
- **Don't** use pure black (#000000) for text. Always use `on-surface` (#0b1c30) to maintain tonal harmony.
- **Don't** use standard "drop shadows" with zero spread. They look dated and heavy.
- **Don't** crowd the corners. Ensure a minimum padding of `2rem` (32px) for any container holding data visualizations.