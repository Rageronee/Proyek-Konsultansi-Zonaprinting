import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, LayoutDashboard, LogOut, Package, ShoppingCart, Home, Gift } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const AdminLayout = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/products", label: "Produk", icon: Package },
    { to: "/admin/orders", label: "Transaksi", icon: ShoppingCart },
    { to: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { to: "/admin/vouchers", label: "Voucher", icon: Gift },
  ];

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
                    hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-primary"
                        : "text-slate-700 dark:text-slate-100"
                    }`
                  }
                  end={item.to === "/admin"}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
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
            <div>
              <p className="text-xs text-muted-foreground">Admin</p>
              <p className="font-semibold">ZonaPrint</p>
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
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

