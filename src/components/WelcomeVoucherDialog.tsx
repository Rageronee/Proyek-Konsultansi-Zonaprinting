import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X, TicketPercent, Gift } from "lucide-react";

const WELCOME_VOUCHER_VALUE = 25000;

const WelcomeVoucherDialog = () => {
  const { user, markWelcomeVoucherShown } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"printing" | "done">("printing"); // Changed "finished" to "done" to match original logic

  useEffect(() => {
    if (user && !user.welcomeVoucherShown) {
      setOpen(true);
      // Automatically finish "printing" after animation (4s + 0.5s delay)
      const timer = setTimeout(() => {
        setStep("done");
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
    markWelcomeVoucherShown();
  };

  if (!user || user.role === "admin") return null;

  // Don't show on checkout page or any other page except home
  if (window.location.pathname !== "/") return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-start pt-32 overflow-visible min-h-screen [&>button:last-child]:hidden">

        <div className="relative flex flex-col items-center justify-center">

          {/* Close Button - Restored & Positioned closer */}
          <button
            onClick={handleClose}
            className="absolute z-50 top-6 -right-6 bg-white/90 hover:bg-white text-slate-500 rounded-full p-1.5 shadow-lg transition-all transform hover:scale-105"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Paper / Voucher coming out */}
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={step === "printing"
              ? { y: [-80, 160, 160], opacity: 1 }
              : { y: 160, opacity: 1 }
            }
            transition={{ duration: 4, ease: "linear", delay: 0.5 }} // Slower duration for printing effect
            className="absolute top-0 z-10 w-72 bg-white text-slate-900 rounded-lg shadow-xl border-2 border-dashed border-amber-400 p-6 flex flex-col items-center gap-3 text-center origin-top"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-600">Selamat Datang!</h3>
              <p className="text-sm text-slate-500 leading-tight">Voucher Pengguna Baru</p>
            </div>

            <div className="py-2 px-4 bg-amber-50 rounded-md border border-amber-200">
              <span className="text-3xl font-black text-amber-600 tracking-wider">25K OFF</span>
            </div>

            <p className="text-[10px] text-slate-400">Berlaku untuk pembelian pertama</p>

            {step === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <Button
                  size="sm"
                  className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800"
                  onClick={handleClose}
                >
                  Simpan & Tutup
                </Button>
                <Button
                  size="sm"
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => {
                    handleClose();
                    window.location.href = "/products";
                  }}
                >
                  Gunakan Sekarang
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Printer Body Top (Back Layer) */}
          <div className="w-72 h-32 bg-slate-800 rounded-t-2xl relative z-20 shadow-2xl flex items-end justify-center pb-2">
            <div className="w-60 h-4 bg-slate-950 rounded-full opacity-50 blur-[1px]"></div>
          </div>

          {/* Printer Exit Slot - Widened to match paper */}
          <div className="w-72 h-3 bg-black/80 z-20 rounded-full absolute top-[115px]"></div>

          {/* Printer Front Body */}
          <div className="w-72 h-24 bg-slate-700 rounded-b-xl relative z-30 shadow-inner flex flex-col items-center justify-start pt-4 border-t border-slate-600/50">
            {/* Brand */}
            <div className="flex items-center gap-1.5 opacity-70 mb-3">
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-300 tracking-widest">ZONAPRINT</span>
            </div>

            {/* Status Lights */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={step === "printing" ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className={`w-3 h-3 rounded-full ${step === "printing" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "bg-green-600"}`}
                />
                <span className="text-[8px] text-slate-400 uppercase">Power</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={step === "printing" ? { opacity: [1, 0.3, 1] } : { opacity: 0.3 }}
                  transition={{ repeat: Infinity, duration: 0.4 }}
                  className="w-3 h-3 rounded-full bg-amber-400"
                />
                <span className="text-[8px] text-slate-400 uppercase">Data</span>
              </div>
            </div>
          </div>

          {/* Shadow underneath */}
          <div className="w-64 h-4 bg-black/40 blur-md rounded-full mt-2"></div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default WelcomeVoucherDialog;
export const WELCOME_VOUCHER_VALUE_CONST = WELCOME_VOUCHER_VALUE;

