from datetime import datetime, timezone

from mongoengine import DateTimeField, Document, EmailField, FloatField, ListField, StringField


class ScanRecord(Document):
    user_id = StringField(required=True)
    user_email = EmailField()
    content = StringField(required=True)
    scan_type = StringField(required=True, choices=["email", "sms", "whatsapp", "social", "url"])
    prediction = StringField(required=True, choices=["SAFE", "PHISHING"])
    risk_score = FloatField(required=True)
    confidence = FloatField(required=True)
    threat_level = StringField(required=True)
    suspicious_keywords = ListField(StringField())
    reasoning = StringField()
    timestamp = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "collection": "scan_records",
        "indexes": ["user_id", "prediction", "scan_type", "-timestamp"],
        "ordering": ["-timestamp"],
    }

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "user_email": self.user_email,
            "content": self.content,
            "scan_type": self.scan_type,
            "prediction": self.prediction,
            "risk_score": round(self.risk_score),
            "confidence": round(self.confidence),
            "threat_level": self.threat_level,
            "suspicious_keywords": self.suspicious_keywords,
            "reasoning": self.reasoning,
            "timestamp": self.timestamp.isoformat(),
        }
