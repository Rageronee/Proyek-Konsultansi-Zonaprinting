import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Upload, UserCircle, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-zonaprint.png";
import { useAuth } from "@/providers/AuthProvider";
import { useShop } from "@/providers/ShopProvider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { cart } = useShop();
  const navigate = useNavigate();

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        isScrolled ? "glass shadow-lg" : "bg-transparent"
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
                  onClick={() => {
                    if (!window.confirm("Yakin ingin logout dari akun ini?")) return;
                    logout();
                  }}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
              {isAuthenticated && !isAdmin && (
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  {user?.name ?? "Profil"}
                </Button>
              )}
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!window.confirm("Yakin ingin logout dari akun ini?")) return;
                    logout();
                  }}
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
    </motion.nav>
  );
};

export default Navbar;
