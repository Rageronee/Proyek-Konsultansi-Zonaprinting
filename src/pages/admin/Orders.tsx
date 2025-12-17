import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShop } from "@/providers/ShopProvider";
import { OrderStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus, addManualOrder, deleteOrder } = useShop();
  const { toast } = useToast();
  const [manualKey, setManualKey] = useState("");
  const [manualCustomer, setManualCustomer] = useState("");
  const [manualTotal, setManualTotal] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [editKey, setEditKey] = useState("");

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
            <Input
              placeholder="Total transaksi (Rp)"
              value={manualTotal}
              onChange={(e) => setManualTotal(e.target.value.replace(/[^0-9]/g, ""))}
            />
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
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>
              Kunci wajib diisi dengan kode yang benar untuk menambahkan pesanan offline (hybrid data).
            </span>
            <span className="font-mono text-[11px] opacity-60">Format: ZP-ADMIN-2025</span>
          </div>
          <Button
            className="mt-2"
            onClick={() => {
              const totalNumber = Number(manualTotal);
              if (!manualCustomer || !totalNumber) {
                toast({
                  title: "Data belum lengkap",
                  description: "Nama pelanggan dan total transaksi wajib diisi.",
                  variant: "destructive",
                });
                return;
              }
              const result = addManualOrder({
                key: manualKey,
                customer: manualCustomer,
                total: totalNumber,
                note: manualNote,
              });
              if (!result.success) {
                toast({ title: "Gagal menambahkan pesanan", description: result.message, variant: "destructive" });
                return;
              }
              toast({ title: "Pesanan offline ditambahkan", description: result.message });
              setManualCustomer("");
              setManualTotal("");
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
            <Input
              className="sm:max-w-xs"
              placeholder="Masukkan kunci admin untuk edit/hapus"
              type="password"
              value={editKey}
              onChange={(e) => setEditKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!editKey) {
                    (e.target as HTMLInputElement).blur();
                  } else {
                    // Beri feedback kecil bahwa kunci sudah tersimpan di state
                    // (aksi nyata dilakukan saat klik ubah status / hapus)
                    (e.target as HTMLInputElement).blur();
                    toast({
                      title: "Kunci disimpan",
                      description: "Anda sekarang dapat mengubah status atau menghapus pesanan.",
                    });
                  }
                }
              }}
            />
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
                <th className="py-2 pr-4">Pembayaran</th>
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
                    <div className="text-xs text-muted-foreground">{order.userEmail}</div>
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
                  <td className="py-3 pr-4 capitalize text-xs text-muted-foreground">{order.paymentMethod}</td>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const subject = encodeURIComponent(`Verifikasi Pesanan ${order.id}`);
                        const body = encodeURIComponent(
                          `Halo Admin,\nPesanan ${order.id} atas nama ${order.userName} siap diverifikasi.\nTotal: Rp ${order.total.toLocaleString(
                            "id-ID",
                          )}\nStatus: ${order.status}\nPembayaran: ${order.paymentMethod}`,
                        );
                        window.open(`mailto:admin@zonaprinting.com?subject=${subject}&body=${body}`, "_blank");
                      }}
                    >
                      Email Admin
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
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
                        deleteOrder(order.id);
                        toast({ title: "Pesanan dihapus", description: `Pesanan ${order.id} telah dihapus.` });
                      }}
                    >
                      Hapus
                    </Button>
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
    </div>
  );
};

export default AdminOrdersPage;

