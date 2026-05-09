import streamlit as st
import joblib

# Load model and vectorizer
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

st.set_page_config(
    page_title="AI Medical Misinformation Detector",
    layout="centered"
)

st.title("🩺 AI Medical Misinformation Detector")

text = st.text_area(
    "Enter Medical Claim"
)

if st.button("Analyze"):

    if text.strip() == "":
        st.warning("Please enter text")
    else:

        # Vectorize
        text_vector = vectorizer.transform([text])

        # Prediction
        prediction = model.predict(text_vector)[0]

        # Confidence
        confidence = model.predict_proba(text_vector).max()

        confidence_percent = round(float(confidence) * 100, 2)

        # Result
        result = "Real" if prediction == 1 else "Fake"

        # Risk
        if confidence_percent > 85:
            risk = "High"
        elif confidence_percent > 60:
            risk = "Medium"
        else:
            risk = "Low"

        st.success(f"Prediction: {result}")

        st.info(f"Confidence: {confidence_percent}%")

        st.warning(f"Risk Level: {risk}")