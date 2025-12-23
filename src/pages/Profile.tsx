import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useShop } from "@/providers/ShopProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user, updateProfile, changePassword, isAdmin } = useAuth();
  const { orders } = useShop();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    province: user?.province ?? "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      city: user?.city ?? "",
      province: user?.province ?? "",
    });
  }, [user]);

  const myOrders = useMemo(() => orders.filter((o) => o.userId === user?.id), [orders, user?.id]);

  const progressMap: Record<string, number> = {
    baru: 20,
    diproses: 40,
    produksi: 60,
    dikirim: 85,
    selesai: 100,
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 text-center space-y-3">
          <CardTitle>Masuk untuk melihat profil</CardTitle>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </Card>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 text-center space-y-3">
          <CardTitle>Profil tidak tersedia untuk admin</CardTitle>
          <p className="text-muted-foreground">Gunakan dashboard untuk mengelola data.</p>
          <Button onClick={() => navigate("/admin")}>Ke Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Akun</p>
        <h1 className="text-3xl font-bold">Profil & Riwayat</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Detail Profil</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              { label: "Nama", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Nomor telepon", key: "phone", type: "tel" },
              { label: "Alamat", key: "address", type: "text" },
              { label: "Kota", key: "city", type: "text" },
              { label: "Provinsi", key: "province", type: "text" },
            ].map((field) => (
              <div className="grid gap-2" key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-amber-500 text-white hover:bg-amber-400"
                type="button"
                onClick={async () => {
                  await updateProfile(form);
                  toast({
                    title: "Profil Diperbarui",
                    description: "Data profil Anda berhasil disimpan.",
                    className: "bg-green-600 text-white border-none",
                  });
                }}
              >
                Simpan Profil
              </Button>

            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ganti password Anda secara berkala untuk menjaga keamanan akun.
              </p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password saat ini"
                  value={pwForm.current}
                  onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="Password baru"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                />
                <Button
                  type="button"
                  className="w-full bg-amber-500 text-white hover:bg-amber-400"
                  onClick={() => {
                    if (pwForm.next !== pwForm.confirm) {
                      toast({ title: "Konfirmasi tidak sama", variant: "destructive" });
                      return;
                    }
                    const result = changePassword(pwForm.current, pwForm.next);
                    if (result.success) {
                      toast({ title: "Password diperbarui" });
                      setPwForm({ current: "", next: "", confirm: "" });
                    } else {
                      toast({ title: "Gagal", description: result.message, variant: "destructive" });
                    }
                  }}
                >
                  Simpan Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voucher & Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Voucher tersimpan</p>
                <div className="flex flex-wrap gap-2">
                  {(user.vouchers ?? []).map((v) => (
                    <Badge key={v.code} variant={v.used ? "outline" : "secondary"}>
                      {v.code} {v.used ? "(terpakai)" : ""}
                    </Badge>
                  ))}
                  {!user.vouchers?.length && <p className="text-sm text-muted-foreground">Belum ada voucher.</p>}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ringkasan pesanan terakhir</p>
                {myOrders.slice(0, 1).map((order) => {
                  const pct = progressMap[order.status] ?? 20;
                  return (
                    <div key={order.id} className="space-y-1 rounded-md border p-3">
                      <div className="flex justify-between text-sm">
                        <span>Order {order.id}</span>
                        <Badge variant="secondary" className="capitalize">
                          {order.status}
                        </Badge>
                      </div>
                      <Progress value={pct} />
                      <p className="text-xs text-muted-foreground">
                        Total Rp {order.total.toLocaleString("id-ID")} · {new Date(order.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                  );
                })}
                {!myOrders.length && <p className="text-sm text-muted-foreground">Belum ada pesanan tercatat.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembelian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          {!myOrders.length && <p className="text-sm text-muted-foreground">Belum ada transaksi. Mulai belanja untuk melihat riwayat.</p>}
          {myOrders.length > 0 && (
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2">ID</th>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Item</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs">{order.id}</td>
                    <td className="py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleString("id-ID")}</td>
                    <td className="py-3 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.productId}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 font-semibold">Rp {order.total.toLocaleString("id-ID")}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

