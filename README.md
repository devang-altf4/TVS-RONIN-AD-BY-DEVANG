# TVS Ronin — Scrollytelling Landing Page

A premium, cinematic scrollytelling experience for the TVS Ronin motorcycle — built with React, Vite, Framer Motion, and Tailwind CSS.

## ✨ Features

- **Scroll-Linked Canvas Animation** — 168-frame image sequence plays as you scroll, creating a cinematic reveal of the motorcycle
- **Framer Motion Text Overlays** — Four animated text beats with icons appear at different scroll positions
- **Premium Typography** — Montserrat for headings, Inter for body text
- **Scroll Indicator** — Animated mouse icon guides users to scroll, disappears after first interaction
- **Pricing Section** — Three Ronin variants with features and pricing
- **Booking Section** — Call-to-action with Book Now and Test Ride options
- **Responsive Design** — Optimized for all screen sizes
- **High-DPI Support** — Sharp canvas rendering on Retina displays

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| TypeScript | Type Safety |
| Framer Motion | Scroll Animations |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
ronin-app/
├── public/
│   └── sequence/          # 168 JPG frames for scroll animation
├── src/
│   ├── components/
│   │   ├── RoninExperience.tsx  # Main scrollytelling canvas
│   │   ├── PricingSection.tsx   # Variant pricing cards
│   │   ├── BookingSection.tsx   # CTA section
│   │   └── Footer.tsx           # Site footer
│   ├── App.tsx            # Root layout
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── tailwind.config.js     # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

## 🌐 Deployment

This project is configured for deployment on **Vercel**. Simply connect your GitHub repository to Vercel and it will auto-detect the Vite framework.

## 📄 License

Built for demonstration purposes. TVS Ronin is a trademark of TVS Motor Company.
