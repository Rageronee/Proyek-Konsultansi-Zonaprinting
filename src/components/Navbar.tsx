import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Moon, ShoppingCart, Sun, Upload, UserCircle, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-zonaprint.png";
import { useAuth } from "@/providers/AuthProvider";
import { useShop } from "@/providers/ShopProvider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("zp-theme") as "light" | "dark") || "light",
  );
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("zp-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const menuItems = [
    { name: "Home", to: "/" },
    { name: "Produk", to: "/products" },
    { name: "Tentang", to: "/about" },
    { name: "Kontak", to: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-background/80 dark:bg-slate-950/80"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center"
            >
              <img src={logo} alt="ZONAPRINT" className="h-10 md:h-12" />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-foreground hover:text-primary transition-colors duration-300 font-medium ${
                      isActive ? "text-primary" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-foreground hover:text-primary transition-colors font-medium ${isActive ? "text-primary" : ""}`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-slate-200/70 dark:border-slate-700"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>
            {!isAdmin && (
              <Button variant="ghost" className="relative" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-primary text-white text-xs px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </Button>
            )}
            {isAuthenticated && !isAdmin && (
              <Button variant="outline" onClick={() => navigate("/profile")} className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                {user?.name ?? "Profil"}
              </Button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              className="gradient-primary text-primary-foreground shadow-glow hover:shadow-elegant transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/products")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Mulai Cetak
            </Button>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            {!isAdmin && (
              <button
                onClick={() => navigate("/cart")}
                className="relative rounded-full p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Keranjang"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-[10px] px-1 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-full p-2 text-foreground hover:text-primary transition-colors bg-background/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}
              {!isAdmin && (
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/cart")}>
                <ShoppingCart className="h-4 w-4" />
                Keranjang {cartCount > 0 && <span className="ml-1">({cartCount})</span>}
              </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="self-start rounded-full border border-slate-200/70 dark:border-slate-700"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-300" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </Button>
              {isAuthenticated && !isAdmin && (
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  {user?.name ?? "Profil"}
                </Button>
              )}
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Logout
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button className="gradient-primary text-primary-foreground shadow-glow w-full" onClick={() => navigate("/products")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Mulai Cetak
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-5 shadow-2xl max-w-sm w-full mx-4">
              <p className="font-semibold mb-2 text-amber-300">Konfirmasi Logout</p>
            <p className="text-sm text-slate-200 mb-4">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-amber-500 text-slate-900 hover:bg-amber-400"
                onClick={() => {
                  setAuthLoading(true);
                  setShowLogoutConfirm(false);
                  setTimeout(() => {
                    clearCart();
                    logout();
                    window.location.reload();
                  }, 500);
                }}
              >
                Ya, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      {authLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-4 flex items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <div>
              <p className="font-semibold text-amber-300">Mengakhiri sesi...</p>
              <p className="text-xs text-slate-300">Sebentar, kami sedang membersihkan data sesi Anda.</p>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
