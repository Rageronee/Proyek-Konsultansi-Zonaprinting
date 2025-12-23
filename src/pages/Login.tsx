import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/main_logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = login(email, password);
    if (!result.success) {
      toast({ title: "Login gagal", description: result.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Jika admin demo, arahkan ke dashboard admin secara default
    const isAdminDemo = email === "admin@zonaprint.com";
    const redirectState = (location.state as { from?: string })?.from;
    const redirect =
      redirectState ?? (isAdminDemo ? "/admin" : "/");
    setTimeout(() => {
      navigate(redirect);
    }, 500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-4 flex items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <div>
              <p className="font-semibold text-amber-300">Memproses login...</p>
              <p className="text-xs text-slate-300">Sebentar, kami sedang menyiapkan dashboard Anda.</p>
            </div>
          </div>
        </div>
      )}
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
            <CardTitle className="text-2xl">Masuk</CardTitle>
            <p className="text-sm text-muted-foreground">Gunakan akun pelanggan atau admin demo.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/signup" className="text-primary underline">
                Daftar
              </Link>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo: admin@zonaprint.com / admin123 atau user@zonaprint.com / user123
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

