from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FraudReportViewSet

router = DefaultRouter()
router.register(r'reports', FraudReportViewSet, basename='fraudreport')

urlpatterns = [
    path('', include(router.urls)),
]