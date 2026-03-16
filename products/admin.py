from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'unit', 'in_stock', 'is_subscribable', 'rating')
    list_filter = ('category', 'in_stock', 'is_subscribable')
    search_fields = ('name', 'description')
    list_editable = ('in_stock', 'price')
