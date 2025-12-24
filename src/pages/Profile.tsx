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
import OrderPrint from "@/components/admin/OrderPrint";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionnaireDialog } from "@/components/QuestionnaireDialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  User,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
  FileText,
  Star,
  MessageSquare,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


// Simple Review Dialog
const ReviewDialog = ({ order, open, onOpenChange }: { order: any, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { addReview, reviews } = useShop();
  const { user } = useAuth(); // Need to pass user data

  const existingReview = reviews.find(r => r.order_id === order.id);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [existingReview, open]);

  const handleSubmit = async () => {
    if (!user) return;
    if (existingReview) return; // Prevention

    const result = await addReview({
      orderId: order.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment
    });

    if (result.success) {
      toast({ title: "Terima Kasih!", description: "Ulasan Anda telah ditambahkan." });
      onOpenChange(false);
    } else {
      toast({ title: "Gagal", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingReview ? "Ulasan Produk Anda" : "Beri Ulasan Produk"}</DialogTitle>
          <DialogDescription>
            {existingReview ? "Anda telah mengulas produk dalam pesanan ini." : `Bagaimana kualitas produk dalam pesanan #${order.id.slice(0, 6)}?`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => !existingReview && setRating(star)}
                className={`text-2xl ${star <= rating ? "text-amber-400" : "text-slate-300"} ${existingReview ? "cursor-default" : "cursor-pointer"}`}
                disabled={!!existingReview}
              >
                ★
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Tulis komentar (opsional)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            readOnly={!!existingReview}
            className={existingReview ? "bg-slate-50 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-0" : "dark:bg-slate-900 dark:text-white"}
          />
        </div>
        <DialogFooter>
          {!existingReview && <Button onClick={handleSubmit}>Kirim Ulasan</Button>}
          {existingReview && <Button variant="secondary" onClick={() => onOpenChange(false)}>Tutup</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProfilePage = () => {
  const { user, updateProfile, changePassword, isAdmin } = useAuth();
  const { orders, refresh, questionnaires, addToCart, reviews } = useShop(); // Fetch reviews to check existence
  const navigate = useNavigate();
  const { toast } = useToast();

  // States for Dialogs
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [questionnaireOrder, setQuestionnaireOrder] = useState<any>(null);

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item.productId, item.quantity);
    });
    toast({ title: "Ditambahkan ke Keranjang", description: "Item pesanan telah ditambahkan kembali." });
    navigate("/cart");
  };

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    province: user?.province ?? "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNextPass, setShowNextPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

  // Force refresh on mount to get latest orders
  useEffect(() => {
    refresh();
  }, []);

  const myOrders = useMemo(() => orders.filter((o) => o.userId === user?.id), [orders, user?.id]);

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
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Inject Dialogs */}
      {isPrintOpen && selectedOrder && (
        <OrderPrint order={selectedOrder} onClose={() => setIsPrintOpen(false)} />
      )}
      {selectedOrder && (
        <ReviewDialog order={selectedOrder} open={isReviewOpen} onOpenChange={setIsReviewOpen} />
      )}
      {questionnaireOrder && (
        <QuestionnaireDialog
          open={!!questionnaireOrder}
          onOpenChange={(op) => !op && setQuestionnaireOrder(null)}
          orderId={questionnaireOrder.id}
          userId={user!.id}
        />
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Akun Saya</p>
        <h1 className="text-3xl font-bold">Profil & Riwayat Pesanan</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        {/* Riwayat Pembelian */}
        <Card className="border-blue-200 dark:border-blue-900 shadow-sm overflow-hidden">
          {/* ... Header ... */}
          <CardHeader className="bg-blue-50/50 dark:bg-slate-900/50 border-b border-blue-100 dark:border-blue-900/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="w-5 h-5 text-primary" /> Riwayat Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* ... Table ... */}
            {!myOrders.length && (
              <div className="p-12 text-center text-muted-foreground">
                {/* ... */}
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada transaksi saat ini.</p>
                <Button variant="link" className="mt-2" onClick={() => navigate("/products")}>
                  Mulai Pesan Sekarang
                </Button>
              </div>
            )}
            {myOrders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">ID Order</th>
                      {/* ... other headers ... */}
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                      <th className="px-6 py-4 font-semibold w-[40%]">Item</th>
                      <th className="px-6 py-4 font-semibold">Total</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {myOrders.map((order) => {
                      // ... status logic ...
                      let StatusIcon = Clock;
                      let statusColor = "bg-slate-100 text-slate-700 border-slate-200";

                      switch (order.status) {
                        case "baru":
                          StatusIcon = AlertCircle;
                          statusColor = "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
                          break;
                        case "diproses":
                          StatusIcon = Clock;
                          statusColor = "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
                          break;
                        case "produksi":
                          StatusIcon = Package;
                          statusColor = "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
                          break;
                        case "dikirim":
                          StatusIcon = Truck;
                          statusColor = "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200";
                          break;
                        case "selesai":
                          StatusIcon = CheckCircle;
                          statusColor = "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
                          break;
                      }

                      const hasFilledQuestionnaire = questionnaires?.some(q => q.order_id === order.id);

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}...</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            <div className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                  <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                            Rp {order.total.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`gap-1.5 pl-1.5 pr-2.5 py-0.5 capitalize border shadow-sm ${statusColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 flex flex-col gap-2">
                            {order.status === 'selesai' && (
                              <div className="flex flex-col gap-2">
                                <Button size="sm" variant="ghost" className="h-8 text-xs text-purple-600 dark:text-purple-400 w-full justify-start" onClick={() => handleReorder(order)}>
                                  <ShoppingBag className="w-3 h-3 mr-2" /> Pesan Lagi
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-full justify-between">
                                      Menu Lainnya <ChevronDown className="w-3 h-3 ml-2" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => { setSelectedOrder(order); setIsPrintOpen(true); }}>
                                      <FileText className="w-4 h-4 mr-2" /> Cetak Struk
                                    </DropdownMenuItem>

                                    {reviews.some(r => r.order_id === order.id) ? (
                                      <DropdownMenuItem onClick={() => { setSelectedOrder(order); setIsReviewOpen(true); }}>
                                        <Star className="w-4 h-4 mr-2 text-amber-500" /> Lihat Ulasan
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => { setSelectedOrder(order); setIsReviewOpen(true); }}>
                                        <Star className="w-4 h-4 mr-2" /> Beri Ulasan
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      onClick={() => setQuestionnaireOrder(order)}
                                      disabled={hasFilledQuestionnaire}
                                      className={hasFilledQuestionnaire ? "text-green-600" : ""}
                                    >
                                      {hasFilledQuestionnaire ? (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-2" /> Survey Terisi
                                        </>
                                      ) : (
                                        <>
                                          <MessageSquare className="w-4 h-4 mr-2" /> Isi Survey
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Detail Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {/* Form Fields including Strict Phone Validation */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Nama Lengkap</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Nomor WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setForm({ ...form, phone: val })
                }}
                placeholder="08..."
              />
              <p className="text-[10px] text-muted-foreground">Hanya angka diperbolehkan.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Alamat Lengkap</Label>
              <Input id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Kota / Kabupaten</Label>
              <Input id="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="province" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Provinsi</Label>
              <Input id="province" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[150px]"
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
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security and Voucher Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ganti password Anda secara berkala untuk menjaga keamanan akun.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showCurrentPass ? "text" : "password"}
                    placeholder="Password saat ini"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type={showNextPass ? "text" : "password"}
                    placeholder="Password baru"
                    value={pwForm.next}
                    onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowNextPass(!showNextPass)}
                  >
                    {showNextPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Konfirmasi password baru"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
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
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voucher Saya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(user.vouchers ?? []).map((v) => (
                  <Badge key={v.code} variant={v.used ? "outline" : "secondary"} className={v.used ? "opacity-50" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}>
                    {v.code} {v.used ? "(terpakai)" : ""}
                  </Badge>
                ))}
                {!user.vouchers?.length && <p className="text-sm text-muted-foreground">Belum ada voucher tersedia.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;

