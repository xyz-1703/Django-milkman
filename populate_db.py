import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman_backend.settings')
django.setup()

from products.models import Category, Product
from users.models import User

# Clear existing data
Category.objects.all().delete()
Product.objects.all().delete()

# Create categories
categories_data = [
    {'id': 'milk', 'name': 'Milk', 'icon': 'Milk', 'description': 'Fresh milk products', 'image': '/images/milk.jpg'},
    {'id': 'yogurt', 'name': 'Yogurt', 'icon': 'Yogurt', 'description': 'Fresh yogurt and desserts', 'image': '/images/yogurt.jpg'},
    {'id': 'cheese', 'name': 'Cheese', 'icon': 'Cheese', 'description': 'Premium cheese varieties', 'image': '/images/cheese.jpg'},
    {'id': 'butter', 'name': 'Butter & Ghee', 'icon': 'Butter', 'description': 'Butter and ghee products', 'image': '/images/butter.jpg'},
]

categories = {}
for cat_data in categories_data:
    cat = Category.objects.create(**cat_data)
    categories[cat.id] = cat

# Create products
products_data = [
    {'id': 'p1', 'name': 'Full Cream Milk 1L', 'category': categories['milk'], 'price': 45.00, 'unit': '1L', 'description': 'Fresh full cream milk', 'image': '/images/milk_1l.jpg', 'rating': 4.5, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p2', 'name': 'Skimmed Milk 1L', 'category': categories['milk'], 'price': 40.00, 'unit': '1L', 'description': 'Low fat skimmed milk', 'image': '/images/milk_skimmed.jpg', 'rating': 4.0, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p3', 'name': 'Organic Milk 500ml', 'category': categories['milk'], 'price': 35.00, 'unit': '500ml', 'description': 'Organic certified milk', 'image': '/images/milk_organic.jpg', 'rating': 4.8, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p4', 'name': 'Greek Yogurt 400g', 'category': categories['yogurt'], 'price': 120.00, 'unit': '400g', 'description': 'Creamy Greek yogurt', 'image': '/images/yogurt_greek.jpg', 'rating': 4.6, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p5', 'name': 'Strawberry Yogurt 500g', 'category': categories['yogurt'], 'price': 90.00, 'unit': '500g', 'description': 'Fresh strawberry yogurt', 'image': '/images/yogurt_strawberry.jpg', 'rating': 4.3, 'in_stock': True, 'is_subscribable': False},
    {'id': 'p6', 'name': 'Paneer 500g', 'category': categories['cheese'], 'price': 150.00, 'unit': '500g', 'description': 'Fresh homemade paneer', 'image': '/images/paneer.jpg', 'rating': 4.7, 'in_stock': True, 'is_subscribable': False},
    {'id': 'p7', 'name': 'Butter 250g', 'category': categories['butter'], 'price': 200.00, 'unit': '250g', 'description': 'Pure butter', 'image': '/images/butter_250g.jpg', 'rating': 4.4, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p8', 'name': 'Ghee 500ml', 'category': categories['butter'], 'price': 500.00, 'unit': '500ml', 'description': 'Pure cow ghee', 'image': '/images/ghee_500ml.jpg', 'rating': 4.9, 'in_stock': True, 'is_subscribable': False},
]

for prod_data in products_data:
    Product.objects.create(**prod_data)

# Create sample users
User.objects.filter(username__in=['customer', 'staff', 'admin']).delete()
User.objects.create_user(username='customer', email='customer@dairy.com', password='customer123', role='customer', first_name='Rahul', last_name='Sharma')
User.objects.create_user(username='staff', email='staff@dairy.com', password='staff123', role='staff', first_name='Priya', last_name='Staff')
User.objects.create_user(username='admin', email='admin@dairy.com', password='admin123', role='admin', first_name='Admin', last_name='Singh')

print("✓ Database populated with sample data!")
print("✓ Categories created: ", len(categories_data))
print("✓ Products created: ", len(products_data))
print("✓ Sample users created")
