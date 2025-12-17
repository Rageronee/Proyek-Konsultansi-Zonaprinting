import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShop } from "@/providers/ShopProvider";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const AdminAnalyticsPage = () => {
  const { orders, getProductPerformance } = useShop();

  const performance = useMemo(() => getProductPerformance(), [getProductPerformance]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder =
    orders.length > 0 ? Math.round(revenue / orders.length) : 0;
  const topByRevenue = [...performance].sort((a, b) => b.revenue - a.revenue)[0];
  const topByVolume = [...performance].sort((a, b) => b.totalSold - a.totalSold)[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Analitik</p>
        <h1 className="text-3xl font-bold">Kinerja Penjualan</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp {revenue.toLocaleString("id-ID")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produk Terjual</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {performance.reduce((sum, item) => sum + item.totalSold, 0)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produk Teratas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {performance.sort((a, b) => b.totalSold - a.totalSold)[0]?.name ?? "-"}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Insight & Rekomendasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Rata-rata nilai transaksi saat ini sekitar{" "}
              <span className="font-semibold text-foreground">
                Rp {avgOrder.toLocaleString("id-ID")}
              </span>
              . Pertimbangkan membuat paket bundling sedikit di atas angka ini untuk mendorong upsell.
            </p>
            {topByRevenue && (
              <p>
                • Produk dengan revenue tertinggi adalah{" "}
                <span className="font-semibold text-foreground">{topByRevenue.name}</span>. Perkuat promosi,
                testimoni, dan display visual untuk produk ini.
              </p>
            )}
            {topByVolume && (
              <p>
                • Produk dengan volume penjualan terbanyak adalah{" "}
                <span className="font-semibold text-foreground">{topByVolume.name}</span>. Cocok dijadikan
                &quot;produk umpan&quot; dengan penawaran spesial untuk menarik traffic.
              </p>
            )}
            <p>
              • Tambahkan voucher atau diskon terbatas waktu di jam sibuk (misal akhir pekan) untuk
              memaksimalkan kapasitas produksi.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Segmentasi Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Pantau perbandingan pesanan online (website/WhatsApp) dan offline (toko langsung) dari
              halaman transaksi. Semakin banyak pesanan offline yang dicatat, semakin akurat analitik ini.
            </p>
            <p>
              • Manfaatkan data pelanggan aktif untuk mengirimkan penawaran personal, misalnya harga khusus
              untuk pelanggan yang sering mencetak dokumen atau merchandise.
            </p>
            <p>
              • Gunakan kategori produk (Digital Printing, Merchandise, Sticker & Label, Document & Books,
              Packaging) sebagai dasar rekomendasi paket promosi tematik.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi Revenue per Produk</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="revenue"
                data={performance}
                nameKey="name"
                fill="#0f172a"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;

