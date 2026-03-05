from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Subscription
from .serializers import SubscriptionSerializer

class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        subscription = Subscription.objects.create(
            id=data.get('id'),
            user=request.user,
            product_id=data.get('product'),
            quantity=data.get('quantity'),
            delivery_days=data.get('delivery_days'),
            monthly_total=data.get('monthly_total'),
            start_date=data.get('start_date')
        )
        return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)
