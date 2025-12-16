import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShop } from "@/providers/ShopProvider";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const AdminAnalyticsPage = () => {
  const { orders, getProductPerformance } = useShop();

  const performance = useMemo(() => getProductPerformance(), [getProductPerformance]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

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

