# Solutions Medical Providers

Standalone frontend starter for the Solutions Medical Providers Mobile NP Dashboard.

## Project Structure

- `index.html` is the static dashboard entry point.
- `styles.css` contains the dark neon dashboard styling.
- `data.js` centralizes all mock dashboard data for a future Tebra integration.
- `app.js` renders KPIs, charts, provider bars, missed visits, revenue opportunity, insights, and alerts from `data.js`.

## Run

Open `index.html` in a browser, or serve the folder with any static file server.

```bash
python -m http.server 5173
```

Then visit `http://localhost:5173`.
