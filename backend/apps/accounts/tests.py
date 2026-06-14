from django.test import TestCase
from rest_framework.test import APIClient


class AuthApiTests(TestCase):
    def test_register_returns_jwt_tokens(self):
        response = APIClient().post(
            "/api/v1/auth/register/",
            {"name": "Demo Analyst", "email": "demo@example.com", "password": "CyberShield123!"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data["tokens"])
