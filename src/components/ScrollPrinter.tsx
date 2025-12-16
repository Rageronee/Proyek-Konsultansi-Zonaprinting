import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Printer, Package, FileText, Palette, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CACHE_KEY = "zp_voucher_popup_closed";

const ScrollPrinter = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [paperHeight, setPaperHeight] = useState(0);
  const [steps, setSteps] = useState({
    header: false,
    voucher: false,
    services: false,
    footer: false,
  });

  useEffect(() => {
    const closed = localStorage.getItem(CACHE_KEY) === "1";
    if (!closed) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPaperHeight(520), 150));
    timers.push(setTimeout(() => setSteps((s) => ({ ...s, header: true })), 450));
    timers.push(setTimeout(() => setSteps((s) => ({ ...s, voucher: true })), 750));
    timers.push(setTimeout(() => setSteps((s) => ({ ...s, services: true })), 1050));
    timers.push(setTimeout(() => setSteps((s) => ({ ...s, footer: true })), 1350));

    return () => timers.forEach(clearTimeout);
  }, [open]);

  const paperWidth = useMemo(() => "w-[300px] md:w-[340px] lg:w-[380px]", []);
  const paperClass = useMemo(
    () => `relative ${paperWidth} bg-white mx-auto shadow-2xl overflow-hidden rounded-b-lg`,
    [paperWidth],
  );

  const handleClose = () => {
    localStorage.setItem(CACHE_KEY, "1");
    setOpen(false);
  };

  const handleUseVoucher = () => {
    handleClose();
    navigate("/products");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
      <motion.div
            initial={{ scale: 0.9, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            className="relative z-10 w-full max-w-3xl px-4"
      >
            <button
              className="absolute right-6 top-6 z-20 rounded-full bg-white/80 p-2 text-slate-700 shadow hover:bg-white"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`relative ${paperWidth} mx-auto bg-gradient-to-br from-primary via-primary-deep to-primary rounded-t-3xl shadow-2xl px-6 py-5`}
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-white">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <div className="font-bold text-lg tracking-wider">ZONAPRINT</div>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="flex justify-center">
                <Printer className="w-12 h-12 text-white" />
          </div>
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${paperWidth} h-2 bg-gradient-to-b from-primary-deep to-transparent`} />
        </div>

        <motion.div
          style={{ height: paperHeight }}
              animate={{ height: paperHeight }}
              transition={{ type: "spring", stiffness: 110, damping: 14 }}
              className={paperClass}
        >
          <div className="absolute inset-0 opacity-5">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="h-px bg-gray-400 mb-5" style={{ marginTop: `${i * 22}px` }} />
            ))}
          </div>

          <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
            style={{
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.7)",
            }}
          />

              <div className="p-6 space-y-4 text-sm relative z-10">
                {steps.header && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                className="space-y-2 border-b border-primary/20 pb-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-primary" />
                    <div className="text-primary font-bold text-base tracking-wide">ZONAPRINT</div>
                  </div>
                      <div className="text-gray-500 text-xs">Promo Terbaru</div>
                </div>
                <div className="h-px bg-gradient-to-r from-primary via-accent to-primary" />
              </motion.div>
            )}

                {steps.voucher && (
              <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-dashed border-yellow-400"
              >
                    <div className="text-center space-y-3">
                      <div className="text-orange-600 font-bold text-sm uppercase tracking-wide">✨ Voucher Eksklusif ✨</div>
                      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-white rounded-lg px-4 py-2 shadow-inner">
                    <div className="font-black text-xl tracking-wider">ZONA20</div>
                  </div>
                  <div className="text-gray-600 text-xs leading-tight">Diskon 20% untuk cetak pertama!</div>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-400" onClick={handleUseVoucher}>
                          Gunakan voucher
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                          Nanti saja
                        </Button>
                      </div>
                </div>
              </motion.div>
            )}

                {steps.services && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                className="grid grid-cols-3 gap-2 py-2"
              >
                <div className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-[10px] text-blue-800 font-medium">Flyer</div>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-[10px] text-green-800 font-medium">Box</div>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-[10px] text-purple-800 font-medium">Design</div>
                </div>
              </motion.div>
            )}

                {steps.footer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                className="border-t border-dashed border-gray-300 pt-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-gray-600 leading-tight">
                    <div className="font-semibold text-primary text-sm">Cetak Ide Hebatmu!</div>
                    <div className="text-[11px]">www.zonaprint.com</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border border-primary/30">
                    <QrCode className="w-12 h-12 text-primary/60" />
                  </div>
                </div>
                <div className="border-t-2 border-dashed border-gray-300" />
                <div className="text-center text-[10px] text-gray-400">✂️ Gunting di sini untuk menggunakan voucher</div>
              </motion.div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-400/40 to-transparent pointer-events-none" />
        </motion.div>
          </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};

export default ScrollPrinter;
