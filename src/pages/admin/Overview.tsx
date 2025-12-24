import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/providers/ShopProvider";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { OrderStatus } from "@/types";

const AdminOverviewPage = () => {
  const { orders, getProductPerformance, isLoading } = useShop();

  const stats = useMemo(() => {
    const safeOrders = orders || [];
    const totalRevenue = safeOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = safeOrders.length;
    const totalItems = safeOrders.reduce((sum, order) => sum + (order.items || []).reduce((s, i) => s + (i.quantity || 0), 0), 0);
    return { totalRevenue, totalOrders, totalItems };
  }, [orders]);

  const topProducts = useMemo(() => getProductPerformance().slice(0, 5), [getProductPerformance]);

  const statusCounts = useMemo(() => {
    const base: Record<OrderStatus, number> = { baru: 0, diproses: 0, produksi: 0, dikirim: 0, selesai: 0 };
    orders.forEach((o) => {
      base[o.status] = (base[o.status] ?? 0) + 1;
    });
    return base;
  }, [orders]);

  const topCustomers = useMemo(() => {
    const aggregated: Record<
      string,
      { userId: string; name: string; email: string; total: number; count: number }
    > = {};

    orders.forEach((o) => {
      const key = o.userId;
      if (!aggregated[key]) {
        aggregated[key] = {
          userId: o.userId,
          name: o.userName || o.userId,
          email: o.userEmail,
          total: 0,
          count: 0,
        };
      }
      aggregated[key].total += o.total;
      aggregated[key].count += 1;
    });

    return Object.values(aggregated)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-bold">Ringkasan Penjualan</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalOrders}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Item Terjual</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalItems}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Produk</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} interval={0} />
                <Tooltip
                  formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pelanggan Aktif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!topCustomers.length && (
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi. Pelanggan akan muncul di sini setelah ada pesanan.
              </p>
            )}
            {topCustomers.map((c) => (
              <div key={c.userId} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email || "-"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Pesanan</p>
                  <p className="font-semibold">{c.count}x</p>
                  <p className="text-xs text-muted-foreground">
                    Rp {c.total.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Badge key={status} variant="secondary" className="text-sm">
              {status} : {count}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;

