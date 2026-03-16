from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'status', 'monthly_total', 'start_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('id', 'user__email', 'product__name')
    list_editable = ('status',)
    readonly_fields = ('id', 'created_at')
