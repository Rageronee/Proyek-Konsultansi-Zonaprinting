import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import OrderFlow from "@/components/OrderFlow";
import FeaturedProducts from "@/components/FeaturedProducts";
import ScrollPrinter from "@/components/ScrollPrinter";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollPrinter />
      <Hero />
      <ProductCategories />
      <OrderFlow />
      <FeaturedProducts />
      <FAQSection className="bg-muted/30" />
    </div>
  );
};

export default Index;
