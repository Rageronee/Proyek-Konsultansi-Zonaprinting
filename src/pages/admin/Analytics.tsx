
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useShop } from "@/providers/ShopProvider";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, Users, DollarSign, Package, AlertCircle, Lightbulb, Calendar, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays, isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"];

const AdminAnalyticsPage = () => {
  const { orders, getProductPerformance, reviews, products, questionnaires } = useShop();
  const [timeRange, setTimeRange] = useState<"6m" | "1y" | "30d" | "custom">("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
      return orders.filter(o => isWithinInterval(new Date(o.createdAt), { start: startOfDay(dateRange.from!), end: endOfDay(dateRange.to!) }));
    }

    let daysToSubtract = 180;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "1y") daysToSubtract = 365;

    const limitDate = subDays(startOfDay(now), daysToSubtract);
    return orders.filter(o => new Date(o.createdAt) >= limitDate);
  }, [orders, timeRange, dateRange]);

  const performance = useMemo(() => {
    // Recalculate performance based on filtered orders
    const perf: Record<string, any> = {};
    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const current = perf[item.productId] ?? {
          productId: item.productId,
          name: item.name,
          totalSold: 0,
          revenue: 0,
        };
        current.totalSold += item.quantity;
        current.revenue += item.quantity * item.price;
        perf[item.productId] = current;
      });
    });
    return Object.values(perf);
  }, [filteredOrders]);

  const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = filteredOrders.length > 0 ? Math.round(revenue / filteredOrders.length) : 0;

  const topByRevenue = [...performance].sort((a, b) => b.revenue - a.revenue)[0];
  const topByVolume = [...performance].sort((a, b) => b.totalSold - a.totalSold)[0];

  // Aggregate daily/monthly revenue based on filtered orders
  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    const now = new Date();
    let format = "month";
    let iterations = 6;

    if (timeRange === "30d" || timeRange === "custom") {
      format = "day";
      if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
        const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
        iterations = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      } else {
        iterations = 30;
      }
    } else if (timeRange === "1y") {
      iterations = 12;
      format = "month";
    }

    // Initialize labels
    for (let i = iterations - 1; i >= 0; i--) {
      const d = new Date();
      if (timeRange === "custom" && dateRange?.to) {
        d.setTime(dateRange.to.getTime());
      }

      if (format === "month") {
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString("id-ID", { month: "short" });
        if (!data[label]) data[label] = 0;
      } else {
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        if (!data[label]) data[label] = 0;
      }
    }

    filteredOrders.forEach(order => {
      const d = new Date(order.createdAt);
      let label = "";
      if (format === "month") {
        label = d.toLocaleDateString("id-ID", { month: "short" });
      } else {
        label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      }

      if (data[label] !== undefined) {
        data[label] += order.total;
      }
    });

    return Object.keys(data).map(key => ({
      name: key,
      total: data[key]
    }));
  }, [filteredOrders, timeRange, dateRange]);

  // Survey Data Processing
  const surveyData = useMemo(() => {
    const sourceStats: Record<string, number> = {};
    const speedStats: Record<string, number> = {};

    questionnaires.forEach(q => {
      // Source
      const source = q.answers["source"] || "Lainnya";
      sourceStats[source] = (sourceStats[source] || 0) + 1;

      // Speed
      const speed = q.answers["speed"] || "Netral";
      speedStats[speed] = (speedStats[speed] || 0) + 1;
    });

    const speedMap: Record<string, string> = {
      very_fast: "Sangat Cepat",
      fast: "Cepat",
      normal: "Biasa",
      slow: "Lambat"
    };

    const sourceData = Object.keys(sourceStats).map(key => {
      let name = key;
      if (name === "instagram") name = "Instagram";
      if (name === "friend") name = "Teman";
      if (name === "search") name = "Google";
      if (name === "other") name = "Lainnya";
      return { name, value: sourceStats[key] };
    });

    const speedData = Object.keys(speedStats).map(key => ({
      name: speedMap[key] || key,
      value: speedStats[key]
    }));

    return { sourceData, speedData };
  }, [questionnaires]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kinerja Bisnis</h1>
          <p className="text-muted-foreground mt-1">
            Analisis mendalam tentang penjualan, produk, dan peluang pertumbuhan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Rentang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="6m">6 Bulan Terakhir</SelectItem>
              <SelectItem value="1y">Setahun Terakhir</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>
          {timeRange === "custom" && (
            <DateRangePicker
              date={dateRange}
              setDate={setDateRange}
              className="w-[260px]"
            />
          )}
        </div>
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
            <p className="text-xs text-muted-foreground mt-1">Dalam periode ini</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Transaksi berhasil</p>
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
            <CardDescription>
              Grafik pendapatan visualisasi data penjualan
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
        <Card className="col-span-4 lg:col-span-3 shadow-sm mt-4 md:mt-0">
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


      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            Evaluasi Pelanggan
          </h2>
          <Dialog open={showAllReviews} onOpenChange={setShowAllReviews}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Lihat Semua Ulasan</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Semua Ulasan Pelanggan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {reviews.length === 0 ? <p>Belum ada ulasan.</p> : reviews.map(review => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{review.user_name || "Pelanggan"}</p>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Order #{review.order_id.slice(0, 8)}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Rating Summary */}
          <Card className="col-span-2 bg-slate-900 text-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg opacity-90">Rating Toko</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-6xl font-black text-amber-400">
                {(() => {
                  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
                  const avg = reviews.length ? (total / reviews.length).toFixed(1) : "0.0";
                  return avg;
                })()}
              </div>
              <div className="flex gap-1 mt-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
                  const avg = reviews.length ? total / reviews.length : 0;
                  return (
                    <span key={star} className={`text-xl ${star <= Math.round(avg) ? "text-amber-400" : "text-slate-600"}`}>★</span>
                  )
                })}
              </div>
              <p className="text-sm text-slate-400">{reviews.length} Ulasan Total</p>
            </CardContent>
          </Card>

          {/* Recent Reviews List (Preview Limited to 3) */}
          <Card className="col-span-5 shadow-sm">
            <CardHeader>
              <CardTitle>Ulasan Terkini</CardTitle>
              <CardDescription>Apa kata pelanggan tentang layanan Zonaprint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada ulasan masuk.</p>
                ) : (
                  reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{review.user_name || "Pelanggan"}</p>
                          <div className="flex text-amber-400 text-xs">
                            {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Order #{review.order_id.slice(0, 8)}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Survey Visualization Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 mt-8">
          <MessageSquare className="w-5 h-5 text-pink-500" /> Hasil Survey Pelanggan
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Source Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Sumber Informasi</CardTitle>
              <CardDescription>Dari mana pelanggan mengetahui Zonaprint?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={surveyData.sourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {surveyData.sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Kepuasan Kecepatan</CardTitle>
              <CardDescription>Respon terhadap kecepatan layanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={surveyData.speedData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20}>
                      <div />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Survey Comments with Dialog */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Umpan Balik</CardTitle>
                <CardDescription>Saran pelanggan</CardDescription>
              </div>
              <Dialog open={showAllFeedback} onOpenChange={setShowAllFeedback}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">Lihat Semua</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Semua Umpan Balik & Saran</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {questionnaires.filter(q => q.answers.feedback).length === 0 ? <p>Belum ada saran.</p> :
                      questionnaires.filter(q => q.answers.feedback).map((q, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-sm border border-slate-100 dark:border-slate-800">
                          <p className="italic text-slate-700 dark:text-slate-300">"{q.answers.feedback}"</p>
                          <p className="text-[10px] text-muted-foreground mt-1 text-right">- Order #{q.order_id.substring(0, 6)}</p>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {questionnaires.filter(q => q.answers.feedback).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada saran.</p>
              ) : (
                questionnaires.filter(q => q.answers.feedback).slice(0, 3).map((q, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm border border-slate-100 dark:border-slate-800">
                    <p className="italic text-slate-700 dark:text-slate-300 line-clamp-3">"{q.answers.feedback}"</p>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">- Order #{q.order_id.substring(0, 6)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
