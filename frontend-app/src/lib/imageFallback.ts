import type { SyntheticEvent } from "react";

const PRODUCT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23eef2ef'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='36' fill='%23516b5b'%3EProduct Image%3C/text%3E%3C/svg%3E";

const CATEGORY_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f5f3'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='30' fill='%23516b5b'%3ECategory Image%3C/text%3E%3C/svg%3E";

export const productImageOrFallback = (imageUrl?: string | null): string => {
  return imageUrl && imageUrl.trim() ? imageUrl : PRODUCT_FALLBACK;
};

export const categoryImageOrFallback = (imageUrl?: string | null): string => {
  return imageUrl && imageUrl.trim() ? imageUrl : CATEGORY_FALLBACK;
};

export const handleImageError = (event: SyntheticEvent<HTMLImageElement>, type: "product" | "category") => {
  event.currentTarget.src = type === "product" ? PRODUCT_FALLBACK : CATEGORY_FALLBACK;
};
