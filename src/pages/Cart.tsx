import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useShop } from "@/providers/ShopProvider";
import { useAuth } from "@/providers/AuthProvider";

const CartPage = () => {
  const { cart, products, updateCartItem, removeFromCart, getCartTotal } = useShop();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const cartWithProduct = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: (typeof products)[number]; attachments?: { id: string; name: string; url: string }[]; note?: string; selectedOption?: string }>;

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Langkah 1 dari 2</p>
          <h1 className="text-3xl font-bold">Keranjang Belanja</h1>
        </div>
        <Button variant="outline" asChild>
          <Link to="/products">Tambah Produk</Link>
        </Button>
      </div>

      {!cartWithProduct.length ? (
        <Card className="p-6 text-center space-y-4">
          <CardTitle>Keranjang kosong</CardTitle>
          <p className="text-muted-foreground">Mulai tambahkan produk untuk melanjutkan ke pembayaran.</p>
          <Button asChild>
            <Link to="/products">Lihat Produk</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartWithProduct.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b pb-4">
                  <img src={item.product.image} className="h-20 w-24 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Harga: Rp {item.product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      * Kirimkan dokumen/desain berkualitas tinggi (PNG, PDF, AI, PSD, dan format lainnya) langsung
                      melalui WhatsApp setelah checkout agar hasil cetak tetap tajam.
                    </p>
                    <div className="mt-4">
                      <Label htmlFor={`note-${item.productId}`} className="text-xs text-muted-foreground">Catatan Pesanan</Label>
                      <Textarea
                        id={`note-${item.productId}`}
                        placeholder="Contoh: Nama di kartu 'Budi Santoso', Warna background biru muda"
                        value={item.note || ""}
                        className={`mt-1.5 min-h-[80px] text-sm resize-none ${!item.note?.trim() ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        onChange={(e) => {
                          updateCartItem(item.productId, item.quantity, e.target.value);
                          if (error) setError(null);
                        }}
                      />
                      {!item.note?.trim() && (
                        <span className="text-[10px] text-red-500">* Wajib diisi</span>
                      )}
                    </div>

                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className="w-20"
                      onChange={(e) => updateCartItem(item.productId, Number(e.target.value))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productId)}>
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button
                className="w-full"
                onClick={() => {
                  const hasEmptyNote = cartWithProduct.some(item => !item.note || !item.note.trim());
                  if (hasEmptyNote) {
                    setError("Mohon lengkapi catatan untuk semua produk di keranjang.");
                    return;
                  }
                  navigate(isAuthenticated ? "/checkout" : "/login");
                }}
              >
                Lanjutkan ke Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;

