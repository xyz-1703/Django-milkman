import { Link } from "react-router-dom";
import { ArrowRight, Truck, Leaf, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/dairy-hero.jpg";

const Index = () => {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dairy-hero">
        <div className="container mx-auto flex min-h-[80vh] flex-col-reverse items-center gap-8 px-4 py-16 md:flex-row">
          <div className="flex-1 animate-fade-in">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🥛 Farm Fresh • Daily Delivery
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Pure Dairy,<br />
              <span className="text-gradient-dairy">Delivered Fresh</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              From our farms to your table — premium milk, curd, paneer, ghee & more. Subscribe for daily delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/subscriptions">
                <Button size="lg" variant="outline" className="gap-2">
                  Start Subscription
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <img src={heroImage} alt="Fresh dairy products" className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {[
            { icon: Truck, title: "Free Delivery", desc: "On all orders" },
            { icon: Leaf, title: "100% Natural", desc: "No preservatives" },
            { icon: Clock, title: "Daily Fresh", desc: "Morning delivery" },
            { icon: Shield, title: "Quality Assured", desc: "Lab tested" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 font-display text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="mb-8 text-muted-foreground">Browse our range of farm-fresh dairy products</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="group overflow-hidden rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-2 overflow-hidden rounded-lg">
                  <img src={cat.image} alt={cat.name} className="h-24 w-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <span className="text-2xl">{cat.icon}</span>
                <p className="mt-1 text-sm font-semibold text-foreground">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Best Sellers</h2>
              <p className="mt-1 text-muted-foreground">Our most loved products</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline">View All →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-primary p-8 text-center md:p-16">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">Never Run Out of Milk Again</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Subscribe to daily, weekly, or custom delivery schedules. Pause or cancel anytime. Save up to 15% on subscriptions.
            </p>
            <Link to="/subscriptions" className="mt-6 inline-block">
              <Button size="lg" variant="secondary" className="gap-2">
                Start a Subscription <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
