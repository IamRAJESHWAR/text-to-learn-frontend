# Text-to-Learn

An AI-powered learning platform that generates courses and exams from text.

## Project Structure

This project is organized as a monorepo:

- **[client/](./client)**: The React-based frontend application built with Vite.
- **[server/](./server)**: The Node.js/Express backend API providing AI services and database management.

## Getting Started

### Frontend (Client)
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend (Server)
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Configure your `.env` file (see `server/config/.env.example` if available).
4. Start the server: `npm start` or `npm run dev`

## Deployment

- **Frontend**: Deployed on Vercel (set root directory to `client`).
- **Backend**: Deployed on your preferred Node.js hosting (e.g., Render, Railway).

---
Built for the AZ Dev Hackathon.
