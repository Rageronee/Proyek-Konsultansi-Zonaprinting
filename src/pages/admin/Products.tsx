import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShop } from "@/providers/ShopProvider";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Draft = Omit<Product, "id">;

const emptyDraft: Draft = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  image: "",
  featured: false,
  options: [],
};

const AdminProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, draft);
    } else {
      addProduct(draft);
    }
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const startEdit = (product: Product) => {
    const { id, ...rest } = product;
    setDraft(rest);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Produk</p>
        <h1 className="text-3xl font-bold">Kelola Produk</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Produk" : "Tambah Produk"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Nama produk"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Kategori"
              list="categories"
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              required
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Harga"
                value={draft.price || ""}
                onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
                required
              />
              {draft.price > 0 && (
                <p className="text-xs text-muted-foreground">
                  Rp {draft.price.toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stok (pcs)</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Stok"
                value={draft.stock}
                onChange={(e) => setDraft((d) => ({ ...d, stock: Number(e.target.value) }))}
                required
              />
            </div>
            <Input
              placeholder="URL gambar"
              value={draft.image}
              onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
              required
            />
            <Textarea
              className="md:col-span-2"
              placeholder="Deskripsi"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              required
            />
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="options">Opsi ukuran / gramasi (opsional)</Label>
              <Input
                id="options"
                placeholder='Contoh: A5 150gsm, A4 150gsm, B5 120gsm'
                value={draft.options?.join(", ") ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    options: e.target.value
                      .split(",")
                      .map((opt) => opt.trim())
                      .filter(Boolean),
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Isi dengan koma untuk memisahkan pilihan. Opsi ini akan muncul sebagai tombol pilihan di halaman detail produk.
              </p>
            </div>
            <Button type="submit" className="md:col-span-2">
              {editingId ? "Simpan Perubahan" : "Tambah Produk"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <img src={product.image} className="w-full h-32 object-cover rounded-md" />
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="secondary">Harga: Rp {product.price.toLocaleString("id-ID")}</Badge>
                  <Badge variant="outline">Stok: {product.stock} pcs</Badge>
                  {product.options && product.options.length > 0 && (
                    <Badge variant="outline" className="text-[11px]">
                      {product.options.length} opsi ukuran/gramasi
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-1/2" onClick={() => startEdit(product)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2"
                  onClick={() => {
                    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
                    deleteProduct(product.id);
                  }}
                >
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;

