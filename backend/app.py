import os
PORT = int(os.environ.get("PORT", 10000))


from fastapi import FastAPI

import joblib

app = FastAPI()

model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

@app.get("/")
def home():
    return {"message": "AI CyberShield Running 🚀"}

@app.post("/predict")
def predict(text: str):
    vec = vectorizer.transform([text])
    prediction = model.predict(vec)[0]
    prob = model.predict_proba(vec)[0][1]

    return {
        "prediction": "Phishing" if prediction == 1 else "Safe",
        "risk_score": round(prob * 100, 2)
    }


from utils.url_features import get_url_features

@app.post("/predict-url")
def predict_url(url: str):
    features = get_url_features(url)

    # Simple rule-based (for now)
    risk = 0

    if len(url) > 75:
        risk += 30
    if "@" in url:
        risk += 30
    if url.count('.') > 3:
        risk += 20

    return {
        "prediction": "Suspicious" if risk > 40 else "Safe",
        "risk_score": risk
    }



import shap



explainer = shap.LinearExplainer(model, vectorizer.transform(["test"]))

@app.post("/explain")
def explain(text: str):
    words = text.split()

    suspicious_keywords = [
        "bank", "verify", "click", "urgent",
        "password", "login", "account", "suspended"
    ]

    flagged = [w for w in words if w.lower() in suspicious_keywords]

    return {
        "suspicious_words": flagged
    }