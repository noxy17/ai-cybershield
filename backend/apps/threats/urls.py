from django.urls import path

from .views import AnalyticsView, ExplainView, HistoryView, PredictView

urlpatterns = [
    path("predict/", PredictView.as_view(), name="predict"),
    path("explain/", ExplainView.as_view(), name="explain"),
    path("history/", HistoryView.as_view(), name="history"),
    path("analytics/", AnalyticsView.as_view(), name="analytics"),
]
