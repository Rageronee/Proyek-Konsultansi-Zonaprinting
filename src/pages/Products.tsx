import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/providers/ShopProvider";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsPage = () => {
  const { products, addToCart } = useShop();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [category, search]);

  const badgeTone = (cat: string) => {
    const map: Record<string, string> = {
      "Digital Printing": "bg-primary/10 text-primary",
      Merchandise: "bg-amber-100 text-amber-700",
      Sticker: "bg-emerald-100 text-emerald-700",
      "Document & Books": "bg-blue-100 text-blue-700",
      Packaging: "bg-purple-100 text-purple-700",
      Display: "bg-slate-100 text-slate-700",
    };
    return map[cat] ?? "bg-slate-100 text-slate-700";
  };

  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Katalog produk</p>
          <h1 className="text-3xl font-bold">Semua Produk</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-64"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Semua Kategori" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`sk-${i}`} className="p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-1/2" />
                <Skeleton className="h-9 w-1/2" />
              </div>
            </Card>
          ))}
        {!loading &&
          filtered.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-md"
                  loading="lazy"
                />
                <CardTitle className="mt-4 text-xl">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Rp {product.price.toLocaleString("id-ID")}</p>
                  <Badge className={badgeTone(product.category)}>{product.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Stok: {product.stock}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-1/2" asChild>
                  <Link to={`/products/${product.id}`}>Detail</Link>
                </Button>
                <Button className="w-1/2" onClick={() => addToCart(product.id)}>
                  Tambah ke Keranjang
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ProductsPage;

