from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import FraudReport
from .serializers import FraudReportSerializer

class FraudReportViewSet(viewsets.ModelViewSet):
    queryset = FraudReport.objects.all()
    serializer_class = FraudReportSerializer