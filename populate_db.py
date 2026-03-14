import os
import django
from decimal import Decimal
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman_backend.settings')
django.setup()

from products.models import Category, Product
from users.models import User
from orders.models import Order, OrderItem
from subscriptions.models import Subscription

# Clear existing data
OrderItem.objects.all().delete()
Order.objects.all().delete()
Subscription.objects.all().delete()
Category.objects.all().delete()
Product.objects.all().delete()

# Create categories
categories_data = [
    {'id': 'milk', 'name': 'Milk', 'icon': '', 'description': 'Fresh milk products', 'image': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop'},
    {'id': 'yogurt', 'name': 'Yogurt', 'icon': '', 'description': 'Fresh yogurt and desserts', 'image': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&h=600&fit=crop'},
    {'id': 'cheese', 'name': 'Cheese', 'icon': '', 'description': 'Premium cheese varieties', 'image': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=600&fit=crop'},
    {'id': 'butter', 'name': 'Butter & Ghee', 'icon': '', 'description': 'Butter and ghee products', 'image': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=600&fit=crop'},
]

categories = {}
for cat_data in categories_data:
    cat = Category.objects.create(**cat_data)
    categories[cat.id] = cat

# Create products
products_data = [
    {'id': 'p1', 'name': 'Full Cream Milk 1L', 'category': categories['milk'], 'price': 45.00, 'unit': '1L', 'description': 'Fresh full cream milk', 'image': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop', 'rating': 4.5, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p2', 'name': 'Skimmed Milk 1L', 'category': categories['milk'], 'price': 40.00, 'unit': '1L', 'description': 'Low fat skimmed milk', 'image': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=800&fit=crop', 'rating': 4.0, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p3', 'name': 'Organic Milk 500ml', 'category': categories['milk'], 'price': 35.00, 'unit': '500ml', 'description': 'Organic certified milk', 'image': 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=800&h=800&fit=crop', 'rating': 4.8, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p4', 'name': 'Greek Yogurt 400g', 'category': categories['yogurt'], 'price': 120.00, 'unit': '400g', 'description': 'Creamy Greek yogurt', 'image': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&h=800&fit=crop', 'rating': 4.6, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p5', 'name': 'Strawberry Yogurt 500g', 'category': categories['yogurt'], 'price': 90.00, 'unit': '500g', 'description': 'Fresh strawberry yogurt', 'image': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&h=800&fit=crop', 'rating': 4.3, 'in_stock': True, 'is_subscribable': False},
    {'id': 'p6', 'name': 'Paneer 500g', 'category': categories['cheese'], 'price': 150.00, 'unit': '500g', 'description': 'Fresh homemade paneer', 'image': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=800&fit=crop', 'rating': 4.7, 'in_stock': True, 'is_subscribable': False},
    {'id': 'p7', 'name': 'Butter 250g', 'category': categories['butter'], 'price': 200.00, 'unit': '250g', 'description': 'Pure butter', 'image': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=800&fit=crop', 'rating': 4.4, 'in_stock': True, 'is_subscribable': True},
    {'id': 'p8', 'name': 'Ghee 500ml', 'category': categories['butter'], 'price': 500.00, 'unit': '500ml', 'description': 'Pure cow ghee', 'image': 'https://images.unsplash.com/photo-1600398137498-3897c67e1845?w=800&h=800&fit=crop', 'rating': 4.9, 'in_stock': True, 'is_subscribable': False},
]

for prod_data in products_data:
    Product.objects.create(**prod_data)

# Create sample users
User.objects.filter(username__in=['customer', 'staff', 'admin']).delete()
customer_primary = User.objects.create_user(
    username='customer',
    email='customer@dairy.com',
    password='customer123',
    role='customer',
    first_name='Rahul',
    last_name='Sharma',
    contact_number='9876543210',
    address_line1='42 Green Park',
    address_line2='Sector 12',
    city='Pune',
    state='Maharashtra',
    pincode='411001',
)
customer_2 = User.objects.create_user(
    username='anita.kulkarni',
    email='anita@dairy.com',
    password='customer123',
    role='customer',
    first_name='Anita',
    last_name='Kulkarni',
    contact_number='9898989898',
    address_line1='15 Lotus Residency',
    address_line2='Baner Road',
    city='Pune',
    state='Maharashtra',
    pincode='411045',
)
customer_3 = User.objects.create_user(
    username='vivek.patil',
    email='vivek@dairy.com',
    password='customer123',
    role='customer',
    first_name='Vivek',
    last_name='Patil',
    contact_number='9123456780',
    address_line1='8 Jasmine Apartments',
    address_line2='Koregaon Park',
    city='Pune',
    state='Maharashtra',
    pincode='411036',
)
User.objects.create_user(username='staff', email='staff@dairy.com', password='staff123', role='staff', first_name='Priya', last_name='Staff')
User.objects.create_user(username='admin', email='admin@dairy.com', password='admin123', role='admin', first_name='Admin', last_name='Singh')

# Create sample subscriptions
Subscription.objects.create(
    id='SUB-1001',
    user=customer_primary,
    product=Product.objects.get(id='p1'),
    quantity=2,
    delivery_days='Mon,Wed,Fri',
    status='active',
    monthly_total=Decimal('1080.00'),
    start_date='2026-03-01',
)
Subscription.objects.create(
    id='SUB-1002',
    user=customer_2,
    product=Product.objects.get(id='p4'),
    quantity=1,
    delivery_days='Tue,Thu,Sat',
    status='active',
    monthly_total=Decimal('1440.00'),
    start_date='2026-03-02',
)

# Create sample orders
order_1 = Order.objects.create(id='ORD-1001', user=customer_primary, total=Decimal('165.00'), status='pending')
OrderItem.objects.create(order=order_1, product=Product.objects.get(id='p1'), quantity=2, price=Decimal('45.00'))
OrderItem.objects.create(order=order_1, product=Product.objects.get(id='p4'), quantity=1, price=Decimal('75.00'))

order_2 = Order.objects.create(id='ORD-1002', user=customer_2, total=Decimal('190.00'), status='processing')
OrderItem.objects.create(order=order_2, product=Product.objects.get(id='p6'), quantity=1, price=Decimal('150.00'))
OrderItem.objects.create(order=order_2, product=Product.objects.get(id='p2'), quantity=1, price=Decimal('40.00'))

order_3 = Order.objects.create(id='ORD-1003', user=customer_3, total=Decimal('500.00'), status='delivered')
OrderItem.objects.create(order=order_3, product=Product.objects.get(id='p8'), quantity=1, price=Decimal('500.00'))

print("✓ Database populated with sample data!")
print("✓ Categories created: ", len(categories_data))
print("✓ Products created: ", len(products_data))
print("✓ Sample users created")
print("✓ Sample subscriptions created: 2")
print("✓ Sample orders created: 3")
