# Event RSVP MERN Application

A full-stack Event RSVP web application built using the MERN stack that allows users to create events, join events with capacity enforcement, and manage their event history. The application is fully deployed and production-ready.

---

##  Live Application

- **Frontend (Vercel):**  
  https://event-rsvp-mern.vercel.app/login

- **Backend (Render):**  
  https://event-rsvp-backend-f4rb.onrender.com

##  Tech Stack

- **Frontend:** React.js, Axios, JWT
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Vercel (Frontend), Render (Backend)
- 
##  Features
- User registration and login with JWT authentication
- Create events with date, location, capacity, and image
- Join and leave events using unique event IDs
- Strict RSVP capacity enforcement
- Prevention of duplicate event joins
- Dashboard showing:
  - Events created by the user
  - Events joined by the user
  - All upcoming and completed events
- Event auto-completion after start time
- Only event creators can edit or delete their events
- Fully responsive UI (mobile, tablet, desktop)

##  RSVP Capacity & Concurrency Handling

- RSVP capacity is enforced at the backend using database checks
- Duplicate joins are prevented by validating user attendance before insertion
- Join operations are safely handled to avoid overbooking
- Authentication middleware ensures only authorized access to protected routes

---

## ▶️ Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
