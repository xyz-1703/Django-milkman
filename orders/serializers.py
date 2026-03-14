from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_contact_number = serializers.CharField(source='user.contact_number', read_only=True)
    user_full_address = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.username

    def get_user_full_address(self, obj):
        parts = [
            obj.user.address_line1,
            obj.user.address_line2,
            obj.user.city,
            obj.user.state,
            obj.user.pincode,
        ]
        cleaned = [part.strip() for part in parts if part and part.strip()]
        return ", ".join(cleaned)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'date',
            'total',
            'status',
            'items',
            'user_email',
            'user_name',
            'user_contact_number',
            'user_full_address',
        ]
