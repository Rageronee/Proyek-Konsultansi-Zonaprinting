import { motion } from "framer-motion";

const Refund = () => {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Kebijakan Pengembalian</h1>
                        <p className="text-muted-foreground">Komitmen kami terhadap kepuasan Anda</p>
                    </div>

                    <section className="prose dark:prose-invert max-w-none space-y-6">
                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Syarat Pengembalian</h3>
                            <p className="text-muted-foreground mb-4">
                                Kami menerima klaim pengembalian atau cetak ulang jika terjadi kesalahan dari pihak Zonaprint, seperti:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>Hasil cetak cacat produksi (tinta luntur parah, terpotong salah).</li>
                                <li>Ukuran atau bahan tidak sesuai dengan pesanan.</li>
                                <li>Jumlah barang kurang dari pesanan.</li>
                            </ul>
                        </div>

                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Prosedur Klaim</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                                <li>Lakukan komplain maksimal 2x24 jam setelah barang diterima.</li>
                                <li>Sertakan video unboxing dan foto detail kerusakan.</li>
                                <li>Hubungi customer service kami melalui WhatsApp atau Email.</li>
                                <li>Jika disetujui, kami akan memproses cetak ulang atau refund dana Anda.</li>
                            </ol>
                        </div>

                        <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/20">
                            <h3 className="text-xl font-bold mb-3 text-amber-600 dark:text-amber-400">Penting Diperhatikan</h3>
                            <p className="text-muted-foreground">
                                Kami tidak menerima pengembalian karena kesalahan file desain dari pelanggan (typo, resolusi rendah)
                                atau kerusakan akibat pengiriman ekspedisi, namun kami akan membantu proses klaim ke pihak ekspedisi.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default Refund;
