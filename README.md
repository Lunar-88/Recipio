
# Recipio 🍳

A full-stack recipe sharing app where users can create, upload, and manage recipes with ingredients, instructions, and images.  

---

## 🚀 Features
- Create recipes with **title, description, prep time, cook time, servings**
- Upload and store recipe images via **Cloudinary**
- Add unlimited **ingredients** and **instruction steps**
- Like recipes ❤️
- Delete recipes 🗑️
- Responsive **React frontend** + **Flask backend**

---

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS, Vite, Vercel (deployment)
- **Backend:** Flask, SQLAlchemy, Render (deployment)
- **Database:** PostgreSQL
- **Media Storage:** Cloudinary

---

## 📂 Project Structure
Recipio/
├── Backend/ # Flask API (deployed on Render)
│ ├── app.py
│ ├── models.py
│ └── routes/
├── Frontend/ # React app (deployed on Vercel)
│ ├── src/
│ │ ├── Pages/
│ │ ├── Components/
│ │ └── App.jsx
│ └── package.json
└── README.md

yaml
Copy code

---

## ⚡ Getting Started (Local Dev)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/recipio.git
cd recipio
2. Backend (Flask)
bash
Copy code
cd Backend
pip install -r requirements.txt
flask run --port=5000
3. Frontend (React + Vite)
bash
Copy code
cd Frontend
npm install
npm run dev
Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000

🌍 Deployment
Frontend: Vercel → https://recipio-alpha.vercel.app

Backend: Render → https://recipio.onrender.com

🔑 API Endpoints
Media
POST /api/media/upload → upload an image

DELETE /api/media/:id → delete image by Cloudinary ID

Recipes
POST /api/recipes → create recipe

GET /api/recipes → list all recipes

DELETE /api/recipes/:id → delete recipe

POST /api/recipes/:id/like → like a recipe


👨‍💻 Author
Developed by Felix, Debra, Clinton, Mary ✨
Deployed on Vercel + Render