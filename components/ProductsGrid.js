import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import {RevealWrapper} from 'next-reveal'

const StyledProductsGrid = styled.div`
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

export default function ProductsGrid({products,wishedProducts=[]}) {
  return (
    <StyledProductsGrid>
      {products?.length > 0 && products.map((product,index) => (
        <RevealWrapper key={product._id} delay={index*40}>
          <ProductBox {...product}
                      wished={wishedProducts.includes(product._id)} />
        </RevealWrapper>
      ))}
    </StyledProductsGrid>
  );
}
