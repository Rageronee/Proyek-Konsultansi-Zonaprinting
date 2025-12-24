
import { Order } from "@/types";
import { useEffect } from "react";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderPrintProps {
    order: Order;
    onClose: () => void;
}

const OrderPrint = ({ order, onClose }: OrderPrintProps) => {
    useEffect(() => {
        // Auto print when mounted
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-white flex justify-center items-start overflow-auto p-8 animate-in fade-in duration-200">
            <div className="absolute top-4 right-4 print:hidden">
                <Button variant="outline" onClick={onClose} className="gap-2">
                    <X className="w-4 h-4" />
                    Tutup
                </Button>
            </div>

            <div className="w-full max-w-[80mm] print:w-full print:max-w-none bg-white p-4 print:p-0">
                {/* Header - Invoice Style */}
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                    <h1 className="text-xl font-bold tracking-wider">ZONAPRINT</h1>
                    <p className="text-xs text-slate-500">Percetakan & Digital Printing</p>
                    <div className="my-2 py-1 px-3 bg-slate-100 rounded inline-block text-[10px] font-mono print:bg-transparent print:p-0">
                        {order.id}
                    </div>
                    <p className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                    </p>
                </div>

                {/* Customer Info */}
                <div className="mb-4 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Pelanggan:</span>
                        <span className="font-semibold">{order.userName || order.userId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Telepon:</span>
                        <span className="font-mono">{order.userPhone || "-"}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                    <div className="text-[10px] font-bold border-b border-gray-200 pb-1 text-slate-500 uppercase">Detail Pesanan</div>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                            <div className="font-medium">{item.name}</div>
                            <div className="flex justify-between text-slate-500 mt-0.5">
                                <span>{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</span>
                                <span>Rp {(item.quantity * item.price).toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-6">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span>Total</span>
                        <span>Rp {order.total.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="mt-1 flex justify-between items-center text-xs text-slate-500">
                        <span>Status Pembayaran</span>
                        <span className="uppercase bg-slate-100 px-1 rounded print:border print:border-slate-300">
                            {order.status === 'baru' ? 'BELUM LUNAS' : 'LUNAS'}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-slate-400 space-y-1">
                    <p>Terima kasih telah berbelanja di ZonaPrint!</p>
                    <p>Simpan struk ini sebagai bukti pembayaran.</p>
                </div>
            </div>

            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0.z-\\[100\\] * {
            visibility: visible;
          }
          .fixed.inset-0.z-\\[100\\] {
            position: absolute;
            left: 0;
            top: 0;
            padding: 0;
            background: white;
            width: 100%;
            height: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Ensure print content starts at top */
          .max-w-\\[80mm\\] {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
        </div>
    );
};

export default OrderPrint;
