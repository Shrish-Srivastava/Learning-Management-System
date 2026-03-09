SkillUp is a React + Node.js learning platform with:
- student and admin roles
- professional course catalog UI
- YouTube-based lesson delivery
- first lesson free preview
- demo paid unlock flow at `Rs. 999`
- progress tracking and sequential lesson locking
- admin management for courses, sections, and lessons
- `SkillUp AI` chatbot for course guidance and admin help
## Project Structure
- `Frontend/` - React + Vite app
- `Backend/` - Express + Prisma API
## Local Setup
### 1. Backend
```bash
cd Backend
npm install
npx prisma db push
npm run seed
npm run dev
 - Backend runs on http://localhost:4000.

2. Frontend
cd Frontend
npm install
npm run dev
 - Frontend runs on http://localhost:5173.

Environment Files
Real env values are stored locally in:
 - Backend/.env
 - Frontend/.env
Git-safe templates are provided in:
 - Backend/.env.example
 - Frontend/.env.example
Seeded Admin Login
 - Email: admin@skillup.com
 - Password: *********
 - You can change these later in Backend/.env and re-seed if needed.

SkillUp AI
 - SkillUp also includes an in-app AI assistant for logged-in users.

 - available from the floating chat button
 - helps students choose courses
 - suggests next learning steps
 - explains course flow and platform usage
 - helps admins understand the admin workspace
The chatbot is powered through the backend using Groq.

Notes
 - The backend currently uses your Aiven lms_db database.
 - For local development, the Prisma MySQL URL uses sslaccept=accept_invalid_certs to avoid Windows TLS trust issues.
 - Before final production deployment, rotate the exposed Aiven DB password and update Backend/.env plus your hosting env vars.
