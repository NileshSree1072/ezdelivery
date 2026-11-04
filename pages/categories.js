import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Title from "@/components/Title";
import {Category} from "@/models/Category";
import Product from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import SectionHeader from "@/components/SectionHeader";
import styled from "styled-components";
import Link from "next/link";
import {RevealWrapper} from "next-reveal";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";
import {primary, primaryDark, primarySoft} from "@/lib/colors";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media screen and (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  & > div{
    height: 100%;
  }
`;

const ShowAllCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
  min-height: 200px;
  border: 2px dashed #bbf7d0;
  border-radius: 14px;
  background-color: ${primarySoft};
  color: ${primaryDark};
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  padding: 16px;
  span{ font-size: 14px; font-weight: 500; color: ${primary}; }
  &:hover{ border-color: ${primary}; }
`;

export default function CategoriesPage({mainCategories,categoriesProducts,wishedProducts=[]}) {
  return (
    <>
      <Header />
      <main>
        <Center>
          <Title>Categories</Title>
          {mainCategories.map(cat => (
            <section key={cat._id}>
              <SectionHeader title={cat.name} href={'/category/'+cat._id} linkLabel="Show all →" />
              <CategoryGrid>
                {categoriesProducts[cat._id].map((p,index) => (
                  <RevealWrapper key={p._id} delay={index*50}>
                    <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                  </RevealWrapper>
                ))}
                <RevealWrapper delay={categoriesProducts[cat._id].length*50}>
                  <ShowAllCard href={'/category/'+cat._id}>
                    See all {cat.name}
                    <span>Browse the full range →</span>
                  </ShowAllCard>
                </RevealWrapper>
              </CategoryGrid>
            </section>
          ))}
        </Center>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter(c => !c.parent);
  const categoriesProducts = {}; // catId => [products]
  const allFetchedProductsId = [];
  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatIds = categories
      .filter(c => c?.parent?.toString() === mainCatId)
      .map(c => c._id.toString());
    const categoriesIds = [mainCatId, ...childCatIds];
    const products = await Product.find({category: categoriesIds}, null, {limit:3,sort:{'_id':-1}});
    allFetchedProductsId.push(...products.map(p => p._id.toString()))
    categoriesProducts[mainCat._id] = products;
  }

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
      userEmail:session?.user.email,
      product: allFetchedProductsId,
    })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(
        JSON.stringify(mainCategories)
      ),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    },
  };
}
