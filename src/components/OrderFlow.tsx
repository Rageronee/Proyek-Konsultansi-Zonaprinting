import { motion } from "framer-motion";
import { ShoppingCart, Upload, PackageCheck } from "lucide-react";

const OrderFlow = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Pilih Produk",
      description: "Browse katalog lengkap kami dan pilih produk yang Anda butuhkan",
      color: "primary",
    },
    {
      icon: Upload,
      title: "Upload Desain",
      description: "Upload file desain Anda atau gunakan template kami yang menariks",
      color: "accent",
    },
    {
      icon: PackageCheck,
      title: "Terima Hasil",
      description: "Hasil cetakan berkualitas tinggi akan sampai ke tangan Anda",
      color: "primary",
    },
  ];

  return (
    <section id="order" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cara <span className="text-primary">Pemesanan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proses pemesanan yang mudah dan cepat, hanya dalam 3 langkah sederhana
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line - centered with steps */}
          <div className="hidden md:block absolute inset-x-0 top-28">
            <div className="max-w-5xl mx-auto h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-70" />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                      className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl ${
                        step.color === "primary" ? "gradient-primary" : "gradient-accent"
                      } flex items-center justify-center shadow-elegant relative overflow-hidden`}
                    >
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white/20 rounded-full"
                      />
                    </motion.div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-2 mt-3">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-xs">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 gradient-primary text-primary-foreground rounded-full font-semibold text-lg shadow-glow hover:shadow-elegant transition-all duration-300"
          >
            Mulai Pesan Sekarang
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderFlow;
