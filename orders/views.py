from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Order.objects.select_related('user').prefetch_related('items__product').order_by('-created_at')
        if getattr(self.request.user, 'role', None) in ['admin', 'staff']:
            return queryset
        return queryset.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) not in ['admin', 'staff']:
            raise PermissionDenied('Only staff/admin can update orders.')
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) not in ['admin', 'staff']:
            raise PermissionDenied('Only staff/admin can update orders.')
        return super().partial_update(request, *args, **kwargs)
    
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
