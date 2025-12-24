import { motion } from "framer-motion";

const Terms = () => {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
                        <p className="text-muted-foreground">Terakhir diperbarui: 25 Desember 2025</p>
                    </div>

                    <section className="prose dark:prose-invert max-w-none space-y-6">
                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">1. Pendahuluan</h3>
                            <p className="text-muted-foreground">
                                Selamat datang di Zonaprint. Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut ini.
                                Harap baca dengan seksama sebelum melakukan pemesanan.
                            </p>
                        </div>

                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">2. Proses Pemesanan</h3>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>Pesanan akan diproses setelah pembayaran dikonfirmasi.</li>
                                <li>Pastikan file desain yang Anda kirim sudah siap cetak (Ready to Print).</li>
                                <li>Kami tidak bertanggung jawab atas kesalahan ejaan atau layout dalam file yang dikirimkan pelanggan.</li>
                            </ul>
                        </div>

                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">3. Kualitas & Warna Cetak</h3>
                            <p className="text-muted-foreground">
                                Warna pada layar (RGB) mungkin akan sedikit berbeda dengan hasil cetak (CMYK). Kami berusaha memberikan hasil yang paling mendekati,
                                namun toleransi warna sekitar 5-10% adalah wajar dalam industri percetakan.
                            </p>
                        </div>

                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">4. Hak Kekayaan Intelektual</h3>
                            <p className="text-muted-foreground">
                                Pelanggan bertanggung jawab penuh atas hak cipta konten yang dicetak. Zonaprint berhak menolak pesanan yang melanggar hukum
                                atau norma kesusilaan.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
