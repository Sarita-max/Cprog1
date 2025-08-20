# Student Management System (Frontend UI)

Vanilla HTML/CSS/JS single-page app for a Student Management System. Includes:

- Auth: Register/Login (JWT-like token stored in localStorage), roles: Admin, Student
- Admin: Manage Students (CRUD), view all students, basic courses placeholder
- Student: Dashboard with profile and enrolled courses
- Hash-based router with simple route guards
- Toggleable mock API to run without a backend now; API layer ready for real backend later

## Quick Start

1. Open `public/index.html` in a browser, or serve the `public/` folder:

```bash
# Option A: Python
python3 -m http.server --directory public 5173

# Option B: Node (if installed)
npx http-server public -p 5173
```

Visit `http://localhost:5173`.

- Default mock users:
  - Admin: `admin@example.com` / `admin123`
  - Student: `student@example.com` / `student123`

## Backend API (Optional)

Set `USE_MOCK_API` to `false` in `public/js/api.js` to call a real backend.
Expected endpoints (JSON):

- POST `/auth/register` { email, password, name, role }
- POST `/auth/login` { email, password }
- GET `/api/users/me`
- GET `/api/students`
- POST `/api/students`
- GET `/api/students/:id`
- PUT `/api/students/:id`
- DELETE `/api/students/:id`
- GET `/api/courses`
- GET `/api/students/:id/courses`

Authorization: `Authorization: Bearer <token>`

## Structure

- `public/index.html` – shell
- `public/css/styles.css` – styling
- `public/js/` – app code
  - `app.js` – bootstraps router
  - `router.js` – hash router + guards
  - `state.js` – app state
  - `ui.js` – UI helpers
  - `auth.js` – auth logic
  - `api.js` – API layer + mock backend toggle
  - `views/*.js` – view renderers

## Deployment

Serve the `public/` directory with any static host (Vercel, Netlify, Nginx, S3, etc.). If using a backend, ensure CORS is configured and `API_BASE_URL` set accordingly in `public/js/api.js`.