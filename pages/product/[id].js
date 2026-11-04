import Center from "@/components/Center";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {mongooseConnect} from "@/lib/mongoose";
import Product from "@/models/Product";
import styled from "styled-components";
import Link from "next/link";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import ProductReviews from "@/components/ProductReviews";
import {LeafIcon, ShieldIcon, TruckIcon} from "@/components/icons/StoreIcons";
import {border, muted, primary} from "@/lib/colors";

const Breadcrumbs = styled.nav`
  margin: 24px 0 16px;
  font-size: 14px;
  color: ${muted};
  a{
    color: ${muted};
    text-decoration: none;
    &:hover{ color: ${primary}; text-decoration: underline; }
  }
  span.sep{ margin: 0 8px; }
`;
const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 40px;
  @media screen and (min-width: 860px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
`;
const Details = styled.div`
  h1{
    margin: 0 0 8px;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -.02em;
    @media screen and (min-width: 768px) {
      font-size: 2.25rem;
    }
  }
  p.description{
    margin: 0 0 24px;
    color: #475569;
    font-size: 1.05rem;
  }
`;
const Price = styled.div`
  margin: 16px 0 20px;
  font-size: 2rem;
  font-weight: 800;
  small{
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: ${muted};
  }
`;
const Perks = styled.ul`
  list-style: none;
  margin: 28px 0 0;
  padding: 20px 0 0;
  border-top: 1px solid ${border};
  display: grid;
  gap: 12px;
  li{
    display: flex;
    align-items: center;
    gap: 10px;
    color: #334155;
    font-size: 15px;
  }
  svg{
    width: 20px;
    height: 20px;
    color: ${primary};
    flex-shrink: 0;
  }
`;

export default function ProductPage({product}) {
  return (
    <>
      <Header />
      <main>
        <Center>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/products">Products</Link>
            <span className="sep">/</span>
            <span aria-current="page">{product.title}</span>
          </Breadcrumbs>
          <ColWrapper>
            <WhiteBox>
              <ProductImages images={product.images} title={product.title} />
            </WhiteBox>
            <Details>
              <h1>{product.title}</h1>
              {product.description && <p className="description">{product.description}</p>}
              <Price>₹{product.price}</Price>
              <FlyingButton main size="l" _id={product._id} src={product.images?.[0]}>
                <CartIcon />Add to cart
              </FlyingButton>
              <Perks>
                <li><TruckIcon /> Delivered to your doorstep</li>
                <li><LeafIcon /> Fruits, vegetables and pantry staples</li>
                <li><ShieldIcon /> Secure checkout with Stripe</li>
              </Perks>
            </Details>
          </ColWrapper>
          <ProductReviews product={product}/>
        </Center>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {id} = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}
