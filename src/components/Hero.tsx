import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const floatingCards = [
    { type: "Business Card", delay: 0, x: -100, y: -50, rotate: -15 },
    { type: "Banner", delay: 0.2, x: 100, y: 50, rotate: 10 },
    { type: "Sticker", delay: 0.4, x: -80, y: 100, rotate: 5 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              left: `${30 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Kualitas Premium, Harga Terjangkau</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Cetak Ide Hebatmu,{" "}
              <span className="text-primary">Kualitas</span>{" "}
              <span className="text-accent">Tanpa Batas</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Wujudkan semua kebutuhan cetak digital Anda dengan teknologi terkini dan hasil profesional. Dari spanduk hingga merchandise, kami siap membantu bisnis Anda berkembang.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-amber-500 text-white shadow-glow hover:bg-amber-400 transition-all duration-300 hover:scale-105 text-lg px-6"
                asChild
              >
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-3"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { number: "10K+", label: "Pelanggan" },
                { number: "50K+", label: "Produk Tercetak" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[400px] lg:h-[600px] hidden lg:block">
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [card.rotate, card.rotate + 5, card.rotate],
                }}
                transition={{
                  delay: card.delay,
                  duration: 0.6,
                  ease: "easeOut",
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: card.delay + 0.6,
                  },
                }}
                className="absolute w-64 h-40 rounded-xl shadow-card bg-card border border-border/50 p-6 backdrop-blur-sm"
                style={{
                  top: `${index * 30}%`,
                  left: `${index * 20}%`,
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-lg gradient-primary" />
                  <div>
                    <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-2 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
