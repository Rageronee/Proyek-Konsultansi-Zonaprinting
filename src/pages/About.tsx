import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  "Kualitas cetak premium dengan kontrol mutu berlapis di setiap proses produksi.",
  "Lead time cepat dan transparan dengan estimasi yang jelas sejak awal.",
  "Tim konsultan desain yang siap membantu memilih material & finishing terbaik.",
  "Garansi kepuasan dan reprint bila terjadi cacat produksi yang signifikan.",
];

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <p className="text-sm text-muted-foreground">Tentang ZonaPrint</p>
        <h1 className="text-4xl lg:text-5xl font-bold">
          Satu tempat untuk semua kebutuhan <span className="text-primary">cetak bisnis</span> Anda
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Dari branding, promosi, hingga kemasan produk, ZonaPrint membantu Anda tampil lebih profesional
          dengan layanan cetak digital yang modern dan terukur.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Visi</CardTitle>
            </CardHeader>
            <CardContent>
              Menjadi partner cetak terpercaya bagi brand dan UMKM di Indonesia dengan menghadirkan pengalaman
              pemesanan yang simpel, hasil konsisten, dan layanan purna jual yang bertanggung jawab.
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Misi</CardTitle>
            </CardHeader>
            <CardContent>
              Mempermudah pelaku bisnis dalam memesan, memonitor, dan mengoptimalkan materi cetak sehingga mereka
              dapat fokus pada hal terpenting: mengembangkan penjualan dan brand mereka.
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Kenapa pelanggan memilih ZonaPrint</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {values.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { label: "Brand & UMKM terbantu", value: "500+" },
          { label: "Project cetak selesai", value: "10K+" },
          { label: "Rating kepuasan pelanggan", value: "4.9/5" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutPage;

