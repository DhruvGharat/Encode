# CogniFusion – Full Setup Guide

## Prerequisites (install these first)

| Tool    | Version     | Download            |
| ------- | ----------- | ------------------- |
| Node.js | 18 +        | https://nodejs.org  |
| Python  | 3.10 – 3.13 | https://python.org  |
| Git     | any         | https://git-scm.com |

---

## 1 – Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

---

## 2 – Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NODE_ENV=development
```

> Get `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project → Settings → API.

---

## 3 – Python / Speech model setup

```bash
cd backend/Speech_model
pip install -r requirements.txt
```

Make sure these 3 model files are present in `backend/Speech_model/`:

```
scaler.pkl
pca.pkl
dementia_model.pkl
```

They are **not committed to Git** (large binary files). Copy them from your original machine or re-download them from Google Colab after retraining. See `backend/Speech_model/INTEGRATE.md` for details.

---

## 4 – Frontend setup

```bash
cd frontend
npm install
```

---

## 5 – Run the project

Open **two terminals**:

**Terminal 1 – Backend**

```bash
cd backend
node server.js
```

Runs on `http://localhost:5000`

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:5173`

Open your browser at **http://localhost:5173**.

---

## Folder structure (quick reference)

```
Encode/
├── backend/
│   ├── .env              ← you create this (not in Git)
│   ├── server.js
│   ├── Speech_model/
│   │   ├── inference.py
│   │   ├── requirements.txt
│   │   ├── train_model.ipynb   ← Colab notebook to retrain
│   │   ├── scaler.pkl          ← not in Git, copy manually
│   │   ├── pca.pkl             ← not in Git, copy manually
│   │   └── dementia_model.pkl  ← not in Git, copy manually
│   └── ...
└── frontend/
    └── src/
        └── ...
```

---

## Common issues

| Problem                         | Fix                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `Cannot find module` on backend | Run `npm install` inside `backend/`                                                    |
| `SUPABASE_URL not set` error    | Check your `backend/.env` file exists                                                  |
| Speech test returns error       | Make sure `scaler.pkl`, `pca.pkl`, `dementia_model.pkl` are in `backend/Speech_model/` |
| Python packages missing         | Run `pip install -r backend/Speech_model/requirements.txt`                             |
| Port 5000 already in use        | Change `PORT=5001` in `.env`                                                           |
