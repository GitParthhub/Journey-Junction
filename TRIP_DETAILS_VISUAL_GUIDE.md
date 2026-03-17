# Trip Details Page - Visual Design Guide

## Color Palette

### Primary Colors
```
Gold:       #EDAE49 - Used for highlights, activities, secondary actions
Red:        #D1495B - Used for status indicators, accents, day numbers
Teal:       #00798C - Used for primary actions, headers
Blue:       #30638E - Used for gradients, secondary headers
Dark:       #00385B - Used for text, titles, primary content
```

### Secondary Colors
```
Light Gray: #f8f9fa - Card backgrounds, light sections
Medium Gray: #e9ecef - Borders, dividers
Dark Gray:  #495057 - Secondary text
Text Dark:  #1a1a1a - Primary text
Text Light: #666666 - Secondary text
White:      #ffffff - Pure white backgrounds
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVBAR                                  │
├─────────────────────────────────────────────────────────────┤
│  ← Back                                    [Status] [Featured]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    HERO IMAGE SECTION                        │
│                   (Full Width, 500px height)                 │
│                                                               │
│  ◄ Image Counter ►                                           │
│  [Thumbnail] [Thumbnail] [Thumbnail] [Thumbnail]            │
├──────────────────────────────┬──────────────────────────────┤
│                              │                               │
│      MAIN CONTENT            │      SIDEBAR                  │
│      (Left Column)           │      (Right Column)           │
│                              │                               │
│  ┌──────────────────────┐   │  ┌──────────────────────┐    │
│  │ Card 1: Overview     │   │  │ Trip Summary         │    │
│  │ Title, Location      │   │  │ Price Display        │    │
│  │ Description          │   │  │ Quick Info           │    │
│  └──────────────────────┘   │  │ Edit/Back Buttons    │    │
│                              │  └──────────────────────┘    │
│  ┌──────────────────────┐   │                               │
│  │ Card 2: Quick Info   │   │  ┌──────────────────────┐    │
│  │ [4 Info Cards Grid]  │   │  │ Organizer Info       │    │
│  └──────────────────────┘   │  │ Avatar, Name         │    │
│                              │  └──────────────────────┘    │
│  ┌──────────────────────┐   │                               │
│  │ Card 3: Dates        │   │                               │
│  │ Departure | Return   │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 4: Activities   │   │                               │
│  │ [Activity Badges]    │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 5: Itinerary    │   │                               │
│  │ [Day 1] [Day 2] ...  │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 6: Accommodation│   │                               │
│  │ Hotel Details        │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 7: Services     │   │                               │
│  │ [Service Items]      │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 8: Transport    │   │                               │
│  │ Transportation Info  │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 9: Requirements │   │                               │
│  │ [Requirement Items]  │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 10: Weather     │   │                               │
│  │ [Weather Items]      │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
│  ┌──────────────────────┐   │                               │
│  │ Card 11: Additional  │   │                               │
│  │ Notes, Metadata      │   │                               │
│  └──────────────────────┘   │                               │
│                              │                               │
└──────────────────────────────┴──────────────────────────────┘
│                      FOOTER                                  │
└─────────────────────────────────────────────────────────────┘
```

## Card Design

### Standard Card
```
┌─────────────────────────────────────┐
│ 📅 Card Title                       │
├─────────────────────────────────────┤
│                                     │
│  Card Content                       │
│  - Item 1                           │
│  - Item 2                           │
│  - Item 3                           │
│                                     │
└─────────────────────────────────────┘
```

### Info Card (Grid Item)
```
┌──────────────────┐
│ 📅               │
│ Duration         │
│ 5 Days           │
└──────────────────┘
```

### Detail Row
```
┌─────────────────────────────────────┐
│ Label:              Value            │
└─────────────────────────────────────┘
```

## Typography Hierarchy

