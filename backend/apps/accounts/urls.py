from django.urls import path

from .views import ForgotPasswordView, LoginView, RegisterView, UsersView, VerifyEmailView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("auth/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("users/", UsersView.as_view(), name="users"),
]
