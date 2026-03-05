from django.db import models
from django.conf import settings
from products.models import Product

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    delivery_days = models.CharField(max_length=100)  # Stored as comma-separated values
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    monthly_total = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'subscriptions'
    
    def __str__(self):
        return f"Subscription {self.id}"
