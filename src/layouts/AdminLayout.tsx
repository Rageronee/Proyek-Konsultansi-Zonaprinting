import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart3, LayoutDashboard, LogOut, Package, ShoppingCart, Home, Gift, Bell, Moon, Sun, RefreshCw } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useShop } from "@/providers/ShopProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const { logout } = useAuth();
  const { orders, refresh, isLoading } = useShop();
  const { toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const newOrderCount = (orders || []).filter((o) => o.status === "baru").length;

  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/products", label: "Produk", icon: Package },
    { to: "/admin/orders", label: "Transaksi", icon: ShoppingCart, badge: newOrderCount },
    { to: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { to: "/admin/vouchers", label: "Voucher", icon: Gift },
  ];

  const location = useLocation();
  const activeItem = navItems.find((item) =>
    item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to)
  );
  const pageTitle = activeItem?.label || "Overview";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <div className="flex">
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Admin</p>
            <h1 className="text-xl font-semibold">ZonaPrint Dashboard</h1>
          </div>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-amber-50 text-amber-700 border border-amber-200"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </NavLink>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                    hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-primary"
                      : "text-slate-700 dark:text-slate-100"
                    }`
                  }
                  end={item.to === "/admin"}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.badge ? (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </aside>
        <div className="flex-1">
          <header className="md:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="h-full bg-white dark:bg-slate-900 p-6 space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Admin</p>
                        <h1 className="text-xl font-semibold">ZonaPrint</h1>
                      </div>
                      <nav className="space-y-2">
                        <NavLink
                          to="/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          <Home className="h-4 w-4" />
                          Kembali ke Beranda
                        </NavLink>
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                              hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive
                                  ? "bg-slate-100 dark:bg-slate-800 text-primary"
                                  : "text-slate-700 dark:text-slate-100"
                                }`
                              }
                              end={item.to === "/admin"}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                              {item.badge ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                  {item.badge}
                                </span>
                              ) : null}
                            </NavLink>
                          );
                        })}
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-xs text-muted-foreground">Admin</p>
                  <p className="font-semibold">ZonaPrint</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  to="/"
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-amber-50/80 dark:hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/80"
                >
                  Beranda
                </NavLink>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
          </header>
          {/* Desktop Header for Notifications */}
          <header className="hidden md:flex sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {pageTitle}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    {newOrderCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-sm">Pesanan Baru</h4>
                    <span className="text-xs text-muted-foreground">{newOrderCount} pesanan</span>
                  </div>
                  <div className="py-2">
                    {newOrderCount === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                        Tidak ada pesanan baru saat ini.
                      </div>
                    ) : (
                      (orders || [])
                        .filter((o) => o.status === "baru")
                        .slice(0, 5)
                        .map((order) => (
                          <div
                            key={order.id}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                                {order.userName || "User"}
                              </span>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {order.items.map((i) => i.name).join(", ")}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                Rp {order.total.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                  {newOrderCount > 0 && (
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <NavLink to="/admin/orders" className="block text-center text-xs font-medium text-primary hover:underline">
                        Lihat Semua Pesanan
                      </NavLink>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <button
                onClick={toggleTheme}
                className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs border border-amber-200">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

