import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FAQSection = ({ showTitle = true, className = "" }: { showTitle?: boolean; className?: string }) => {
    const faqs = [
        {
            question: "Berapa lama proses pengerjaan?",
            answer: "Untuk cetak digital standar (kartu nama, brosur) biasanya 1-2 hari kerja. Untuk produk merchandise atau jumlah banyak, estimasi 3-5 hari kerja setelah desain disetujui."
        },
        {
            question: "Format file apa yang harus saya kirim?",
            answer: "Kami merekomendasikan format PDF, AI, CDR, atau PSD untuk hasil terbaik. JPG/PNG bisa diterima dengan resolusi minimal 300 DPI."
        },
        {
            question: "Apakah bisa request desain?",
            answer: "Ya! Kami memiliki tim desainer profesional. Hubungi admin kami untuk request/konsultasi."
        },
        {
            question: "Apakah ada minimal order?",
            answer: "Sebagian besar produk kami tidak memiliki minimal order (bisa satuan), kecuali untuk produk offset tertentu seperti packaging custom."
        },
        {
            question: "Bagaimana dengan pengiriman?",
            answer: "Kami dapat mengirim produk melalui JNE, J&T, dan GoSend/GrabExpress untuk pengiriman lokal. Biaya ongkir dihitung saat checkout berdasarkan lokasi."
        },
        {
            question: "Apakah ada batas waktu pengiriman?",
            answer: "Ya, kami memiliki batas waktu pengiriman yang berbeda untuk setiap produk. Untuk cetak digital, biasanya 1-2 hari kerja. Untuk produk offset, biasanya 3-5 hari kerja."
        }
    ];

    return (
        <section className={`py-16 ${className}`}>
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    {showTitle && (
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan Umum</h2>
                            <p className="text-muted-foreground">Jawaban untuk pertanyaan yang sering diajukan</p>
                        </div>
                    )}

                    <Card className="p-6 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left font-medium text-lg hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Card>

                    <div className="text-center mt-8">
                        <p className="text-muted-foreground">
                            Masih punya pertanyaan? <Link to="/contact" className="text-primary hover:underline font-medium">Hubungi Kami</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
