from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

# Database imports
from database import SessionLocal
from models import PredictionHistory

# Load trained model and vectorizer
model = joblib.load("../model.pkl")
vectorizer = joblib.load("../vectorizer.pkl")

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class NewsRequest(BaseModel):
    text: str

# Home route
@app.get("/")
def home():
    return {
        "message": "AI Medical Misinformation Detection API Running"
    }

# Prediction endpoint
@app.post("/predict")
def predict(news: NewsRequest):

    # Convert text into vector
    text_vector = vectorizer.transform([news.text])

    # Predict fake or real
    prediction = model.predict(text_vector)[0]

    # Confidence score
    confidence = model.predict_proba(text_vector).max()

    # Convert confidence to percentage
    confidence_percent = round(float(confidence) * 100, 2)

    # Convert prediction label
    result = "Real" if prediction == 1 else "Fake"

    # Risk level calculation
    if confidence_percent > 85:
        risk = "High"
    elif confidence_percent > 60:
        risk = "Medium"
    else:
        risk = "Low"

    # Save prediction to database
    db = SessionLocal()

    history = PredictionHistory(
        text=news.text,
        prediction=result,
        confidence=confidence_percent,
        risk_level=risk
    )

    db.add(history)
    db.commit()
    db.close()

    # Return response
    return {
        "prediction": result,
        "confidence": confidence_percent,
        "risk_level": risk
    }


# History endpoint
@app.get("/history")
def get_history():

    db = SessionLocal()

    history = db.query(PredictionHistory).all()

    db.close()

    return history