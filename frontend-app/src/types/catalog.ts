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
