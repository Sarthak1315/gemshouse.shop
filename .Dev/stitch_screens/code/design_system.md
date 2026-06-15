# Design System: Luxury Gemstone Marketplace

## Brand & Style

The brand evokes an atmosphere of exclusive, high-end editorial luxury. It targets discerning collectors, master jewelers, and investors who value provenance, ethical sourcing, and artisanal craftsmanship. The visual language is a blend of **Minimalism** and **Modern Luxury**, characterized by expansive white space, a sophisticated dark-and-light contrast, and high-quality macro photography. 

The aesthetic is "Gallery-Modern"—clean, authoritative, and hushed. It avoids flashy trends in favor of timeless elegance, using subtle shimmering effects and fine lines to suggest the brilliance of gemstones without overwhelming the user.

## Layout & Spacing

The system uses a **Fixed Grid** approach for desktop content to maintain editorial focus, while scaling fluidly on smaller screens.

- **Grid:** A 12-column grid with 32px gutters.
- **Rhythm:** Spacing follows an 8px base unit. Vertical section padding is generous (96px/12rem) to ensure "breathing room" between thematic blocks.
- **Bento Grid:** Featured collections use a composite grid where hero items span 8 columns and secondary items span 4, creating a dynamic visual hierarchy.
- **Margins:** Desktop margins are wide (80px) to frame the content, whereas mobile margins are compressed to 20px to maximize screen real estate.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Outlines** rather than heavy shadows.

- **Surfaces:** Depth is created by alternating between pure white (`#FFFFFF`) and very light grey (`#F6F3F2`) containers.
- **Glassmorphism:** Navigation bars utilize a `backdrop-blur-xl` effect with 80% opacity to maintain context while keeping the interface feeling lightweight and airy.
- **Outlines:** Use ultra-thin (0.5px) borders in `Champagne Gold` or low-opacity `Outline Variant` to define containers. 
- **Shadows:** Minimal usage. If shadows are required, they should be "Ambient"—very low opacity, large blur radius, and no offset, mimicking soft studio lighting.

## Components

- **Buttons:** 
  - *Primary:* Solid Emerald Deep background, sharp corners, Label-Caps typography. Includes a "shimmer" hover effect—a diagonal light-sweep animation.
  - *Secondary:* Transparent background with a Champagne Gold thin border.
- **Navigation:** Top-centered logo with a dual-row structure. Top row for utility/search, bottom row for categorized navigation. Links use an underline transition on hover/active states.
- **Bento Cards:** Image-heavy cards with a gradient overlay (`charcoal/80` to transparent) at the bottom to ensure legibility of white typography. Subtle 105% image scale on hover.
- **Iconography:** Use "Material Symbols Outlined" with a thin weight (200-300). Icons should be treated as jewelry—delicate and spaced out.
- **Badges:** Small rectangular tags with Emerald backgrounds and Gold text, placed in the top-left of product cards to denote "Investment Grade" or "Source."
- **Input Fields:** Bottom-border only or very thin outlined boxes to maintain the minimal, airy feel of the concierge forms.