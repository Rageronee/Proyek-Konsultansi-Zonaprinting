import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { X } from "lucide-react";

const WELCOME_VOUCHER_VALUE = 25000;

const WelcomeVoucherDialog = () => {
  const { user, markWelcomeVoucherShown } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !user.welcomeVoucherShown) {
      setOpen(true);
      markWelcomeVoucherShown();
    }
  }, [user, markWelcomeVoucherShown]);

  if (!user || (!open && user.welcomeVoucherShown)) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg data-[state=open]:animate-slide-in-from-top data-[state=closed]:animate-slide-out-to-top">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogHeader>
          <DialogTitle>Selamat datang, {user?.name}!</DialogTitle>
          <DialogDescription>
            Dapatkan voucher perdana senilai Rp {WELCOME_VOUCHER_VALUE.toLocaleString("id-ID")} untuk pesanan pertama Anda.
            Voucher hanya berlaku satu kali per akun dan dapat dipakai di halaman checkout.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <Button onClick={() => setOpen(false)}>Siap gunakan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeVoucherDialog;
export const WELCOME_VOUCHER_VALUE_CONST = WELCOME_VOUCHER_VALUE;

