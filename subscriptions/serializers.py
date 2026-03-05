from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'product', 'product_name', 'quantity', 'delivery_days', 'status', 'monthly_total', 'start_date']
