# YouTube Clone MERN Project

[![GitHub Repo](https://img.shields.io/badge/GitHub-Kunal--2001--12-blue?logo=github)](https://github.com/Kunal-2001-12)

> **Demo:** _Add your live deployment link here if available._

> **Author:** [Kunal Sur](https://github.com/Kunal-2001-12)

---

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone the Repository](#2-clone-the-repository)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Environment Variables](#4-environment-variables)
  - [5. Running the Project](#5-running-the-project)
  - [6. Troubleshooting](#6-troubleshooting)
- [Usage](#usage)
- [Project Details](#project-details)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User registration and login (JWT authentication)
- Upload, view, and manage videos
- Create and manage channels
- Like, comment, and share videos
- Create, edit, and manage playlists
- YouTube Studio for channel/content management
- Watch later, subscriptions, and library features
- Trending videos and search functionality
- Password reset via email
- Responsive design for desktop and mobile
- Modern UI with React, MUI, and custom CSS
- **Robust fallback:** Dummy video always shown if backend is down

---

## Screenshots

> **All screenshots are now organized in the `frontend/src/img/favorites/` folder.**
> Paste your screenshot images in that folder and update the links below as needed.

| Feature/Page         | Screenshot                                                   |
|---------------------|-------------------------------------------------------------|
| Home                | ![Home](frontend/src/img/favorites/Home%20YouTube.png)       |
| Trending            | ![Trending](frontend/src/img/favorites/Trending.png)         |
| Channel             | ![Channel](frontend/src/img/favorites/Channel.png)           |
| Video Player        | ![Video Player](frontend/src/img/favorites/Video%20Player.png)  |
| Studio Dashboard    | ![Studio](frontend/src/img/favorites/Studio%20Dashboard.png)    |
| Channel Content     | ![Channel Content](frontend/src/img/favorites/Channel%20content.png) |
| Successful Login    | ![Successful Login](frontend/src/img/favorites/Successful%20Login.png) |


---

## Output Screenshots

> **Add your output/result screenshots in the `frontend/src/img/favorites/` folder and reference them here.**

| Output/Result Description | Screenshot                                                   |
|--------------------------|-------------------------------------------------------------|
| Successful Login         | ![Login Output](frontend/src/img/favorites/LoginOutput.png)  |
| Video Upload Success     | ![Upload Output](frontend/src/img/favorites/UploadOutput.png) |
| Playlist Created         | ![Playlist Output](frontend/src/img/favorites/PlaylistOutput.png) |
| Comment Posted           | ![Comment Output](frontend/src/img/favorites/CommentOutput.png) |
| Like/Dislike Action      | ![Like Output](frontend/src/img/favorites/LikeOutput.png)    |
| Watch Later Added        | ![WatchLater Output](frontend/src/img/favorites/WatchLaterOutput.png) |
| Password Reset Email     | ![Reset Output](frontend/src/img/favorites/ResetOutput.png)  |
| Error/404 Page           | ![404 Output](frontend/src/img/favorites/404Output.png)      |

> Paste your output screenshots in the `frontend/src/img/favorites/` folder and update the links above as needed.

---

## Project Structure
```
YouTube-clone-MERN-main/
  backend/      # Node.js + Express API
  frontend/     # React.js client
  README.md     # Project documentation
  docker-compose.yml
```

---

## Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)

### 2. Clone the Repository
```powershell
# Clone the repo and enter the main folder
cd "C:\Users\kunal\OneDrive\Desktop\YouTube-clone-MERN-main (1)\YouTube-clone-MERN-main"
```

### 3. Install Dependencies
#### Backend
```powershell
cd backend
npm install
```
#### Frontend
```powershell
cd ../frontend
npm install
```

### 4. Environment Variables
#### Backend (`backend/.env`)
```
MONGO_URI=mongodb://localhost:27017/youtube-clone
SECRET_KEY=F8d7A2b1C3e4G5h6I7j8K9l0M1n2O3p4
EMAIL=kunalsur2001@gmail.com
PASSWORD=elig zavm iglw wckz
BACKEND_URL=http://localhost:4000
```
#### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:4000
```

### 5. Running the Project
#### Start Backend
```powershell
cd backend
npm start
```
- The backend will run on [http://localhost:4000](http://localhost:4000)

#### Start Frontend
Open a new terminal:
```powershell
cd frontend
npm run dev
```
- The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port)

### 6. Troubleshooting
- **"Failed to fetch" or CORS errors:** Ensure both servers are running and ports match your .env files.
- **Port already in use:** Kill the process using the port (see below).
- **How to kill a process on port 4000 (PowerShell):**
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force
  ```
- **Always restart servers after changing .env files.**
- **No node_modules in repo:** Do not upload `node_modules` or `package-lock.json` to GitHub.
- **Dummy video fallback:** If backend is down, a demo video will always show on the home page.

---

## Usage
- Register a new account or log in.
- Create your channel and upload videos.
- Browse, search, and filter videos on the home page.
- Watch videos, like/dislike, and comment.
- Manage your playlists, subscriptions, and watch later list.
- Use the Studio dashboard to manage your content and channel.

---

## Project Details
### Frontend (React)
- Home page with header, sidebar, video grid, and filters.
- User authentication (register, login, JWT, protected routes).
- Video player page with comments, like/dislike, and channel info.
- Channel page for managing videos and channel details.
- Search and filter functionality.
- Responsive design for all devices.
- **No hardcoded API URLs:** All API calls use `backendURL` from `src/config.js`.
- **Error-free run:** All warnings and errors are resolved for a clean experience.

### Backend (Node.js, Express)
- RESTful API for users, videos, channels, comments, likes, playlists.
- JWT authentication and protected routes.
- MongoDB for storing users, videos, channels, comments, and metadata.
- Nodemailer for password reset and registration emails.
- CORS enabled for frontend port.

---

## API Endpoints (Major)
- `POST /signup` — Register
- `POST /login` — Login
- `GET /logout` — Logout
- `GET /userdata` — Get user info (requires cookies)
- `POST /resetlink` — Password reset email
- `POST /publish` — Upload video
- `GET /getvideos` — Get all videos
- `GET /videodata/:id` — Get video by ID
- `POST /comments/:id` — Add comment
- `POST /like/:id/:email/:email2` — Like video
- `POST /watchlater/:id/:email/:email2` — Add to watch later
- `GET /gettrending` — Trending videos
- `GET /search/:data` — Search videos
- ...and many more (see backend/Router/*.js)

---

## Technologies Used
- **MongoDB**: Database for user, video, and channel data
- **Express.js**: Backend API server
- **React.js**: Frontend SPA
- **Node.js**: Server runtime
- **Firebase Storage**: Video and file storage
- **JWT**: Authentication
- **Nodemailer**: Email for registration and password reset
- **MUI & React Icons**: UI components and icons
- **Docker**: Containerized deployment

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
This project is for educational purposes only.
