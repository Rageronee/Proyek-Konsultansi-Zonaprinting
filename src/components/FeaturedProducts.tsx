import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useShop } from "@/providers/ShopProvider";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const { products, addToCart, getProductPerformance } = useShop();

  const popularIds = getProductPerformance()
    .sort((a, b) => b.totalSold - a.totalSold)
    .map((p) => p.productId);

  const resolved = (popularIds.length ? popularIds : products.map((p) => p.id)).slice(0, 4);
  const popularProducts = resolved
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Produk <span className="text-primary">Terpopuler</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pilihan favorit pelanggan kami dengan kualitas terjamin dan harga terbaik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product, index) => (
            <motion.div
              key={product!.id}
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <Card className="group h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 shadow-card hover:shadow-elegant cursor-pointer">
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                  <img src={product!.image} alt={product!.name} className="h-full w-full object-cover" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full gradient-accent text-accent-foreground text-sm font-semibold shadow-lg">
                    Popular
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {product!.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs font-semibold">4.9</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {product!.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-sm text-muted-foreground">Harga</span>
                    <span className="text-2xl font-bold text-accent">
                      Rp {product!.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => addToCart(product!.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Tambah ke keranjang
                  </Button>
                  <Button variant="ghost" className="mt-2 w-full" asChild>
                    <Link to={`/products/${product!.id}`}>Lihat detail</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8"
            asChild
          >
            <Link to="/products">Lihat Semua Produk</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
