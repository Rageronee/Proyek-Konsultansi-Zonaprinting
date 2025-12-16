import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShop } from "@/providers/ShopProvider";
import { OrderStatus } from "@/types";

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useShop();

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
                        onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
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

