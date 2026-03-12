# Capstone Project

This repository contains a full-stack fitness tracking application with separate `client` (React) and `server` (Node/Express) directories.

## 📁 File Structure

```
package.json
render.yaml          # Render deployment configuration
client/              # Frontend application (React + Vite)
  ├─ eslint.config.js
  ├─ index.html
  ├─ package.json
  ├─ README.md
  ├─ tailwind.config.js
  ├─ vite.config.js
  ├─ public/         # static assets
  └─ src/            # React source code
      ├─ App.css
      ├─ App.jsx
      ├─ index.css
      ├─ main.jsx
      ├─ assets/
      ├─ components/
      │   └─ Navbar.jsx
      ├─ pages/      # route views
      │   ├─ Analytics.jsx
      │   ├─ Dashboard.jsx
      │   ├─ Goals.jsx
      │   ├─ LandingPage.jsx
      │   ├─ NutritionTracker.jsx
      │   ├─ Profile.jsx
      │   ├─ WorkoutLog.jsx
      │   ├─ Analytics/
      │   └─ Auth/
      │       ├─ Login.jsx
      │       └─ Register.jsx
      ├─ services/
      │   └─ api.js
      └─ utils/

server/              # Backend application (Express + MongoDB)
  ├─ package.json
  ├─ server.js       # entry point
  ├─ middlewares/
  │   └─ auth.js
  ├─ models/         # Mongoose models
  │   ├─ Nutrition.js
  │   ├─ User.js
  │   ├─ Water.js
  │   ├─ Weight.js
  │   └─ Workout.js
  └─ routes/         # API routes
      ├─ auth.js
      ├─ goals.js
      ├─ nutrition.js
      ├─ water.js
      ├─ weight.js
      └─ workouts.js

.env                 # environment variables (not checked into git)
render.yaml          # Render service configuration
```

## 🚀 Deployment on Render

### 1. Services
You'll need two Render services:

- **Web Service** for the backend (`server/`) - Node.js environment
- **Static Site** (or another Web Service) for the frontend (`client/`) built with Vite

### 2. Environment Variables
Set the following variables in the Render dashboard for each service:

```
# Backend service
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
BACKEND_URL=https://<backend-service-url>

# Frontend service
VITE_BACKEND_URL=https://<backend-service-url>     # used in client/services/api.js
```

> Note: In `.env` we use `FRONTEND_URL` and `BACKEND_URL` for local dev. Render uses service URLs.

### 3. Build & Start Commands

- **Server:**
  - Build: none (plain Node.js)
  - Start: `node server.js` or use `npm start` (configured in `server/package.json`)

- **Client:**
  - Build: `npm run build` (from `client` directory)
  - Start: serve static `dist` folder (Render static site automatically handles this)

### 4. render.yaml
The provided `render.yaml` already configures the two services:

```yaml
services:
  - type: web
    name: capstone-server
    env: node
    plan: free
    region: oregon
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
  - type: static
    name: capstone-client
    env: node
    plan: free
    region: oregon
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
```

_Adjust paths or names as needed._

### 5. Local Development

1. Copy `.env` from `.env.example` (if exists) and fill values.
2. Run backend: `cd server && npm install && npm run dev` (if using nodemon) or `npm start`.
3. Run frontend: `cd client && npm install && npm run dev`.
4. The frontend uses `VITE_BACKEND_URL` or `REACT_APP_BACKEND_URL` to contact the API.

### 6. Additional Notes

- Make sure `render.yaml` is committed; Render's GitHub integration picks it up automatically.
- Use MongoDB Atlas or another hosted database and put the URI in the Render environment.
- Keep secrets out of version control; use Render secrets in the dashboard.

---

Feel free to modify the README further with project-specific instructions, tests, or contribution guidelines.