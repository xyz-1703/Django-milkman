import { API_BASE_URL } from "@/lib/api";
import { Category, Product } from "@/types/catalog";

type ApiCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
};

type ApiProduct = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  unit: string;
  description: string;
  image: string;
  rating: number;
  in_stock: boolean;
  is_subscribable: boolean;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const fetchPaginated = async <T>(url: string): Promise<T[]> => {
  const allResults: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) throw new Error("Failed to load paginated data");

    const data = (await response.json()) as T[] | PaginatedResponse<T>;
    if (Array.isArray(data)) {
      allResults.push(...data);
      nextUrl = null;
    } else {
      allResults.push(...(data.results || []));
      // Rewrite absolute next URLs (Django's internal host) to same-origin paths.
      if (data.next) {
        try {
          const u = new URL(data.next);
          nextUrl = u.pathname + u.search;
        } catch {
          nextUrl = data.next;
        }
      } else {
        nextUrl = null;
      }
    }
  }

  return allResults;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const data = await fetchPaginated<ApiCategory>(`${API_BASE_URL}/products/categories/`);
  return data.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    description: category.description,
    image: category.image,
  }));
};

export const fetchProducts = async (): Promise<Product[]> => {
  const data = await fetchPaginated<ApiProduct>(`${API_BASE_URL}/products/products/`);
  return data.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    unit: product.unit,
    description: product.description,
    image: product.image,
    rating: Number(product.rating),
    inStock: product.in_stock,
    isSubscribable: product.is_subscribable,
  }));
};
