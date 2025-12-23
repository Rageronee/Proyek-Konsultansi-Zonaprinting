import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useShop } from "@/providers/ShopProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { WELCOME_VOUCHER_VALUE_CONST } from "@/components/WelcomeVoucherDialog";

const CheckoutPage = () => {
  const { cart, products, getCartTotal, orders, checkout } = useShop();
  const { user, markWelcomeVoucherUsed, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState("WELCOME25");
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [branch, setBranch] = useState<"purwakarta" | "wanayasa">("purwakarta");
  const [sending, setSending] = useState<"idle" | "printing" | "redirecting">("idle");
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
        .filter(Boolean) as Array<{
          productId: string;
          quantity: number;
          product: (typeof products)[number];
          selectedOption?: string;
          note?: string;
        }>,
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
  const grandTotal = Math.max(subtotal - voucherDiscount, 0);

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

  const handleWhatsappOrder = () => {
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

    // Save order to database first
    checkout(user.id, grandTotal, {
      userName: form.name || user.name,
      userEmail: form.email || user.email,
      userPhone: form.phone,
      userAddress: form.address,
      paymentMethod: "manual", // Default for WA orders
    });

    const itemsText = cartWithProduct
      .map((item, idx) => {
        const baseName = item.product.name;
        const opt = item.selectedOption ? ` "${item.selectedOption}"` : "";
        const lineHeader = `${String.fromCharCode(65 + idx)}. ${baseName}${opt}`;
        const qtyPrice = `   Jumlah ${item.quantity} • Rp ${(item.product.price * item.quantity).toLocaleString(
          "id-ID",
        )}`;
        const noteLine = item.note ? `   Catatan: ${item.note}` : null;
        return [lineHeader, qtyPrice, noteLine].filter(Boolean).join("\n");
      })
      .join("\n");
    const message = [
      "Halo ZonaPrint,",
      `Saya ingin memesan (${branch === "purwakarta" ? "Cabang Purwakarta" : "Cabang Wanayasa"}):`,
      itemsText,
      "",
      `Subtotal: Rp ${subtotal.toLocaleString("id-ID")}`,
      `Voucher: Rp ${voucherDiscount.toLocaleString("id-ID")}`,
      `Total: Rp ${grandTotal.toLocaleString("id-ID")}`,
      "",
      `Nama: ${form.name || user.name}`,
      `Email: ${form.email || user.email}`,
      `Telepon: ${form.phone || "-"}`,
      `Alamat: ${form.address || "-"}`,
      "",
      "Saya akan mengirimkan file desain (PNG, PDF, dan format lainnya) melalui chat ini.",
    ].join("\n");

    const whatsappNumber = branch === "purwakarta" ? "628118894690" : "6282246907899";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Scroll to top to ensure modal is visible (just in case)
    window.scrollTo({ top: 0, behavior: "smooth" });

    setSending("printing");

    // Delay 4 seconds before redirecting to allow animation to play
    setTimeout(() => {
      setSending("redirecting");
      window.open(url, "_blank");

      // Reset state after a bit
      setTimeout(() => {
        setSending("idle");
        // Optional: Navigate to home or Success page?
        // User didn't ask for redirect after, but usually good practice.
        toast({ title: "Pesanan Berhasil", description: "Status: BARU. Menunggu verifikasi admin." });
        navigate("/profile");
      }, 2000);
    }, 4000); // 4 seconds delay
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
    <div className="container mx-auto px-4 lg:px-8 py-12 grid gap-8 lg:grid-cols-[2fr_1fr] relative">
      {sending !== "idle" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-[320px] md:w-[420px] bg-slate-950 text-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-primary/40"
          >
            {/* Printer head */}
            <div className="bg-gradient-to-r from-primary via-fuchsia-500 to-amber-400 px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-950/80 flex items-center justify-center shadow-inner">
                <span className="w-5 h-1 rounded-full bg-amber-300 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Sedang mencetak struk pesanan Anda...</p>
                <p className="text-xs text-slate-100/80">
                  Detail produk dan data pengiriman dirapikan sebelum dikirim ke WhatsApp.
                </p>
              </div>
            </div>

            {/* Paper coming out */}
            <div className="px-6 py-4 bg-slate-900/90 flex justify-center">
              <div className="relative w-full max-w-sm h-40 overflow-hidden flex items-start justify-center">
                <motion.div
                  key={sending}
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl shadow-md px-4 py-3 text-xs font-mono"
                >
                  <div className="flex justify-between items-center border-b border-dashed border-slate-300 pb-1 mb-1.5">
                    <span className="font-semibold">ZONAPRINT</span>
                    <span className="text-[10px] text-slate-500">
                      {branch === "purwakarta" ? "Purwakarta" : "Wanayasa"}
                    </span>
                  </div>
                  <div className="space-y-0.5 max-h-16 overflow-hidden">
                    {cartWithProduct.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex justify-between gap-2">
                        <span className="truncate">{item.product.name}</span>
                        <span>
                          x{item.quantity} • Rp{" "}
                          {(item.product.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                    {cartWithProduct.length > 3 && (
                      <p className="text-slate-500 text-[10px]">
                        +{cartWithProduct.length - 3} item lainnya...
                      </p>
                    )}
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-dashed border-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Total</span>
                      <span className="font-semibold">
                        Rp {grandTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500 text-center">
                    File desain akan dikirim melalui chat WhatsApp setelah struk ini selesai.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Progress line */}
            <div className="px-6 pb-4 bg-slate-900/90">
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 overflow-hidden rounded-full">
                <motion.div
                  key={`${sending}-bar`}
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{
                    duration: 1.6,
                    ease: "easeInOut",
                    repeat: sending === "printing" ? Infinity : 0,
                  }}
                  className="h-full w-full bg-gradient-to-r from-primary via-amber-400 to-primary"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400 text-center">
                {sending === "printing"
                  ? "Sedang menyiapkan detail pesanan ke WhatsApp..."
                  : "Membuka WhatsApp. Jika belum muncul, cek jendela atau tab baru di browser Anda."}
              </p>
            </div>
          </motion.div>
        </div>
      )}
      <Card className="bg-background/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
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
          {/* Pilih lokasi cabang untuk WhatsApp */}
          <div className="grid gap-3 mt-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Pilih Lokasi Pemesanan (WhatsApp)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setBranch("purwakarta")}
                className={`w-full rounded-2xl border px-4 py-3 flex items-center gap-3 text-left transition-all duration-200
                  ${branch === "purwakarta"
                    ? "border-primary bg-gradient-to-r from-primary to-primary-deep text-primary-foreground shadow-glow"
                    : "border-slate-200/70 dark:border-slate-700 bg-background/80 hover:bg-primary/5"
                  }`}
              >
                <div className="w-9 h-9 rounded-full bg-amber-400/90 flex items-center justify-center text-slate-900 text-xs font-bold shadow-md">
                  PWK
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Purwakarta</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-200">+62 811-8894-690</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-300">
                    Dekat pusat kota, cocok untuk pesanan cepat.
                  </span>
                </div>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setBranch("wanayasa")}
                className={`w-full rounded-2xl border px-4 py-3 flex items-center gap-3 text-left transition-all duration-200
                  ${branch === "wanayasa"
                    ? "border-amber-400 bg-gradient-to-r from-amber-300 to-amber-500 text-slate-900 shadow-glow"
                    : "border-slate-200/70 dark:border-slate-700 bg-background/80 hover:bg-amber-50/10"
                  }`}
              >
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">
                  WNS
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Wanayasa</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-900">+62 822-4690-7899</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-800">
                    Lokasi strategis untuk area Wanayasa dan sekitarnya.
                  </span>
                </div>
              </motion.button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Semua pemesanan diselesaikan lewat WhatsApp sesuai cabang yang Anda pilih.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="secondary"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-white"
            onClick={handleWhatsappOrder}
          >
            Pesan Sekarang!
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cartWithProduct.map((item, idx) => (
            <div key={`${item.productId}-${idx}`} className="space-y-0.5 text-sm">
              <div className="flex justify-between">
                <span>
                  {item.product.name}
                  {item.selectedOption && <span className="text-xs text-muted-foreground"> ({item.selectedOption})</span>}
                </span>
                <span>Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Jumlah: {item.quantity}</span>
                {item.note && <span className="truncate max-w-[60%]">Catatan: {item.note}</span>}
              </div>
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
          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Harga di atas merupakan estimasi. Nominal akhir dapat berubah menyesuaikan jenis produk, ukuran,
            finishing, dan tingkat kesulitan setelah dikonfirmasi bersama admin melalui WhatsApp.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="voucher">Masukkan kode voucher</Label>
            <div className="flex gap-2">
              <Input
                id="voucher"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Masukkan kode"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyVoucher();
                  }
                }}
              />
              <Button
                type="button"
                className="bg-amber-400 text-slate-900 hover:bg-amber-300"
                onClick={handleApplyVoucher}
              >
                Pakai
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;

