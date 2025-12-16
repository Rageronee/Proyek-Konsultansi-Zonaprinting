import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import OrderFlow from "@/components/OrderFlow";
import FeaturedProducts from "@/components/FeaturedProducts";
import ScrollPrinter from "@/components/ScrollPrinter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollPrinter />
      <Hero />
      <ProductCategories />
      <OrderFlow />
      <FeaturedProducts />
    </div>
  );
};

export default Index;
