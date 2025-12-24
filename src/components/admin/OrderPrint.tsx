
import { Order } from "@/types";
import { useEffect, useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { useToast } from "@/components/ui/use-toast";
import MainLogo from "@/assets/Main_logo.png";

interface OrderPrintProps {
    order: Order;
    onClose: () => void;
}

const OrderPrint = ({ order, onClose }: OrderPrintProps) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();



    const handleDownload = async () => {
        if (!receiptRef.current) return;

        try {
            const dataUrl = await toPng(receiptRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `receipt-${order.id}.png`;
            link.href = dataUrl;
            link.click();
            toast({ title: "Struk tersimpan", description: "Gambar struk berhasil diunduh." });
        } catch (err) {
            console.error("Failed to save image", err);
            toast({ title: "Gagal menyimpan", description: "Terjadi kesalahan saat menyimpan gambar.", variant: "destructive" });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-zinc-900/60 backdrop-blur-sm flex justify-center items-start overflow-auto p-4 md:p-8 animate-in fade-in duration-200">
            <div className="absolute top-4 right-4 flex gap-2 print:hidden">
                <Button variant="default" onClick={() => window.print()} className="gap-2">
                    <Printer className="w-4 h-4" />
                    Cetak
                </Button>
                <Button variant="secondary" onClick={handleDownload} className="gap-2 bg-white hover:bg-slate-100 text-slate-900">
                    <Download className="w-4 h-4" />
                    Simpan Gambar
                </Button>
                <Button variant="destructive" onClick={onClose} className="gap-2">
                    <X className="w-4 h-4" />
                    Tutup
                </Button>
            </div>

            <div className="w-full max-w-[80mm] flex justify-center print:block print:w-full">
                <div
                    ref={receiptRef}
                    className="w-[80mm] bg-white text-black p-4 shadow-2xl print:shadow-none print:w-full font-mono text-sm leading-tight relative"
                    style={{ minHeight: '100mm' }} // Ensure typical receipt length
                >
                    {/* Thermal Paper Header */}
                    <div className="text-center pb-4 mb-4 border-b-2 border-dashed border-black">
                        {/* Fake Logo / Text Logo */}
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <img src={MainLogo} alt="ZONAPRINT" className="h-10 w-auto object-contain" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Percetakan & Digital Printing</p>
                        <p className="text-[10px]">Jl. Wanayasa - Purwakarta No. 45</p>
                        <p className="text-[10px]">Telp: 0822-4690-7899</p>
                    </div>

                    {/* Order Metadata */}
                    <div className="mb-4 text-[11px] space-y-1 border-b-2 border-dashed border-black pb-4">
                        <div className="flex justify-between">
                            <span>ID Order:</span>
                            <span className="font-bold">{order.id.split('-')[1] || order.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tanggal:</span>
                            <span>{new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu:</span>
                            <span>{new Date(order.createdAt).toLocaleTimeString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir:</span>
                            <span>Admin</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4 text-[12px] space-y-1 bg-gray-50 p-2 rounded border border-black/10">
                        <div className="font-bold border-b border-black/10 pb-1 mb-1">INFO PELANGGAN</div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Nama:</span>
                            <span className="font-bold uppercase">{order.userName || "Guest"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Telp:</span>
                            <span>{order.userPhone || "-"}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mb-6">
                        <div className="text-[11px] font-bold border-b border-black pb-1 uppercase">Item Pesanan</div>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="text-[12px]">
                                <div className="font-bold mb-0.5">{item.name}</div>
                                <div className="flex justify-between pl-2">
                                    <span>{item.quantity} x {item.price.toLocaleString("id-ID")}</span>
                                    <span className="font-bold">{(item.quantity * item.price).toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-black border-dashed pt-3 mb-8 space-y-1">
                        <div className="flex justify-between items-center text-[13px] font-bold">
                            <span>SUBTOTAL</span>
                            <span>Rp {order.total.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] font-bold">
                            <span>DISKON</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-black border-t-2 border-black pt-2 mt-2">
                            <span>TOTAL</span>
                            <span>Rp {order.total.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="mt-4 pt-2 text-center border-t border-black">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-black ${order.status === 'baru' ? 'bg-white' : 'bg-black text-white'}`}>
                                Status: {order.status === 'baru' ? 'BELUM LUNAS' : 'LUNAS'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-[10px] font-medium space-y-1 border-t-2 border-dashed border-black pt-4">
                        <p className="uppercase font-bold">Terima kasih atas kepercayaan Anda!</p>
                        <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan kecuali ada perjanjian.</p>
                        <p className="pt-2 font-mono">** ZONAPRINT **</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    body { margin: 0; padding: 0; background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:w-full { width: 100% !important; max-width: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
};

export default OrderPrint;
