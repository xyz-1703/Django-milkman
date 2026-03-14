import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/catalogApi";
import { Category, Product } from "@/types/catalog";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch {
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCategory = activeCategory === "all" || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [products, activeCategory, search],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground">All Products</h1>
      <p className="mt-1 text-muted-foreground">Browse our complete range of dairy products</p>
      {loading && <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>}
      {error && !loading && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSearchParams({})} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSearchParams({ category: cat.id })} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">No products found matching your criteria.</div>
      )}
    </div>
  );
};

export default Products;
