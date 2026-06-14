from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class ThreatApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="analyst@example.com",
            email="analyst@example.com",
            password="CyberShield123!",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_predict_flags_phishing_language(self):
        response = self.client.post(
            "/api/v1/predict/",
            {
                "scan_type": "email",
                "content": "Urgent verify your account. Click here to login immediately with your password.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["prediction"], "PHISHING")
        self.assertGreaterEqual(response.data["risk_score"], 55)

    def test_predict_rejects_script_markup(self):
        response = self.client.post(
            "/api/v1/predict/",
            {"scan_type": "sms", "content": "<script>alert(1)</script>"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
