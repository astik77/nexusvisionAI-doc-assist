# NexusVision AI 👁️✨

<div align="center">
  <p>A full-stack, AI-powered document intelligence application built with React, FastAPI, and Google Gemini Vision.</p>
</div>

## 🚀 Overview

NexusVision AI allows users to upload any document (PDFs, Images, or Text files) and instantly converse with it. The application leverages Google's state-of-the-art Gemini 2.5 Flash model to extract context, analyze structure, and answer user queries with high accuracy based solely on the provided document.

### ✨ Features
* **Multi-Format Support**: Upload `.pdf`, `.png`, `.jpg`, `.jpeg`, and `.txt` files easily.
* **Instant Text Extraction**: Uses Vision AI to seamlessly pull text and structure from raw images or PDFs.
* **Intelligent Document Chat**: Ask complex questions about the document and get contextual, accurate answers driven by Gemini AI.
* **Premium UI/UX**: Features a highly interactive, modern web design utilizing Glassmorphism, Tailwind CSS, and smooth animations.
* **Serverless Ready**: Built as a monolithic repo designed for zero-config deployment on Vercel.

## 🛠️ Tech Stack
* **Frontend:** React + Vite, TailwindCSS v3, Lucide Icons, Axios.
* **Backend:** Python, FastAPI, Uvicorn.
* **AI Engine:** Google Gemini SDK (`google-genai`).

## 💻 Local Development

### 1. Requirements
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (3.11+)
* A Google Gemini API Key

### 2. Setup
Clone the repository and install both frontend and backend dependencies.

```bash
# Clone the repository
git clone https://github.com/astik77/nexusvisionAI-doc-assist.git
cd nexusvisionAI-doc-assist

# Install frontend dependencies
npm install

# Setup Python Virtual Environment and install backend dependencies
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r api/requirements.txt
```

### 3. Environment Variables
To get the AI working, duplicate the `.env.example` file to create a `.env` file in the root directory:

```env
# Get your Gemini API key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key_here"

# Server Settings
PORT=8000
FRONTEND_URL="http://localhost:5173"
```
Paste your actual API Key into the newly created `.env` file.

### 4. Running Locally
You will need to run two separate development servers locally.

**Terminal 1 (Backend):**
```bash
.\venv\Scripts\activate
uvicorn api.index:app --host 127.0.0.1 --port 8001 --reload
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

## 🌐 Deployment (Vercel)

This repository is uniquely structured to deploy the React frontend and FastAPI backend together as a single Vercel application utilizing Serverless Functions (`api/index.py`).

1. Push your code to GitHub.
2. Import the repository into your Vercel Dashboard.
3. Under Environment Variables in the Vercel setup, add your `GEMINI_API_KEY`.
4. Deploy! Vercel will handle the Vite build and Python serverless endpoints automatically via the included `vercel.json` config.
