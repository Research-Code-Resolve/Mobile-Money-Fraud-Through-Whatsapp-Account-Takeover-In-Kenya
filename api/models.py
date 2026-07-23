from django.db import models

class FraudReport(models.Model):
    reporter_name = models.CharField(max_length=100, blank=True, null=True)
    target_phone_number = models.CharField(max_length=20)
    fraud_type = models.CharField(max_length=100, default="WhatsApp Takeover")
    description = models.TextField()
    amount_lost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_reported = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        return f"Fraud Report: {self.target_phone_number} - {self.status}"