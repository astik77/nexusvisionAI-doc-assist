import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="NexusVision AI", version="1.0.0")

# Setup CORS to allow requests from the React frontend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    print("WARNING: GEMINI_API_KEY is not set or is using the placeholder.")
    client = None
else:
    client = genai.Client(api_key=api_key)

class ChatRequest(BaseModel):
    message: str
    document_context: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "NexusVision AI Backend is running"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured correctly.")
        
    try:
        # Read the file content
        contents = await file.read()
        
        # Determine mime type
        mime_type = file.content_type
        if not mime_type or mime_type == "application/octet-stream":
            if file.filename.endswith(".pdf"):
                mime_type = "application/pdf"
            elif file.filename.endswith((".png", ".jpg", ".jpeg")):
                mime_type = f"image/{file.filename.split('.')[-1]}"
            elif file.filename.endswith(".txt"):
                mime_type = "text/plain"
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")

        # Basic validation for now, sending the content directly as inline data
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(data=contents, mime_type=mime_type),
                "Analyze this document. Extract the main text and summarize its structure. Return a detailed textual representation that can be used as context for answering questions later."
            ]
        )
        
        return {"filename": file.filename, "extracted_context": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured correctly.")
        
    try:
        prompt = f"""
        You are an AI assistant helping a user with a document.
        
        Document Context:
        {request.document_context}
        
        User Question:
        {request.message}
        
        Based ONLY on the provided Document Context, answer the user's question accurately and concisely.
        If the answer is not contained in the context, politely state that you cannot find the answer in the document.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
