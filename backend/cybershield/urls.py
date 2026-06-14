from django.contrib import admin
from django.urls import include, path
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from django.http import HttpResponse


def metrics(_request):
    return HttpResponse(generate_latest(), content_type=CONTENT_TYPE_LATEST)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("metrics/", metrics),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.threats.urls")),
]
