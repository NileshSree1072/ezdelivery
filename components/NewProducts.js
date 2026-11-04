import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import SectionHeader from "@/components/SectionHeader";

export default function NewProducts({products,wishedProducts})
{
  return (
    <Center>
      <SectionHeader title="New arrivals" href="/products" />
      <ProductsGrid products={products} wishedProducts={wishedProducts}/>
    </Center>
  );
}
