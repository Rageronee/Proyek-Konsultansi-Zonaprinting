import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/providers/ShopProvider";
import { Skeleton } from "@/components/ui/skeleton";

const slugMap: Record<string, { title: string; category: string }> = {
  "digital-printing": { title: "Digital Printing", category: "Digital Printing" },
  merchandise: { title: "Merchandise", category: "Merchandise" },
  "sticker-label": { title: "Sticker & Label", category: "Sticker" },
  documents: { title: "Document & Books", category: "Document & Books" },
  packaging: { title: "Packaging", category: "Packaging" },
};

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const { products } = useShop();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [slug, search]);

  const meta = slug ? slugMap[slug] : undefined;
  const filtered = useMemo(() => {
    const list = meta ? products.filter((p) => p.category === meta.category) : products;
    return list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [meta, products, search]);

  if (!meta) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 text-center space-y-3">
          <CardTitle>Kategori tidak ditemukan</CardTitle>
          <Button asChild>
            <Link to="/products">Kembali ke Produk</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Kategori</p>
          <h1 className="text-3xl font-bold">{meta.title}</h1>
          <p className="text-muted-foreground">Temukan produk {meta.title} terbaik untuk kebutuhan Anda.</p>
        </div>
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
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
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-md" loading="lazy" />
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
                <Button variant="outline" className="w-1/2 text-xs md:text-sm" asChild>
                  <Link to={`/products/${product.id}`}>Detail</Link>
                </Button>
                <Button
                  className="w-1/2 text-xs md:text-sm whitespace-nowrap"
                  asChild
                >
                  <Link to={`/products/${product.id}`}>Pilih &amp; Tambah</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        {!filtered.length && <p className="text-muted-foreground">Produk belum tersedia di kategori ini.</p>}
      </div>
    </div>
  );
};

export default CategoryProductsPage;

