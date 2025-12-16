import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeVoucherDialog from "@/components/WelcomeVoucherDialog";

const SiteLayout = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <Outlet />
    </main>
    <WelcomeVoucherDialog />
    <Footer />
  </div>
);

export default SiteLayout;

