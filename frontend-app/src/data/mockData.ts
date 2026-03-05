export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  rating: number;
  inStock: boolean;
  isSubscribable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
}

export interface Subscription {
  id: string;
  productName: string;
  quantity: number;
  deliveryDays: string[];
  status: "active" | "paused";
  monthlyTotal: number;
  startDate: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  items: string;
  status: "pending" | "delivered";
  notes: string;
  date: string;
}

export const categories: Category[] = [
  { id: "milk", name: "Milk", icon: "🥛", description: "Farm-fresh milk delivered daily", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop" },
  { id: "curd", name: "Curd", icon: "🥣", description: "Thick, creamy homemade curd", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop" },
  { id: "butter", name: "Butter", icon: "🧈", description: "Pure golden butter", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop" },
  { id: "paneer", name: "Paneer", icon: "🧀", description: "Soft, fresh cottage cheese", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop" },
  { id: "ghee", name: "Ghee", icon: "✨", description: "Traditional clarified butter", image: "https://images.unsplash.com/photo-1600398137498-3897c67e1845?w=400&h=300&fit=crop" },
  { id: "cheese", name: "Cheese", icon: "🧀", description: "Artisanal cheese varieties", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop" },
  { id: "flavored-milk", name: "Flavored Milk", icon: "🍫", description: "Delicious flavored milk drinks", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop" },
];

export const products: Product[] = [
  { id: "p1", name: "Farm Fresh Whole Milk", category: "milk", price: 65, unit: "1L", description: "Pure, unprocessed whole milk from grass-fed cows", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop", rating: 4.8, inStock: true, isSubscribable: true },
  { id: "p2", name: "Toned Milk", category: "milk", price: 52, unit: "1L", description: "Low-fat toned milk, perfect for daily use", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop", rating: 4.5, inStock: true, isSubscribable: true },
  { id: "p3", name: "Organic A2 Milk", category: "milk", price: 95, unit: "1L", description: "Premium A2 protein milk from indigenous cows", image: "https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=400&h=400&fit=crop", rating: 4.9, inStock: true, isSubscribable: true },
  { id: "p4", name: "Fresh Curd", category: "curd", price: 45, unit: "500g", description: "Thick, creamy curd set naturally", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop", rating: 4.7, inStock: true, isSubscribable: true },
  { id: "p5", name: "Greek Yogurt", category: "curd", price: 120, unit: "400g", description: "Protein-rich strained Greek yogurt", image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&h=400&fit=crop", rating: 4.6, inStock: true, isSubscribable: false },
  { id: "p6", name: "Salted Butter", category: "butter", price: 55, unit: "100g", description: "Creamy salted butter from fresh cream", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop", rating: 4.8, inStock: true, isSubscribable: false },
  { id: "p7", name: "Unsalted Butter", category: "butter", price: 58, unit: "100g", description: "Pure unsalted butter for cooking & baking", image: "https://images.unsplash.com/photo-1600398137498-3897c67e1845?w=400&h=400&fit=crop", rating: 4.7, inStock: true, isSubscribable: false },
  { id: "p8", name: "Fresh Paneer", category: "paneer", price: 90, unit: "200g", description: "Soft, milky paneer made fresh daily", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop", rating: 4.9, inStock: true, isSubscribable: true },
  { id: "p9", name: "Malai Paneer", category: "paneer", price: 110, unit: "200g", description: "Extra creamy malai paneer block", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop", rating: 4.8, inStock: true, isSubscribable: false },
  { id: "p10", name: "Pure Desi Ghee", category: "ghee", price: 650, unit: "500ml", description: "Traditional bilona-method clarified butter", image: "https://images.unsplash.com/photo-1600398137498-3897c67e1845?w=400&h=400&fit=crop", rating: 5.0, inStock: true, isSubscribable: false },
  { id: "p11", name: "Cheddar Cheese", category: "cheese", price: 180, unit: "200g", description: "Aged sharp cheddar cheese block", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop", rating: 4.6, inStock: true, isSubscribable: false },
  { id: "p12", name: "Mozzarella Cheese", category: "cheese", price: 160, unit: "200g", description: "Fresh mozzarella, perfect for pizza", image: "https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=400&h=400&fit=crop", rating: 4.7, inStock: true, isSubscribable: false },
  { id: "p13", name: "Chocolate Milk", category: "flavored-milk", price: 35, unit: "200ml", description: "Rich chocolate flavored milk", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop", rating: 4.5, inStock: true, isSubscribable: true },
  { id: "p14", name: "Strawberry Milk", category: "flavored-milk", price: 35, unit: "200ml", description: "Sweet strawberry flavored milk", image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop", rating: 4.4, inStock: true, isSubscribable: true },
  { id: "p15", name: "Badam Milk", category: "flavored-milk", price: 45, unit: "200ml", description: "Traditional almond-infused milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop", rating: 4.8, inStock: true, isSubscribable: true },
];

export const sampleOrders: Order[] = [
  { id: "ORD-001", date: "2026-03-01", items: [{ name: "Farm Fresh Whole Milk", qty: 2, price: 65 }, { name: "Fresh Curd", qty: 1, price: 45 }], total: 175, status: "delivered" },
  { id: "ORD-002", date: "2026-03-02", items: [{ name: "Organic A2 Milk", qty: 1, price: 95 }, { name: "Fresh Paneer", qty: 2, price: 90 }], total: 275, status: "processing" },
  { id: "ORD-003", date: "2026-03-03", items: [{ name: "Pure Desi Ghee", qty: 1, price: 650 }], total: 650, status: "pending" },
];

export const sampleSubscriptions: Subscription[] = [
  { id: "SUB-001", productName: "Farm Fresh Whole Milk", quantity: 2, deliveryDays: ["Mon", "Wed", "Fri"], status: "active", monthlyTotal: 1560, startDate: "2026-01-15" },
  { id: "SUB-002", productName: "Fresh Curd", quantity: 1, deliveryDays: ["Tue", "Thu", "Sat"], status: "active", monthlyTotal: 540, startDate: "2026-02-01" },
  { id: "SUB-003", productName: "Chocolate Milk", quantity: 3, deliveryDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], status: "paused", monthlyTotal: 2100, startDate: "2026-02-10" },
];

export const sampleDeliveries: Delivery[] = [
  { id: "DEL-001", orderId: "ORD-003", customerName: "Rahul Sharma", address: "42 Green Park, Sector 12", items: "Pure Desi Ghee x1", status: "pending", notes: "", date: "2026-03-04" },
  { id: "DEL-002", orderId: "SUB-001", customerName: "Priya Patel", address: "15 Lotus Lane, Block B", items: "Farm Fresh Whole Milk x2", status: "pending", notes: "Ring doorbell", date: "2026-03-04" },
  { id: "DEL-003", orderId: "SUB-002", customerName: "Amit Kumar", address: "8 Jasmine Apartments, Floor 3", items: "Fresh Curd x1", status: "delivered", notes: "Left with guard", date: "2026-03-04" },
  { id: "DEL-004", orderId: "ORD-002", customerName: "Sneha Gupta", address: "22 Sunrise Colony", items: "Organic A2 Milk x1, Fresh Paneer x2", status: "pending", notes: "", date: "2026-03-04" },
];

export const revenueData = [
  { month: "Sep", revenue: 45000 },
  { month: "Oct", revenue: 52000 },
  { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 61000 },
  { month: "Jan", revenue: 55000 },
  { month: "Feb", revenue: 67000 },
  { month: "Mar", revenue: 72000 },
];

export const categoryRevenueData = [
  { name: "Milk", value: 35 },
  { name: "Curd", value: 15 },
  { name: "Butter", value: 12 },
  { name: "Paneer", value: 14 },
  { name: "Ghee", value: 10 },
  { name: "Cheese", value: 8 },
  { name: "Flavored", value: 6 },
];
