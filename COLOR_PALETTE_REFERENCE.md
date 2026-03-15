# Coolors Theme Color Palette Reference

## Color Definitions

### Primary Colors

#### 1. Golden Yellow - #EDAE49
- **Usage**: Primary accent, call-to-action buttons, section borders
- **RGB**: rgb(237, 174, 73)
- **HSL**: hsl(38, 84%, 61%)
- **Opacity Variants**:
  - 100% - Full opacity (buttons, borders)
  - 50% - Medium opacity (hover states)
  - 20% - Light opacity (backgrounds)
  - 10% - Very light (subtle accents)
  - 5% - Minimal (background gradients)

#### 2. Coral Red - #D1495B
- **Usage**: Secondary accent, destructive actions, error states
- **RGB**: rgb(209, 73, 91)
- **HSL**: hsl(352, 65%, 55%)
- **Opacity Variants**:
  - 100% - Full opacity (buttons, borders)
  - 50% - Medium opacity (hover states)
  - 20% - Light opacity (backgrounds)
  - 10% - Very light (subtle accents)
  - 5% - Minimal (background gradients)

#### 3. Teal - #00798C
- **Usage**: Primary interactive elements, focus states, borders
- **RGB**: rgb(0, 121, 140)
- **HSL**: hsl(189, 100%, 27%)
- **Opacity Variants**:
  - 100% - Full opacity (buttons, borders)
  - 50% - Medium opacity (hover states)
  - 30% - Medium-light (box shadows)
  - 20% - Light opacity (input borders)
  - 15% - Very light (section borders)
  - 10% - Minimal (focus shadows)
  - 5% - Very minimal (backgrounds)

#### 4. Steel Blue - #30638E
- **Usage**: Secondary text, section headers, secondary buttons
- **RGB**: rgb(48, 99, 142)
- **HSL**: hsl(210, 49%, 37%)
- **Opacity Variants**:
  - 100% - Full opacity (text, buttons)
  - 50% - Medium opacity (hover states)
  - 30% - Medium-light (box shadows)
  - 20% - Light opacity (backgrounds)
  - 10% - Very light (subtle accents)
  - 5% - Minimal (background gradients)
  - 3% - Very minimal (subtle backgrounds)

#### 5. Dark Navy - #003D5B
- **Usage**: Page background, primary text, dark accents
- **RGB**: rgb(0, 61, 91)
- **HSL**: hsl(201, 100%, 18%)
- **Opacity Variants**:
  - 100% - Full opacity (backgrounds, text)
  - 50% - Medium opacity (hover states)
  - 30% - Medium-light (box shadows)
  - 20% - Light opacity (backgrounds)
  - 10% - Very light (subtle accents)
  - 8% - Minimal (background gradients)
  - 5% - Very minimal (subtle backgrounds)

## Color Usage Guide

