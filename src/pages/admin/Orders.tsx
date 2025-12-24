import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useShop } from "@/providers/ShopProvider";
import { OrderStatus, Order } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import OrderPrint from "@/components/admin/OrderPrint";

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus, addManualOrder, deleteOrder, products } = useShop();
  const { toast } = useToast();
  const [manualKey, setManualKey] = useState("");
  const [manualCustomer, setManualCustomer] = useState("");
  const [manualTotal, setManualTotal] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null); // State for delete dialog
  // Detailed Manual Order State
  const [manualItems, setManualItems] = useState<{ name: string, price: string, qty: string }[]>([
    { name: "", price: "", qty: "1" }
  ]);
  const [editKey, setEditKey] = useState("");
  const [printOrderData, setPrintOrderData] = useState<Order | null>(null);

  const ADMIN_KEY = "ZP-ADMIN-2025";

  const statusColors: Record<OrderStatus, string> = {
    baru: "bg-slate-100 text-slate-700",
    diproses: "bg-blue-100 text-blue-700",
    produksi: "bg-amber-100 text-amber-700",
    dikirim: "bg-emerald-100 text-emerald-700",
    selesai: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Transaksi</p>
        <h1 className="text-3xl font-bold">Riwayat Pesanan</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Pesanan Offline / Manual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Gunakan form ini untuk mencatat pembelian langsung di toko (offline) agar analitik tetap terintegrasi dengan
            pemesanan via website / WhatsApp.
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Nama pelanggan"
              value={manualCustomer}
              onChange={(e) => setManualCustomer(e.target.value)}
            />
            {/* <Input
              placeholder="Total transaksi (Rp)"
              value={manualTotal}
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, "");
                setManualTotal(numeric ? Number(numeric).toLocaleString("id-ID") : "");
              }}
            /> */}
            <Input
              placeholder="Catatan produk / paket"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
            />
            <Input
              placeholder="Kunci admin"
              type="password"
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
            />
          </div>

          <div className="space-y-2 border rounded-md p-3 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Item Pesanan</div>
            {manualItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end">
                <div className="relative">
                  <Input
                    placeholder="Nama Produk"
                    value={item.name}
                    onChange={e => {
                      const newItems = [...manualItems];
                      newItems[idx].name = e.target.value;
                      setManualItems(newItems);
                    }}
                    list={`products-list-${idx}`}
                  />
                  <datalist id={`products-list-${idx}`}>
                    {products.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
                <Input
                  placeholder="Harga (@)"
                  value={item.price}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    const newItems = [...manualItems];
                    newItems[idx].price = val ? Number(val).toLocaleString("id-ID") : "";
                    setManualItems(newItems);
                  }}
                />
                <Input
                  placeholder="Qty"
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={e => {
                    const newItems = [...manualItems];
                    newItems[idx].qty = e.target.value;
                    setManualItems(newItems);
                  }}
                />
                <Button variant="ghost" size="icon" disabled={manualItems.length === 1} onClick={() => {
                  const newItems = manualItems.filter((_, i) => i !== idx);
                  setManualItems(newItems);
                }}>
                  <span className="text-red-500 text-lg">×</span>
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setManualItems([...manualItems, { name: "", price: "", qty: "1" }])}>
              + Tambah Item
            </Button>
            <div className="text-right text-sm font-bold pt-2">
              Total: Rp {manualItems.reduce((acc, item) => acc + (Number(item.price.replace(/\./g, "")) * Number(item.qty)), 0).toLocaleString("id-ID")}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>
              Kunci wajib diisi dengan kode yang benar untuk menambahkan pesanan offline (hybrid data).
            </span>
            <span className="font-mono text-[11px] opacity-60">Format: ZP-ADMIN-2025</span>
          </div>
          <Button
            className="mt-2"
            onClick={async () => {
              if (!manualCustomer) {
                toast({ title: "Data belum lengkap", description: "Nama pelanggan wajib diisi.", variant: "destructive" });
                return;
              }

              const validItems = manualItems.filter(i => i.name && i.price);
              if (validItems.length === 0) {
                toast({ title: "Item kosong", description: "Minimal isi satu item produk.", variant: "destructive" });
                return;
              }

              const itemsPayload = validItems.map(i => ({
                productId: "manual-" + Math.random().toString(36).substr(2, 9),
                name: i.name,
                price: Number(i.price.replace(/\./g, "")),
                quantity: Number(i.qty)
              }));

              const result = await addManualOrder({
                key: manualKey,
                customer: manualCustomer,
                items: itemsPayload,
                note: manualNote,
              });

              if (!result.success) {
                toast({ title: "Gagal menambahkan pesanan", description: result.message, variant: "destructive" });
                return;
              }
              toast({ title: "Pesanan offline ditambahkan", description: result.message });
              setManualCustomer("");
              setManualItems([{ name: "", price: "", qty: "1" }]);
              setManualNote("");
              setManualKey("");
            }}
          >
            Simpan Pesanan Offline
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan Modifikasi Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Untuk mengubah status atau menghapus transaksi, masukkan kunci admin yang sama. Tanpa kunci yang benar,
            data transaksi hanya dapat dibaca (read-only).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                className="flex-1 sm:max-w-xs"
                placeholder="Masukkan kunci admin untuk edit/hapus"
                type="password"
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (editKey === ADMIN_KEY) {
                      toast({
                        title: "Akses Diberikan",
                        description: "Kunci benar. Anda dapat memodifikasi transaksi sekarang.",
                        className: "bg-green-600 text-white"
                      });
                    } else {
                      toast({
                        title: "Akses Ditolak",
                        description: "Kunci admin salah. Silakan coba lagi.",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  if (editKey === ADMIN_KEY) {
                    toast({
                      title: "Akses Diberikan",
                      description: "Kunci benar. Anda dapat memodifikasi transaksi sekarang.",
                      className: "bg-green-600 text-white"
                    });
                  } else {
                    toast({
                      title: "Akses Ditolak",
                      description: "Kunci admin salah. Silakan coba lagi.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Enter
              </Button>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Kunci ini akan dicek setiap kali Anda mengubah status atau menghapus pesanan.
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Produk</th>
                <th className="py-2 pr-4">Lampiran</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Notifikasi</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs">{order.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{order.userName || order.userId}</div>
                    {order.userEmail !== "offline@zonaprint.com" && <div className="text-xs text-muted-foreground">{order.userEmail}</div>}
                    <div className="text-xs text-muted-foreground">{order.userPhone}</div>
                  </td>
                  <td className="py-3 pr-4 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {(order.attachments ?? []).length
                      ? order.attachments?.map((a) => <div key={a.id}>{a.name}</div>)
                      : "Tidak ada"}
                  </td>
                  <td className="py-3 pr-4 font-semibold">Rp {order.total.toLocaleString("id-ID")}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[order.status]}>{order.status}</Badge>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => {
                          if (editKey !== ADMIN_KEY) {
                            toast({
                              title: "Kunci admin salah",
                              description: "Masukkan kunci admin yang benar untuk mengubah status.",
                              variant: "destructive",
                            });
                            return;
                          }
                          updateOrderStatus(order.id, val as OrderStatus);
                          toast({ title: "Status diperbarui", description: `Pesanan ${order.id} kini berstatus ${val}.` });
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue placeholder="Ubah status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baru">Baru</SelectItem>
                          <SelectItem value="diproses">Diproses</SelectItem>
                          <SelectItem value="produksi">Produksi</SelectItem>
                          <SelectItem value="dikirim">Dikirim</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 pr-4">
                    {order.status === "baru" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="mr-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          if (editKey !== ADMIN_KEY) {
                            toast({
                              title: "Kunci admin salah",
                              description: "Masukkan kunci admin untuk memverifikasi pesanan.",
                              variant: "destructive",
                            });
                            return;
                          }
                          updateOrderStatus(order.id, "diproses");
                          toast({ title: "Pesanan diverifikasi", description: `Pesanan ${order.id} telah diverifikasi dan diproses.` });
                        }}
                      >
                        Verifikasi
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        disabled
                      >
                        Terverifikasi
                      </Button>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPrintOrderData(order)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (editKey !== ADMIN_KEY) {
                            toast({
                              title: "Kunci admin salah",
                              description: "Masukkan kunci admin yang benar untuk menghapus pesanan.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setDeleteId(order.id);
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-muted-foreground">
                    Belum ada pesanan tercatat. Lakukan checkout untuk melihat data di sini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {
        printOrderData && (
          <OrderPrint
            order={printOrderData}
            onClose={() => setPrintOrderData(null)}
          />
        )
      }

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pesanan #{deleteId?.slice(0, 8)} akan dihapus secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (deleteId) {
                  deleteOrder(deleteId);
                  toast({ title: "Pesanan dihapus", description: `Pesanan telah dihapus.` });
                  setDeleteId(null);
                }
              }}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
};

export default AdminOrdersPage;

