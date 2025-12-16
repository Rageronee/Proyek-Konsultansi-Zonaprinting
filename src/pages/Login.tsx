import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.success) {
      toast({ title: "Login gagal", description: result.message, variant: "destructive" });
      return;
    }
    const redirect = (location.state as { from?: string })?.from ?? "/";
    navigate(redirect);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
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
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
    </div>
  );
};

export default LoginPage;

