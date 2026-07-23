from rest_framework import serializers
from .models import FraudReport

class FraudReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudReport
        fields = '__all__'