import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShop } from "@/providers/ShopProvider";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

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
  const [optionsInput, setOptionsInput] = useState("");

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const { toast } = useToast();

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalOptions = optionsInput
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    const finalDraft = { ...draft, options: finalOptions };

    if (editingId) {
      updateProduct(editingId, finalDraft);
      toast({ title: "Produk Diperbarui", description: `Produk "${draft.name}" berhasil diupdate.` });
    } else {
      addProduct(finalDraft);
      toast({ title: "Produk Ditambahkan", description: `Produk "${draft.name}" berhasil ditambahkan.` });
    }

    // Reset form
    setDraft(emptyDraft);
    setOptionsInput("");
    setEditingId(null);
  };

  const startEdit = (product: Product) => {
    const { id, ...rest } = product;
    setDraft(rest);
    setOptionsInput(rest.options?.join(", ") ?? "");
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      toast({ title: "Produk Dihapus", description: `Produk "${deleteName}" telah dihapus.` });
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <p className="text-sm text-muted-foreground">Produk</p>
        <h1 className="text-3xl font-bold">Kelola Produk</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Nama produk"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              required
            />
            <div className="relative">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="text"
                placeholder="0"
                value={draft.price ? draft.price.toLocaleString("id-ID") : ""}
                onChange={(e) => {
                  // Strip non-digits
                  const val = e.target.value.replace(/\D/g, "");
                  setDraft((d) => ({ ...d, price: Number(val) }));
                }}
                required
              />
              <p className="text-xs text-muted-foreground">
                Format: Rp {draft.price.toLocaleString("id-ID")}
              </p>
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

            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // Simple upload logic
                    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

                    // Try upload
                    let result = await supabase.storage.from("products").upload(fileName, file);

                    // If bucket not found, try to create it (might fail if no permissions, but worth a try)
                    if (result.error && result.error.message.includes("is not found")) { // "The resource was not found" or "Bucket not found"
                      // Attempt creation (public by default if possible, else private)
                      const { error: createError } = await supabase.storage.createBucket("products", { public: true });
                      if (!createError) {
                        // Retry upload
                        result = await supabase.storage.from("products").upload(fileName, file);
                      } else {
                        toast({ title: "Bucket 'products' tidak ditemukan", description: "Silakan buat bucket 'products' (Public) di dashboard Supabase Anda.", variant: "destructive" });
                        return;
                      }
                    }

                    if (result.error) {
                      toast({ title: "Gagal upload gambar", description: result.error.message, variant: "destructive" });
                    } else if (result.data) {
                      // Get Public URL
                      const { data: publicData } = supabase.storage.from("products").getPublicUrl(fileName);
                      setDraft((d) => ({ ...d, image: publicData.publicUrl }));
                      toast({ title: "Upload sukses", description: "Gambar berhasil diunggah." });
                    }
                  }}
                />
                {/* Fallback to URL */}
                <Input
                  placeholder="atau URL gambar..."
                  value={draft.image}
                  onChange={(e) => setDraft(d => ({ ...d, image: e.target.value }))}
                />
              </div>
              {draft.image && (
                <img src={draft.image} alt="Preview" className="h-20 w-20 object-cover rounded border" />
              )}
            </div>
            <Textarea
              className="md:col-span-2"
              placeholder="Deskripsi Lengkap"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              required
            />
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="options">Opsi Varian (pisahkan dengan koma)</Label>
              <Input
                id="options"
                placeholder='Contoh: A5 150gsm, A4 150gsm, B5 120gsm'
                value={optionsInput}
                onChange={(e) => setOptionsInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Varian ini akan muncul sebagai tombol pilihan bagi pembeli.
              </p>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft);
                  setOptionsInput("");
                }}>
                  Batal Edit
                </Button>
              )}
              <Button type="submit" className="min-w-[150px]">
                {editingId ? "Update Produk" : "Simpan Produk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-video">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
              <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80">{product.category}</Badge>
            </div>

            <CardContent className="p-4 space-y-2">
              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 h-8">{product.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="font-semibold text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                <span className="text-muted-foreground text-xs">Stok: {product.stock}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteId(product.id);
                  setDeleteName(product.name);
                }}
              >
                Hapus
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk "{deleteName}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductsPage;

