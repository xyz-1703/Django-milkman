# Milkman Backend - Django REST API

A comprehensive Django REST API backend for the Milkman dairy delivery platform. This backend provides RESTful endpoints for user authentication, product management, order processing, and subscription management.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip

### Installation & Setup

1. **Create and activate virtual environment:**
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```powershell
   pip install django djangorestframework django-cors-headers django-filter
   ```

3. **Run migrations:**
   ```powershell
   python manage.py migrate
   ```

4. **Populate sample data:**
   ```powershell
   python manage.py runserver
   # In another terminal:
   python populate_db.py
   ```

5. **Start development server:**
   ```powershell
   python manage.py runserver
   ```

Server runs at: `http://127.0.0.1:8000/`

## 📋 API Endpoints

### Authentication
- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration
- `GET /api/users/me/` - Get current user (requires auth)

### Products
- `GET /api/products/categories/` - List all categories
- `GET /api/products/products/` - List all products
  - Filters: `category`, `in_stock`
  - Search: `search=name`

### Orders
- `GET /api/orders/` - List user orders (requires auth)
- `POST /api/orders/` - Create new order (requires auth)
- `GET /api/orders/{id}/` - Get order details (requires auth)

### Subscriptions
- `GET /api/subscriptions/` - List user subscriptions (requires auth)
- `POST /api/subscriptions/` - Create subscription (requires auth)
- `PATCH /api/subscriptions/{id}/` - Update subscription status (requires auth)

## 🗄️ Database Models

### User
- Custom user model with roles: customer, staff, admin
- Extended from Django's AbstractUser

### Product
- Fields: name, category, price, unit, description, image, rating, in_stock, is_subscribable
- Related to Category

### Category
- Fields: name, icon, description, image

### Order
- Fields: user, date, total, status (pending/processing/delivered/cancelled)
- Related to OrderItems

### OrderItem
- Fields: order, product, quantity, price

### Subscription
- Fields: user, product, quantity, delivery_days, status (active/paused), monthly_total

## 🧪 Sample User Accounts

| Email | Password | Role |
|-------|----------|------|
| customer@dairy.com | customer123 | Customer |
| staff@dairy.com | staff123 | Staff |
| admin@dairy.com | admin123 | Admin |

## 📁 Project Structure

```
backend/
├── milkman_backend/         # Project settings
│   ├── settings.py         # Django configuration
│   ├── urls.py             # Main URL routing
│   ├── wsgi.py             # WSGI config
│   └── asgi.py             # ASGI config
├── users/                  # User management app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── products/               # Product management app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── orders/                 # Order management app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── subscriptions/          # Subscription management app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── manage.py               # Django management script
├── populate_db.py          # Sample data population script
└── db.sqlite3              # SQLite database
```

## 🔒 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Frontend dev server)
- `http://localhost:3000`
- Local and network access

## 🎯 Frontend Integration

The React frontend (in `frontend-app/` folder) is configured to call these API endpoints at `http://127.0.0.1:8000/api/`.

### Frontend Features
- User login/registration
- Product browsing with filtering
- Shopping cart
- Order history
- Subscription management
- Admin/Staff dashboards

## 📝 Additional Commands

```powershell
# Create a superuser for admin panel
python manage.py createsuperuser

# Access admin panel at http://127.0.0.1:8000/admin/

# Make migrations for model changes
python manage.py makemigrations

# View migration status
python manage.py showmigrations

# Run unit tests
python manage.py test
```

## 🔧 Technology Stack

- **Framework**: Django 6.0.3
- **REST**: Django REST Framework 3.16.1
- **Database**: SQLite3
- **CORS**: django-cors-headers
- **Filtering**: django-filter

## 📄 License

This project is part of the Milkman dairy delivery platform.
