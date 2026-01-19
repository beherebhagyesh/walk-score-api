# 🚶 Walk Score Dashboard

A premium **Nuxt 4** application that displays walkability, bikeability, and transit metrics for any neighborhood using the **Walk Score API**.

![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00DC82?logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📊 Current Scores: Lake Nona South, Orlando

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   🚶 Walk Score        🚴 Bike Score       🚌 Transit Score     │
│                                                                 │
│       ██░░░░░░░░           ██████░░░░          ███░░░░░░░       │
│         19/100               59/100              29/100         │
│     Car-Dependent           Bikeable        Minimal Transit     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- 🎨 **Premium Dark UI** - "Midnight & Neon" theme with glassmorphism
- 📊 **Animated Score Cards** - Numbers count up with smooth easing
- 🚌 **Nearby Connectivity** - Real-time transit routes and distance metrics
- 📍 **Location Presets** - Specific coordinates for key neighborhoods
- 🏢 **City Comparisons** - Local and State level average comparisons
- 📱 **Responsive Design** - Works on all screen sizes
- 🚀 **Nuxt 4** - Latest framework with app directory structure

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- [Walk Score API Key](https://www.walkscore.com/professional/api.php)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/walk-score-dashboard.git
cd walk-score-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API key to .env.local
# WALKSCORE_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open [http://localhost:3344](http://localhost:3344) in your browser.

---

## 🗺️ Changing the Location

### Method 1: Modify Default Location

Edit `server/api/walkscore.ts`:

```typescript
const lat = query.lat || '40.7128';    // New York City
const lon = query.lon || '-74.0060';
const address = query.address || 'New York, NY';
```

### Method 2: Query Parameters

Pass location via URL:

```
http://localhost:3344/api/walkscore?lat=34.0522&lon=-118.2437&address=Los%20Angeles,%20CA
```

### Method 3: Dynamic Location Input (Future)

See [Future Scope](#-future-scope) for planned location search feature.

### Popular Locations to Try

| City | Latitude | Longitude |
|------|----------|-----------|
| Lake Nona South, FL | 28.3722 | -81.2737 |
| River Oaks, TX | 33.1423 | -97.1176 |
| Government Hill, TX | 29.4401 | -98.4611 |
| North Hollywood, CA | 34.1896 | -118.3904 |
| Shadyside, PA | 40.4535 | -79.9323 |

---

## 📁 Project Structure

```
walk-score-dashboard/
├── app/
│   ├── app.vue              # Main application
│   ├── assets/
│   │   └── css/
│   │       └── main.css     # Global styles
│   └── components/
│       ├── ScoreCard.vue      # Individual score display
│       ├── MetricsGrid.vue    # Grid & dashboard logic
│       ├── NearbyTransit.vue  # Connectivity section
│       └── ScoreCardModal.vue # Detailed city insights
├── server/
│   └── api/
│       ├── walkscore.ts     # Walk/Bike score API
│       └── transit-stops.ts # Transit search API
├── nuxt.config.ts           # Nuxt configuration
├── .env.local               # API key (not committed)
└── .env.example             # Example environment file
```

---

## 🎨 Understanding the Scores

### Walk Score Scale

```
90-100  ████████████████████  Walker's Paradise
70-89   ████████████████░░░░  Very Walkable
50-69   ██████████░░░░░░░░░░  Somewhat Walkable
25-49   █████░░░░░░░░░░░░░░░  Car-Dependent
0-24    ██░░░░░░░░░░░░░░░░░░  Almost All Errands Require a Car
```

### Bike Score Scale

```
90-100  ████████████████████  Biker's Paradise
70-89   ████████████████░░░░  Very Bikeable
50-69   ██████████░░░░░░░░░░  Bikeable
0-49    █████░░░░░░░░░░░░░░░  Minimal Bike Infrastructure
```

### Transit Score Scale

```
90-100  ████████████████████  Excellent Transit
70-89   ████████████████░░░░  Excellent Transit
50-69   ██████████░░░░░░░░░░  Good Transit
25-49   █████░░░░░░░░░░░░░░░  Some Transit
0-24    ██░░░░░░░░░░░░░░░░░░  Minimal Transit
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WALKSCORE_API_KEY` | Your Walk Score API key | Yes |
| `NUXT_WALKSCORE_API_KEY` | Alternative format | Yes* |

*Either format works with the included dotenv configuration.

### Nuxt Config Options

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devServer: {
    port: 3344  // Change development port
  },
  runtimeConfig: {
    walkscoreApiKey: process.env.WALKSCORE_API_KEY
  }
})
```

---

## 🔮 Future Scope

### Planned Features

- [ ] **Location Search** - Search bar with autocomplete
- [ ] **Multiple Locations** - Compare neighborhoods side-by-side
- [ ] **Historical Data** - Track score changes over time
- [ ] **Map Integration** - Interactive map with amenity markers
- [ ] **PDF Export** - Generate reports for real estate

### API Enhancements

- [ ] **Caching** - Redis cache for API responses
- [ ] **Rate Limiting** - Protect API quota
- [ ] **Batch Requests** - Multiple locations in one call

### UI Improvements

- [ ] **Dark/Light Mode** - Theme toggle
- [ ] **Custom Themes** - User-defined color schemes
- [ ] **Accessibility** - WCAG 2.1 AA compliance
- [ ] **PWA Support** - Installable as mobile app

### Data Visualization

- [ ] **Trend Charts** - D3.js or Chart.js integration
- [ ] **Heatmaps** - Neighborhood walkability visualization
- [ ] **Comparisons** - City vs city analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Walk Score](https://www.walkscore.com/) - API provider
- [Nuxt](https://nuxt.com/) - Vue framework
- [Iconify](https://iconify.design/) - Icon library

---

## 📬 Contact

For questions or feedback, please open an issue on GitHub.

---

<p align="center">
  Made with ❤️ using Nuxt 4
</p>