```
H1: Trip Title (32px, Bold, Dark)
    "Bali Paradise Adventure"

H2: Card Title (20px, Bold, Dark)
    "📅 Travel Dates"

H3: Section Title (16px, Bold, Dark)
    "Accommodation Details"

Body: Regular Text (16px, Regular, Light)
    "This is a description of the trip..."

Label: Small Text (12px, Bold, Gray)
    "DEPARTURE"

Value: Medium Text (14-16px, Bold, Dark)
    "15 January 2024"
```

## Color Usage Examples

### Gradients
```
Primary Gradient:
linear-gradient(135deg, #00798C 0%, #30638E 100%)

Gold Gradient:
linear-gradient(135deg, #EDAE49 0%, #f5c76b 100%)

Red Gradient:
linear-gradient(135deg, #D1495B 0%, #c1384a 100%)
```

### Backgrounds
```
Card Background: #ffffff (white)
Section Background: #f8f9fa (light gray)
Hover Background: Gradient with primary color
```

### Borders
```
Left Border (Accent): 3-5px solid primary color
Bottom Border (Divider): 2px solid #EDAE49 (gold)
```

## Interactive Elements

### Buttons
```
Primary Button (Edit):
Background: Gold Gradient
Color: Dark Text
Padding: 14px 20px
Border Radius: 8px
Hover: Elevation + Transform

Secondary Button (Back):
Background: Teal Gradient
Color: White Text
Padding: 14px 20px
Border Radius: 8px
Hover: Elevation + Transform
```

### Hover Effects
```
Cards: 
- Elevation (box-shadow increase)
- Slight upward movement (translateY)

Badges:
- Elevation
- Upward movement

Info Cards:
- Background color change
- Slight rightward movement
```

## Spacing System

```
Extra Small: 4px
Small: 8px
Medium: 12px
Large: 15px
Extra Large: 20px
Huge: 30px
Massive: 40px
```

## Shadow System

```
Small Shadow:
0 2px 8px rgba(0, 0, 0, 0.1)

Medium Shadow:
0 4px 16px rgba(0, 0, 0, 0.12)

Large Shadow:
0 8px 32px rgba(0, 0, 0, 0.15)
```

## Responsive Breakpoints

```
Desktop: 1024px+
- 2-column layout
- Full sidebar

Tablet: 768px - 1023px
- Single column
- Sidebar below content

Mobile: 480px - 767px
- Single column
- Compact layout

Small Mobile: <480px
- Minimal layout
- Touch-friendly
```

## Icon Usage

```
📅 - Dates, Duration, Calendar
💰 - Budget, Price, Money
👥 - Group, People, Travelers
🎯 - Activities, Category, Goals
🏨 - Accommodation, Hotel
✈️ - Transportation, Flight
📋 - Requirements, Checklist
🌤️ - Weather, Climate
📍 - Location, Destination
✓ - Included, Checkmark
⭐ - Featured, Rating
```

## Animation & Transitions

```
Smooth Transitions:
- Duration: 0.3s
- Timing: ease
- Properties: all

Hover Effects:
- Transform: translateY(-2px)
- Box-shadow: increase
- Duration: 0.3s

Image Transitions:
- Fade effect
- Duration: 0.3s
- Smooth opacity change
```

## Mobile Adaptations

### Header
```
Desktop: Flex row with space-between
Mobile: Flex column with gap
```

### Grid Layouts
```
Desktop: 2-3 columns
Tablet: 2 columns
Mobile: 1 column
```

### Images
```
Desktop: 500px height
Tablet: 350px height
Mobile: 250px height
```

### Font Sizes
```
Desktop: Full sizes
Tablet: 90% of desktop
Mobile: 80% of desktop
```

## Accessibility Features

- High contrast colors (WCAG AA compliant)
- Clear focus states
- Semantic HTML
- Icon + text combinations
- Readable font sizes
- Proper heading hierarchy
- Keyboard navigation support

## Design Principles

1. **Hierarchy**: Important information is prominent
2. **Consistency**: Repeated patterns throughout
3. **Clarity**: Clear labels and descriptions
4. **Usability**: Easy to scan and navigate
5. **Aesthetics**: Professional and modern
6. **Responsiveness**: Works on all devices
7. **Accessibility**: Inclusive design
8. **Performance**: Optimized for speed
