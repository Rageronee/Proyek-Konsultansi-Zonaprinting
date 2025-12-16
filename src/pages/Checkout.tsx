import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useShop } from "@/providers/ShopProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { WELCOME_VOUCHER_VALUE_CONST } from "@/components/WelcomeVoucherDialog";
import { PaymentMethod } from "@/types";

const CheckoutPage = () => {
  const { cart, products, getCartTotal, checkout, orders } = useShop();
  const { user, markWelcomeVoucherUsed, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState("WELCOME25");
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });

  const cartWithProduct = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return { ...item, product };
        })
        .filter(Boolean) as Array<{ productId: string; quantity: number; product: (typeof products)[number] }>,
    [cart, products],
  );

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    });
  }, [user]);

  const subtotal = getCartTotal();
  const voucherDiscount = voucherAmount;
  const taxedSubtotal = Math.max(subtotal - voucherDiscount, 0);
  const tax = taxedSubtotal * 0.11;
  const grandTotal = taxedSubtotal + tax;

  const sendReceiptEmail = (to: string, orderId: string) => {
    const subject = encodeURIComponent(`Receipt Pesanan ${orderId}`);
    const bodyLines = [
      `Terima kasih telah berbelanja di ZONAPRINT.`,
      `Order ID: ${orderId}`,
      `Nama: ${form.name || user?.name}`,
      `Email: ${form.email || user?.email}`,
      `Telepon: ${form.phone || "-"}`,
      `Alamat: ${form.address || "-"}`,
      "",
      "Detail Pesanan:",
      ...cartWithProduct.map(
        (item) =>
          `- ${item.product.name} x ${item.quantity} = Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}`,
      ),
      "",
      `Subtotal: Rp ${subtotal.toLocaleString("id-ID")}`,
      `Voucher: Rp ${voucherDiscount.toLocaleString("id-ID")}`,
      `PPN 11%: Rp ${tax.toLocaleString("id-ID")}`,
      `Total: Rp ${grandTotal.toLocaleString("id-ID")}`,
    ];
    window.open(`mailto:${to}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`, "_blank");
  };

  const handleApplyVoucher = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const code = voucherCode.trim().toUpperCase();
    const voucher = user.vouchers?.find((v) => v.code.toUpperCase() === code);
    if (!voucher) {
      toast({ title: "Voucher tidak valid", description: "Kode tidak terdaftar untuk akun ini.", variant: "destructive" });
      return;
    }
    if (voucher.used) {
      toast({ title: "Voucher sudah digunakan", variant: "destructive" });
      return;
    }
    setVoucherAmount(voucher.amount);
    updateProfile({
      vouchers: user.vouchers?.map((v) => (v.code.toUpperCase() === code ? { ...v, used: true } : v)),
      welcomeVoucherUsed: code === "WELCOME25" ? true : user.welcomeVoucherUsed,
    });
    if (code === "WELCOME25") {
      markWelcomeVoucherUsed();
    }
    toast({ title: "Voucher diterapkan", description: `Potongan Rp ${voucher.amount.toLocaleString("id-ID")}` });
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!form.name || !form.email || !form.address || !form.phone) {
      toast({
        title: "Data pengiriman belum lengkap",
        description: "Nama, email, nomor telepon, dan alamat lengkap wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
    });
    const result = checkout(user.id, grandTotal, {
      userName: form.name || user.name,
      userEmail: form.email || user.email,
      userPhone: form.phone,
      userAddress: form.address,
      paymentMethod,
    });
    if (result.success) {
      toast({ title: "Pesanan dibuat", description: "Transaksi tercatat di dashboard admin." });
      if (user.email) {
        sendReceiptEmail(user.email, result?.orderId ?? "order");
      }
      sendReceiptEmail("muhammadafnanrisandi@gmail.com", result?.orderId ?? "order");
      navigate("/products");
    } else {
      toast({ title: "Gagal checkout", description: result.message, variant: "destructive" });
    }
  };

  const handleWhatsappOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const itemsText = cartWithProduct
      .map(
        (item) =>
          `- ${item.product.name} x ${item.quantity} = Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}`,
      )
      .join("\n");
    const message = [
      "Halo ZonaPrint,",
      "Saya ingin memesan:",
      itemsText,
      "",
      `Subtotal: Rp ${subtotal.toLocaleString("id-ID")}`,
      `Voucher: Rp ${voucherDiscount.toLocaleString("id-ID")}`,
      `PPN 11%: Rp ${tax.toLocaleString("id-ID")}`,
      `Total: Rp ${grandTotal.toLocaleString("id-ID")}`,
      "",
      `Nama: ${form.name || user.name}`,
      `Email: ${form.email || user.email}`,
      `Telepon: ${form.phone || "-"}`,
      `Alamat: ${form.address || "-"}`,
    ].join("\n");
    const whatsappNumber = "6281234567890";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!cartWithProduct.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 text-center">
          <CardTitle>Keranjang kosong</CardTitle>
          <Button className="mt-4" onClick={() => navigate("/products")}>
            Lihat Produk
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Data Pengiriman</CardTitle>
          <p className="text-sm text-muted-foreground">
            Masukkan detail penerima agar pesanan dapat diproses. Data ini hanya disimpan di sisi klien.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Nama penerima</Label>
            <Input placeholder="Nama penerima" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Nomor telepon</Label>
            <Input placeholder="Nomor telepon" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Alamat lengkap</Label>
            <Input placeholder="Alamat lengkap" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Metode pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)} className="grid gap-2">
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="qris" id="qris" />
                <Label htmlFor="qris" className="flex-1">QRIS (all payment apps)</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="bca" id="bca" />
                <Label htmlFor="bca" className="flex-1">Transfer BCA</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="mandiri" id="mandiri" />
                <Label htmlFor="mandiri" className="flex-1">Transfer Mandiri</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="bri" id="bri" />
                <Label htmlFor="bri" className="flex-1">Transfer BRI</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleCheckout} className="w-full">Buat Pesanan</Button>
          <Button variant="secondary" className="w-full" onClick={handleWhatsappOrder}>
            Pesan via WhatsApp
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cartWithProduct.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Voucher</span>
            <span className={voucherDiscount ? "text-green-600" : ""}>
              - Rp {voucherDiscount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>PPN 11%</span>
            <span>Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="voucher">Masukkan kode voucher</Label>
            <div className="flex gap-2">
              <Input id="voucher" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Masukkan kode" />
              <Button type="button" onClick={handleApplyVoucher}>Pakai</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Pesanan Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.filter((o) => o.userId === user.id).map((order) => {
              const progressMap: Record<string, number> = {
                baru: 20,
                diproses: 40,
                produksi: 60,
                dikirim: 85,
                selesai: 100,
              };
              const pct = progressMap[order.status] ?? 20;
              return (
                <div key={order.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Order {order.id}</span>
                    <span className="text-muted-foreground capitalize">{order.status}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
            {!orders.filter((o) => o.userId === user.id).length && (
              <p className="text-sm text-muted-foreground">Belum ada pesanan. Checkout untuk melihat progres.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckoutPage;

