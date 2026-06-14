import re
from dataclasses import dataclass
from functools import lru_cache
from urllib.parse import urlparse

from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


TRAINING_DATA = [
    ("urgent verify your account click here login immediately password suspended", 1),
    ("your bank account is locked confirm your credentials now", 1),
    ("claim your prize by sending otp and card details", 1),
    ("security alert unusual login click link to restore access", 1),
    ("invoice overdue wire payment to this new account today", 1),
    ("paypal account limited verify identity using the attached link", 1),
    ("congratulations you won gift card open this shortened url", 1),
    ("meeting moved to 3pm please review the agenda", 0),
    ("your package was delivered to reception", 0),
    ("monthly security report is attached for review", 0),
    ("team lunch is scheduled for friday", 0),
    ("password rotation reminder from internal it portal", 0),
    ("your flight booking confirmation is ready", 0),
    ("please approve the pull request when available", 0),
]

SUSPICIOUS_PATTERNS = {
    "Verify Account": r"\bverify (your )?(account|identity)\b",
    "Urgent": r"\burgent|immediately|right away|final notice\b",
    "Click Here": r"\bclick here|open this link|tap the link\b",
    "Login Immediately": r"\blogin immediately|sign in now|restore access\b",
    "Password": r"\bpassword|credentials|otp|one time passcode\b",
    "Account Suspended": r"\bsuspended|locked|limited|deactivated\b",
    "Payment": r"\bwire|payment|invoice|crypto|gift card\b",
    "Prize": r"\bwon|winner|prize|reward|lottery\b",
    "Shortened URL": r"\bbit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly\b",
}


def preprocess(text):
    text = text.lower()
    tokens = re.findall(r"[a-z0-9]+", text)
    return " ".join(token for token in tokens if token not in ENGLISH_STOP_WORDS)


@lru_cache(maxsize=1)
def get_pipeline():
    texts, labels = zip(*TRAINING_DATA)
    pipeline = Pipeline(
        [
            ("tfidf", TfidfVectorizer(preprocessor=preprocess, ngram_range=(1, 2), min_df=1)),
            ("model", LogisticRegression(max_iter=1000, class_weight="balanced")),
        ]
    )
    pipeline.fit(texts, labels)
    return pipeline


@dataclass
class ThreatAnalysis:
    prediction: str
    risk_score: int
    confidence: int
    threat_level: str
    suspicious_keywords: list[str]
    reasoning: str


class PhishingDetector:
    def __init__(self):
        self.pipeline = get_pipeline()

    def analyze(self, content):
        if not content or not content.strip():
            raise ValueError("Content is required.")

        model_probability = float(self.pipeline.predict_proba([content])[0][1])
        keywords = self._keywords(content)
        url_risk = self._url_risk(content)
        rule_score = min(0.98, (len(keywords) * 0.11) + url_risk)
        risk = int(round(max(model_probability, rule_score) * 100))
        prediction = "PHISHING" if risk >= 55 else "SAFE"
        confidence = int(round(70 + abs(risk - 50) * 0.55))
        confidence = max(70, min(99, confidence))
        threat_level = "HIGH" if risk >= 75 else "MEDIUM" if risk >= 45 else "LOW"
        reasoning = self._reasoning(prediction, keywords, url_risk)
        return ThreatAnalysis(prediction, risk, confidence, threat_level, keywords, reasoning)

    def _keywords(self, content):
        found = []
        for label, pattern in SUSPICIOUS_PATTERNS.items():
            if re.search(pattern, content, re.IGNORECASE):
                found.append(label)
        return found

    def _url_risk(self, content):
        urls = re.findall(r"https?://[^\s]+|www\.[^\s]+", content, flags=re.IGNORECASE)
        risk = 0
        for url in urls:
            normalized = url if url.startswith("http") else f"https://{url}"
            parsed = urlparse(normalized)
            host = parsed.netloc.lower()
            if re.search(r"\d+\.\d+\.\d+\.\d+", host):
                risk += 0.2
            if host.count("-") >= 2 or len(host) > 35:
                risk += 0.15
            if any(token in host for token in ["login", "verify", "secure", "account", "bank"]):
                risk += 0.18
        return min(risk, 0.5)

    def _reasoning(self, prediction, keywords, url_risk):
        if prediction == "SAFE" and not keywords:
            return "This content does not show strong urgency, credential-harvesting, payment diversion, or suspicious URL patterns."
        evidence = []
        if keywords:
            evidence.append("urgency language, credential requests, account-verification phrasing, or scam-oriented keywords")
        if url_risk:
            evidence.append("URL structure commonly used in phishing campaigns")
        return f"This message contains {', and '.join(evidence)} commonly found in phishing campaigns."