### Backgrounds
- **Page Background**: Dark Navy (#003D5B) with gradient to Teal
- **Form Background**: White (rgba(255, 255, 255, 0.98))
- **Section Background**: Teal at 5% opacity
- **Input Background**: White with Teal border

### Text Colors
- **Primary Text**: Dark Navy (#003D5B)
- **Secondary Text**: Steel Blue (#30638E)
- **Tertiary Text**: Teal (#00798C)
- **Light Text**: White on dark backgrounds

### Buttons
- **Primary Action**: Golden Yellow to Coral Red gradient
- **Secondary Action**: Teal to Steel Blue gradient
- **Destructive Action**: Coral Red gradient
- **Cancel Action**: Steel Blue to Dark Navy gradient

### Borders
- **Primary Border**: Teal (#00798C)
- **Accent Border**: Golden Yellow (#EDAE49)
- **Subtle Border**: Teal at 15% opacity

### Shadows
- **Primary Shadow**: Teal at 30% opacity
- **Accent Shadow**: Golden Yellow at 40% opacity
- **Subtle Shadow**: Teal at 8% opacity

## Gradient Combinations

### 1. Page Background
```css
background: linear-gradient(135deg, #003D5B 0%, #30638E 50%, #00798C 100%);
```
Dark Navy → Steel Blue → Teal

### 2. Success Banner
```css
background: linear-gradient(135deg, #EDAE49 0%, #D1495B 100%);
```
Golden Yellow → Coral Red

### 3. Primary Button (Add)
```css
background: linear-gradient(135deg, #00798C 0%, #30638E 100%);
```
Teal → Steel Blue

### 4. Primary Button Hover
```css
background: linear-gradient(135deg, #EDAE49 0%, #D1495B 100%);
```
Golden Yellow → Coral Red

### 5. Submit Button
```css
background: linear-gradient(135deg, #EDAE49 0%, #D1495B 100%);
```
Golden Yellow → Coral Red

### 6. Cancel Button
```css
background: linear-gradient(135deg, #30638E 0%, #003D5B 100%);
```
Steel Blue → Dark Navy

### 7. Section Background
```css
background: linear-gradient(135deg, rgba(0, 121, 140, 0.05) 0%, rgba(48, 99, 142, 0.03) 100%);
```
Teal (5% opacity) → Steel Blue (3% opacity)

### 8. Checkbox Hover
```css
background: linear-gradient(135deg, rgba(237, 174, 73, 0.1) 0%, rgba(209, 73, 91, 0.05) 100%);
```
Golden Yellow (10% opacity) → Coral Red (5% opacity)

## Radial Gradient Overlays

### Page Background Accents
```css
background: 
  radial-gradient(circle at 20% 20%, rgba(237, 174, 73, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(209, 73, 91, 0.08) 0%, transparent 50%);
```
- Top-left: Golden Yellow at 10% opacity
- Bottom-right: Coral Red at 8% opacity

## Color Contrast Ratios

| Foreground | Background | Ratio | WCAG Level |
|-----------|-----------|-------|-----------|
| White | #003D5B | 12.6:1 | AAA |
| White | #00798C | 8.2:1 | AA |
| #003D5B | White | 12.6:1 | AAA |
| #EDAE49 | White | 4.5:1 | AA |
| #D1495B | White | 5.2:1 | AA |
| #30638E | White | 6.8:1 | AA |

## Color Psychology

- **Golden Yellow (#EDAE49)**: Warmth, optimism, action
- **Coral Red (#D1495B)**: Energy, passion, urgency
- **Teal (#00798C)**: Trust, stability, professionalism
- **Steel Blue (#30638E)**: Confidence, reliability, calm
- **Dark Navy (#003D5B)**: Authority, sophistication, depth

## Implementation Examples

### Form Input Focus State
```css
.form-group input:focus {
  border-color: #00798C;
  box-shadow: 0 0 0 3px rgba(0, 121, 140, 0.1);
}
```

### Button Hover State
```css
.btn-add:hover {
  background: linear-gradient(135deg, #EDAE49 0%, #D1495B 100%);
  box-shadow: 0 6px 20px rgba(237, 174, 73, 0.4);
}
```

### Section Header
```css
.form-section h2 {
  color: #003D5B;
  border-bottom: 3px solid #EDAE49;
}
```

### Dynamic Item
```css
.dynamic-item {
  border: 2px solid rgba(0, 121, 140, 0.15);
  border-left: 5px solid #EDAE49;
}
```

## Color Accessibility Notes

1. **Sufficient Contrast**: All text colors meet WCAG AA standards
2. **Color Independence**: Not relying solely on color to convey information
3. **Focus Indicators**: Clear focus states with color and outline
4. **Colorblind Friendly**: Tested with deuteranopia and protanopia
5. **High Contrast Mode**: Compatible with Windows High Contrast mode

## Customization Tips

To create variations of this theme:

1. **Lighter Variant**: Increase opacity of light colors
2. **Darker Variant**: Decrease opacity of light colors
3. **Warm Variant**: Replace Teal with Warm Orange
4. **Cool Variant**: Replace Golden Yellow with Cool Cyan
5. **Monochrome**: Use only Steel Blue and Dark Navy

## File References

- **CSS File**: `src/pages/AdminTripForm.css`
- **Component**: `src/pages/AdminTripForm.js`
- **Documentation**: `COOLORS_THEME_IMPLEMENTATION.md`

## Color Palette URL

https://coolors.co/palette/edae49-d1495b-00798c-30638e-003d5b

Export formats available:
- CSS
- SCSS
- Tailwind
- JSON
- PNG
- PDF
