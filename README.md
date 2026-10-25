# Tap Log

Log a moment with one tap. A mobile-first React PWA that stores logs in IndexedDB and works offline.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ (service worker + offline enabled)
```

To try it on a phone on the same Wi-Fi: `npm run dev -- --host`, then open the printed Network URL.
