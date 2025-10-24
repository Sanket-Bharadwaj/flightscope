<div align="center">
  
  # ✈️ FlightScope
  
  ### Real-Time Global Flight Tracking
  
  *Track aircraft around the world in real-time with an elegant, interactive map interface*
  
  [![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
  [Live Demo](https://flightscope.vercel.app) · [Report Bug](https://github.com/Sanket-Bharadwaj/flightscope/issues) · [Request Feature](https://github.com/Sanket-Bharadwaj/flightscope/issues)

   

</div>

<img width="1926" height="1079" alt="Screenshot 2025-10-24 at 8 17 15 PM" src="https://github.com/user-attachments/assets/f0474bf6-58c8-4654-9c42-fabe7a6b1cdc" />


---

## 🌟 Features

<table>
  <tr>
    <td width="50%">
      <h3>🗺️ Interactive Mapping</h3>
      <p>Powered by Leaflet with smooth panning, zooming, and real-time updates</p>
    </td>
    <td width="50%">
      <h3>✈️ Live Tracking</h3>
      <p>Real-time aircraft positions updated every 15 seconds from OpenSky Network</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔍 Smart Search</h3>
      <p>Instantly find flights by callsign or ICAO24 code with live filtering</p>
    </td>
    <td>
      <h3>📊 Rich Details</h3>
      <p>View altitude, speed, heading, departure/arrival airports, and more</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎨 Beautiful UI</h3>
      <p>Glass-morphism design with dark/light mode and responsive layout</p>
    </td>
    <td>
      <h3>📍 Geolocation</h3>
      <p>See your current position with an animated blue marker</p>
    </td>
  </tr>
</table>

### Additional Features
- ⚡ **Performance Optimized** - Smart clustering for handling hundreds of flights
- 🎯 **Interactive Markers** - Click planes for detailed popups with smooth animations
- 🔗 **Social Sharing** - Share individual flights with desktop clipboard or mobile share sheet
- 🌐 **No API Keys Required** - Uses public OpenSky Network data
- 📱 **Mobile Responsive** - Touch-optimized controls and gestures
- ♿ **Accessible** - Keyboard navigation and screen reader support

<img width="7100" height="4808" alt="diagram" src="https://github.com/user-attachments/assets/a983f7cb-05f3-4923-8314-e071c2a12eb7" />


---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flightscope.git
cd flightscope

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
      <br>Vercel
    </td>
  </tr>
</table>

### Core Technologies

- **[Next.js 13.5](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Leaflet](https://leafletjs.com/)** - Interactive maps
- **[React Leaflet](https://react-leaflet.js.org/)** - React bindings for Leaflet
- **[SWR](https://swr.vercel.app/)** - React Hooks for data fetching
- **[OpenSky Network API](https://opensky-network.org/)** - Real-time flight data
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Perfect dark mode

---

## 📁 Project Structure

```
flightscope/
├── 📂 app/
│   ├── 📂 api/
│   │   └── 📂 aircraft/
│   │       ├── route.ts                    # Main aircraft data endpoint
│   │       └── 📂 [icao24]/
│   │           └── route.ts                # Individual flight route info
│   ├── globals.css                         # Global styles & theme
│   ├── layout.tsx                          # Root layout with providers
│   └── page.tsx                            # Home page
│
├── 📂 components/
│   ├── control-card.tsx                    # Control panel UI
│   ├── flight-marker.tsx                   # Aircraft markers with popups
│   ├── header.tsx                          # Top navigation bar
│   ├── map-component.tsx                   # Main map with data fetching
│   ├── map-wrapper.tsx                     # Map container & overlays
│   ├── theme-provider.tsx                  # Theme context provider
│   ├── theme-toggle.tsx                    # Dark/light mode toggle
│   ├── user-location.tsx                   # User position marker
│   └── 📂 ui/                              # shadcn/ui components
│
├── 📂 lib/
│   ├── types.ts                            # TypeScript interfaces
│   └── utils.ts                            # Utility functions
│
├── 📂 types/
│   └── react-leaflet-cluster.d.ts          # Type declarations
│
├── 📄 next.config.js                       # Next.js configuration
├── 📄 tailwind.config.ts                   # Tailwind configuration
├── 📄 tsconfig.json                        # TypeScript configuration
└── 📄 package.json                         # Dependencies & scripts
```

---

## ⚙️ Configuration

### Refresh Interval

Adjust the data refresh rate in the control panel:

- **Default:** 15 seconds
- **Recommended:** 15-20 seconds (avoids API rate limits)
- **Range:** 1-60 seconds

### Clustering

Toggle aircraft clustering for better performance:

- **Enabled:** Groups nearby aircraft (better for zoomed-out views)
- **Disabled:** Shows all individual aircraft (better for zoomed-in views)

### API Rate Limits

OpenSky Network limits for **anonymous users**:
- ~10-15 requests per minute
- 400 requests per day

**Tips to avoid rate limiting:**
- Use 15+ second refresh intervals
- Consider creating a free [OpenSky account](https://opensky-network.org/login) for higher limits

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/flightscope)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Click Deploy (auto-detects Next.js)
4. Done! 🎉

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

✅ **None required!** The app uses the public OpenSky API with no authentication.

---

## 🎨 Screenshots

<div align="center">

### Light Mode
![Light Mode](https://via.placeholder.com/800x500/ffffff/1a1a1a?text=Light+Mode+View)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x500/1a1a1a/facc15?text=Dark+Mode+View)

### Flight Details
![Flight Details](https://via.placeholder.com/400x500/1a1a1a/facc15?text=Flight+Popup+Details)

</div>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[OpenSky Network](https://opensky-network.org/)** - Free, real-time flight data
- **[Leaflet](https://leafletjs.com/)** - Open-source mapping library
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform
- **[Next.js Team](https://nextjs.org/)** - Amazing React framework

---

## 📧 Contact

**Sanket Bharadwaj** 

Project Link: [https://github.com/yourusername/flightscope](https://github.com/yourusername/flightscope)

---

<div align="center">
  
  ### ⭐ Star this repo if you found it helpful!
  
  Made with ❤️ using Next.js
  
  [⬆ Back to Top](#-flightscope)
  
</div>
