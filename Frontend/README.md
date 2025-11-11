# FileMyRTI Frontend

React + Vite + Tailwind frontend application for state-specific RTI filing pages.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   └── state/        # State-specific components
│   ├── data/            # State data configuration
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── assets/          # Static assets
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## 🌐 State Pages

Currently supports:
- **Telangana**: `/state/telangana` or `telangana.filemyrti.com`

## 🎨 Customization

- Colors: Edit `tailwind.config.js` to change the primary color scheme
- Content: All state-specific content is in `src/data/states.ts`
- Components: Modify components in `src/components/` to change layout/styling

## 📝 Adding New States

Edit `src/data/states.ts` and add a new state object following the `StateData` interface.

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Helmet Async** - SEO

## 📄 License

Copyright © FileMyRTI

