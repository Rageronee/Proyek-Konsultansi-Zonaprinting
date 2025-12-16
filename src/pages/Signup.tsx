import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup(form);
    if (!result.success) {
      toast({ title: "Signup gagal", description: result.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pendaftaran berhasil", description: "Anda sudah masuk sebagai user." });
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Daftar</CardTitle>
          <p className="text-sm text-muted-foreground">Buat akun untuk memesan dan memantau pesanan.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input placeholder="Nama lengkap" value={form.name} onChange={onChange("name")} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={onChange("email")} required />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange("password")}
              required
            />
            <Button type="submit" className="w-full">
              Daftar
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;

