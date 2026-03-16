from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', 'total', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('id', 'user__email', 'user__username')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = ('id', 'user', 'date', 'total', 'created_at')
