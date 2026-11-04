import Header from "@/components/Header";
import Featured from "@/components/Featured";
import Product from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import {WishedProduct} from "@/models/WishedProduct";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Setting} from "@/models/Setting";
import {Category} from "@/models/Category";
import Center from "@/components/Center";
import SectionHeader from "@/components/SectionHeader";
import CategoryChips from "@/components/CategoryChips";
import ValueProps from "@/components/ValueProps";
import Footer from "@/components/Footer";

export default function HomePage({featuredProduct,newProducts,wishedNewProducts,categories}) {
  return (
    <>
      <Header />
      <main>
        <Featured product={featuredProduct} />
        <ValueProps />
        <Center>
          <SectionHeader title="Shop by category" href="/categories" />
          <CategoryChips categories={categories} />
        </Center>
        <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({name:'featuredProductId'});
  const featuredProductId = featuredProductSetting?.value;
  const featuredProduct = featuredProductId ? await Product.findById(featuredProductId) : null;
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:12});
  const categories = await Category.find({parent: null}, {name: 1});
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail:session.user.email,
        product: newProducts.map(p => p._id.toString()),
      })
    : [];
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
