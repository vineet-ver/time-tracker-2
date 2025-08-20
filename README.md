Time Tracker App (Next.js + MongoDB)

Getting Started

1. Create `.env.local` in project root with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_at_least_32_chars
```
2. Install and run:
```
npm install
npm run dev
```
3. Visit http://localhost:3000

Key Features
- Auth (Register/Login) with JWT cookie
- Projects, Tasks, Time Entries
- Dashboard and basic Reports

Notes
- Prototype quality; no RBAC beyond basic login.
- Next.js App Router, Tailwind, Mongoose.
- If your MongoDB password contains special characters (like #, &), either percent-encode them (e.g. # becomes %23) or put the URI in quotes.
