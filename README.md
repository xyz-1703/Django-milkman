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
   pip install -r requirements.txt
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
- `POST /api/users/admin-login/` - Admin-only login
- `POST /api/users/register/` - User registration
- `GET /api/users/me/` - Get current user (requires auth)

Login and registration responses include:
- `user`: user profile object
- `token`: DRF auth token used as `Authorization: Token <token>`

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

For deployment, configure `.env` from `.env.example`:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `DATABASE_URL`

## 🎯 Frontend Integration

The React frontend (in `frontend-app/` folder) reads API URL from `VITE_API_BASE_URL`.

For deployment, create `frontend-app/.env` from `frontend-app/.env.example` and set:
- `VITE_API_BASE_URL=https://your-backend-domain.com/api`

## 🚀 Production Deployment (Azure VM / Linux)

This repo is now production-ready with:
- environment-driven Django configuration
- PostgreSQL support via `DATABASE_URL`
- static file serving via WhiteNoise
- sample Gunicorn + Nginx configs in `deploy/`

### 1. Backend Setup

```bash
cd /var/www/milkman
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env with production values
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py check --deploy
```

### 2. Gunicorn Service

1. Copy `deploy/gunicorn.service.example` to `/etc/systemd/system/milkman.service`
2. Update paths/user in the service file
3. Start and enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable milkman
sudo systemctl start milkman
sudo systemctl status milkman
```

### 3. Nginx Reverse Proxy

1. Copy `deploy/nginx.milkman.conf.example` to `/etc/nginx/sites-available/milkman`
2. Update `server_name` and directory paths
3. Enable site and reload:

```bash
sudo ln -s /etc/nginx/sites-available/milkman /etc/nginx/sites-enabled/milkman
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Frontend Build and Deploy

```bash
cd frontend-app
cp .env.example .env
# set VITE_API_BASE_URL to your backend API URL
npm install
npm run build
```

Deploy `frontend-app/dist/` on your static host (Nginx, Azure Static Web Apps, Vercel, or Netlify).

### 5. HTTPS

Use Certbot for TLS on the VM:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.your-domain.com
```

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
