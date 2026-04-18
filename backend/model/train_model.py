import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Correct path
data_path = os.path.abspath("../../data/phishing_emails.csv")

print("Loading data from:", data_path)

df = pd.read_csv(data_path)

print("Dataset loaded successfully!")
print(df.head())

X = df['text']
y = df['label']

vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

model = LogisticRegression()
model.fit(X_vec, y)

# Save properly
joblib.dump(model, "model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Model saved successfully!")