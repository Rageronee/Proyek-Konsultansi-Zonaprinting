import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/main_logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Validasi Gagal", description: "Konfirmasi password tidak cocok.", variant: "destructive" });
      return;
    }
    const result = await signup(form); // signup is async now
    if (!result.success) {
      toast({ title: "Signup gagal", description: result.message, variant: "destructive" });
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      toast({ title: "Pendaftaran berhasil", description: "Anda otomatis masuk." });
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-t-4 border-t-primary shadow-xl">
          <CardHeader className="space-y-2 text-center pb-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <img src={logo} alt="ZonaPrint" className="h-16 object-contain" />
            </motion.div>
            <CardTitle className="text-2xl">{success ? "Berhasil!" : "Daftar"}</CardTitle>
            {!success && <p className="text-sm text-muted-foreground">Buat akun untuk memesan dan memantau pesanan.</p>}
          </CardHeader>
          <CardContent>
            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-center text-slate-600 font-medium">Akun berhasil dibuat!</p>
                <p className="text-xs text-muted-foreground">Mengalihkan ke beranda...</p>
              </motion.div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Nama lengkap" value={form.name} onChange={onChange("name")} required />
                <Input type="email" placeholder="Email" value={form.email} onChange={onChange("email")} required />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={onChange("password")}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password"
                  value={form.confirmPassword}
                  onChange={onChange("confirmPassword")}
                  required
                />
                <Button type="submit" className="w-full">
                  Daftar
                </Button>
              </form>
            )}
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary underline">
                Masuk
              </Link>
            </p>
          </CardContent>

        </Card>
      </motion.div>
    </div >
  );
};

export default SignupPage;

