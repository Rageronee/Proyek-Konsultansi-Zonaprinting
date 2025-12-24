
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useShop } from "@/providers/ShopProvider";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, Users, DollarSign, Package, AlertCircle, Lightbulb } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"];

const AdminAnalyticsPage = () => {
  const { orders, getProductPerformance } = useShop();

  const performance = useMemo(() => getProductPerformance(), [getProductPerformance]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = orders.length > 0 ? Math.round(revenue / orders.length) : 0;

  const topByRevenue = [...performance].sort((a, b) => b.revenue - a.revenue)[0];
  const topByVolume = [...performance].sort((a, b) => b.totalSold - a.totalSold)[0];

  // Mock monthly data for chart (since we might not have real historical data in this prototype)
  const monthlyData = [
    { name: "Mei", total: revenue * 0.1 },
    { name: "Jun", total: revenue * 0.15 },
    { name: "Jul", total: revenue * 0.12 },
    { name: "Agu", total: revenue * 0.25 },
    { name: "Sep", total: revenue * 0.18 },
    { name: "Okt", total: revenue * 0.2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kinerja Bisnis</h1>
        <p className="text-muted-foreground mt-1">
          Analisis mendalam tentang penjualan, produk, dan peluang pertumbuhan.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {revenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+15 pesanan minggu ini</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {avgOrder.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground mt-1">Nilai per keranjang</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Terlaris</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={topByVolume?.name}>
              {topByVolume?.name ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topByVolume?.totalSold ?? 0} unit terjual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Trend - Area Chart */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Tren Pendapatan</CardTitle>
            <CardDescription>Grafik pendapatan dalam 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <Tooltip
                    formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Dist - Pie Chart */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Distribusi Revenue</CardTitle>
            <CardDescription>Kontribusi setiap produk terhadap total pendapatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="revenue"
                    data={performance}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    fill="#8884d8"
                  >
                    {performance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Section */}
      <h2 className="text-xl font-bold tracking-tight mt-8 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" /> Insight & Rekomendasi Cerdas
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Insight 1 */}
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-base text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Strategi Upselling
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            Rata-rata order Anda adalah <b>Rp {avgOrder.toLocaleString("id-ID")}</b>. Coba buat paket
            bundling seharga <b>Rp {(avgOrder * 1.2).toLocaleString("id-ID")}</b> (naik 20%) untuk meningkatkan nilai transaksi.
          </CardContent>
        </Card>

        {/* Insight 2 */}
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-slate-900 dark:to-slate-950 border-green-200 dark:border-green-900">
          <CardHeader>
            <CardTitle className="text-base text-green-700 dark:text-green-300 flex items-center gap-2">
              <Users className="w-4 h-4" /> Fokus Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            {topByRevenue ? (
              <span>
                Produk <b>{topByRevenue.name}</b> menyumbang revenue terbesar. Pastikan stok selalu aman dan
                berikan reward untuk pelanggan yang membeli item ini.
              </span>
            ) : (
              "Tingkatkan interaksi dengan pelanggan melalui WhatsApp untuk membangun loyalitas."
            )}
          </CardContent>
        </Card>

        {/* Insight 3 */}
        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 border-purple-200 dark:border-purple-900">
          <CardHeader>
            <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Optimasi Stok
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            {topByVolume ? (
              <span>
                Produk <b>{topByVolume.name}</b> sangat laris secara volume. Pertimbangkan untuk menaikkan harga sedikit
                atau menjadikannya 'loss leader' diskon untuk menarik massa.
              </span>
            ) : (
              "Analisis stok barang yang jarang terjual dan buat promo clearance sale."
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
