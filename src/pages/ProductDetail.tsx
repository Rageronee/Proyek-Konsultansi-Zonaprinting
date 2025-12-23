import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/providers/ShopProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    product?.options && product.options.length > 0 ? product.options[0] : null,
  );

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

  const handleAdd = async () => {
    if (!note.trim()) {
      setError("Mohon isi catatan pesanan terlebih dahulu.");
      return;
    }

    setIsAdding(true);
    await new Promise(r => setTimeout(r, 600)); // Fake nice delay/animation time

    addToCart(product.id, 1, {
      option: selectedOption ?? undefined,
      note: note.trim() || undefined,
    });

    setIsAdding(false);

    toast({
      title: "Produk ditambahkan ke keranjang",
      description: `${product.name} berhasil masuk ke keranjang belanja Anda.`,
    });
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

          {product.options && product.options.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Pilih ukuran / gramasi cetak</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={selectedOption === opt ? "default" : "outline"}
                    size="sm"
                    className={`text-xs md:text-sm rounded-full ${selectedOption === opt
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-primary/5"
                      }`}
                    onClick={() => setSelectedOption(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Opsi ini bisa disesuaikan lagi saat Anda mengirim detail pesanan melalui WhatsApp.
              </p>
            </div>
          )}

          {!isAdmin && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Catatan khusus untuk pesanan ini <span className="text-red-500">*</span></p>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Tulis detail seperti ukuran final, jenis kertas (misal: A5 150gsm, print 2 sisi), jumlah halaman, finishing, dll."
                className={`w-full min-h-[96px] rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-y ${error ? "border-red-500 ring-red-500 ring-1" : "border-input"
                  }`}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground">
                Catatan ini wajib diisi agar admin memahami kebutuhan Anda.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isAuthenticated && isAdmin ? (
              <Button
                onClick={() => navigate(`/admin/products`)} // In a real app: /admin/products/edit/${product.id}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                Edit Produk (Admin)
              </Button>
            ) : (
              <Button
                onClick={handleAdd}
                disabled={isAdding}
                className={`flex-1 text-sm md:text-base whitespace-nowrap overflow-hidden relative transition-all duration-300 ${isAdding ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        ✓
                      </motion.span>
                      Ditambahkan!
                    </motion.div>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      Tambah ke Keranjang
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="flex-1 text-sm md:text-base"
            >
              Kembali ke Katalog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

