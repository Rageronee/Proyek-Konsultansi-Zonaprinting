import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/providers/ShopProvider";
import { useAuth } from "@/providers/AuthProvider";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const { isAuthenticated } = useAuth();

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6">
          <CardTitle>Produk tidak ditemukan</CardTitle>
          <Button className="mt-4 w-fit" onClick={() => navigate("/products")}>
            Kembali ke katalog
          </Button>
        </Card>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product.id);
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${product.id}` } });
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow-sm"
          loading="lazy"
        />
      </div>
      <Card>
        <CardHeader>
          <Badge className="w-fit mb-2 bg-primary/10 text-primary">{product.category}</Badge>
          <CardTitle className="text-3xl">{product.name}</CardTitle>
          <p className="text-muted-foreground">{product.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-semibold">Rp {product.price.toLocaleString("id-ID")}</p>
          <p className="text-sm text-muted-foreground">Stok tersedia: {product.stock}</p>
          <div className="flex gap-3">
            <Button onClick={handleAdd}>Tambah ke Keranjang</Button>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

