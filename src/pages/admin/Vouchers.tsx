import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const AdminVouchersPage = () => {
  const { users, upsertVoucher, deleteVoucher } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", code: "", amount: 0 });

  const handleSave = () => {
    if (!form.email || !form.code || form.amount <= 0) {
      toast({ title: "Lengkapi data", description: "Isi email, kode, dan nominal voucher.", variant: "destructive" });
      return;
    }
    const res = upsertVoucher(form.email.trim(), form.code.trim().toUpperCase(), form.amount);
    if (res.success) {
      toast({ title: "Voucher diperbarui", description: `Kode ${form.code} diset untuk ${form.email}` });
      setForm({ email: "", code: "", amount: 0 });
    } else {
      toast({ title: "Gagal", description: res.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Voucher</p>
        <h1 className="text-3xl font-bold">Kelola Voucher Pengguna</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah / Perbarui Voucher</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Input
              placeholder="Email user"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Kode voucher"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Nominal (Rp)"
              value={form.amount || ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            />
          </div>
          <Button className="md:col-span-3 bg-amber-500 text-white hover:bg-amber-400" onClick={handleSave}>
            Simpan Voucher
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna & Voucher</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Voucher</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'admin').map((u) => (
                <tr key={u.id} className="border-b last:border-0 align-top">
                  <td className="py-3 pr-4 font-semibold whitespace-nowrap">{u.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{u.email}</td>
                  <td className="py-3 pr-4">
                    {(u.vouchers ?? []).length ? (
                      <div className="flex flex-col gap-2">
                        {u.vouchers?.map((v) => (
                          <div
                            key={v.code}
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${v.used ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-700"
                              }`}
                          >
                            <span>
                              {v.code} · Rp {v.amount.toLocaleString("id-ID")} {v.used ? "(used)" : ""}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={() => {
                                if (!window.confirm(`Hapus voucher ${v.code} untuk ${u.email}?`)) return;
                                const res = deleteVoucher(u.email, v.code);
                                if (res.success) {
                                  toast({ title: "Voucher dihapus" });
                                } else {
                                  toast({ title: "Gagal", description: res.message, variant: "destructive" });
                                }
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Belum ada voucher</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            email: u.email,
                            code: f.code || "WELCOME25",
                          }))
                        }
                      >
                        Isi form dari user ini
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVouchersPage;

