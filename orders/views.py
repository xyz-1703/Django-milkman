from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        order = Order.objects.create(
            id=data.get('id'),
            user=request.user,
            total=data.get('total'),
            status='pending'
        )
        for item in data.get('items', []):
            OrderItem.objects.create(
                order=order,
                product_id=item.get('product'),
                quantity=item.get('quantity'),
                price=item.get('price')
            )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
