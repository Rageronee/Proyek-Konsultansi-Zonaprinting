import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Award, Package, Shirt, Book } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCategories = () => {
  const categories = [
    {
      name: "Digital Printing",
      description: "Spanduk, Banner, Billboard",
      icon: ImageIcon,
      gradient: "from-primary to-primary-deep",
      slug: "digital-printing",
    },
    {
      name: "Merchandise",
      description: "Mug, Tumblr, Kaos",
      icon: Shirt,
      gradient: "from-accent to-amber-500",
      slug: "merchandise",
    },
    {
      name: "Sticker & Label",
      description: "Vinyl, Paper, Transparant",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
      slug: "sticker-label",
    },
    {
      name: "Document Books",
      description: "Brosur, Katalog, Majalah",
      icon: Book,
      gradient: "from-blue-500 to-cyan-500",
      slug: "documents",
    },
    {
      name: "Packaging",
      description: "Box, Paper Bag, Plastic",
      icon: Package,
      gradient: "from-green-500 to-emerald-500",
      slug: "packaging",
    },
  ];

  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Produk & Layanan <span className="text-primary">Kami</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Berbagai pilihan produk cetak berkualitas untuk kebutuhan bisnis dan personal Anda. Pilih kategori yang sesuai,
              kami siapkan material, finishing, dan pengiriman terbaiknya.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="h-full"
              >
                <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="block h-full">
                  <Card className="group relative h-full border-2 hover:border-primary/50 transition-all duration-500 cursor-pointer shadow-card hover:shadow-elegant">
                    {/* Background Gradient */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col gap-4 justify-between">
                      {/* Icon */}
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}
                        >
                          <Icon className="w-7 h-7" />
                        </motion.div>
                      </div>

                      {/* Text */}
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="ml-auto text-primary"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Shine Effect removed per request */}
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
