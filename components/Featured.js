import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import FlyingButton from "@/components/FlyingButton";
import CartIcon from "@/components/icons/CartIcon";
import {ArrowRightIcon} from "@/components/icons/StoreIcons";
import {RevealWrapper} from 'next-reveal'
import {border, ink, muted, primary, primaryDark} from "@/lib/colors";

const Section = styled.section`
  padding-top: 20px;
  @media screen and (min-width: 768px) {
    padding-top: 28px;
  }
`;
const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 28px 20px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 85% 20%, rgba(255,255,255,.7) 0, transparent 40%),
    linear-gradient(135deg, #ecfdf3 0%, #d1fae5 55%, #bbf7d0 100%);
  overflow: hidden;
  @media screen and (min-width: 860px) {
    grid-template-columns: 1.15fr .85fr;
    align-items: center;
    gap: 40px;
    padding: 48px;
  }
`;
const Kicker = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: #fff;
  color: ${primaryDark};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .02em;
  text-transform: uppercase;
`;
const Headline = styled.h1`
  margin: 16px 0 12px;
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -.03em;
  color: ${ink};
  span{ color: ${primary}; }
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Lead = styled.p`
  margin: 0 0 24px;
  max-width: 480px;
  font-size: 1.05rem;
  color: #334155;
`;
const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const PickCard = styled.div`
  position: relative;
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 32px rgba(21, 128, 61, .12);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;
const PickBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
`;
const PickImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin-bottom: 12px;
  img{
    max-height: 180px;
    max-width: 100%;
    object-fit: contain;
  }
`;
const PickTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;
const PickDesc = styled.p`
  margin: 4px 0 14px;
  color: ${muted};
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const PickRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  strong{
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

export default function Featured({product}) {
  return (
    <Section>
      <Center>
        <Hero>
          <RevealWrapper origin={'left'} delay={0}>
            <div>
              <Kicker>Fresh groceries, delivered</Kicker>
              <Headline>Everyday groceries, <span>fresh</span> to your door.</Headline>
              <Lead>Fruits, vegetables, rice, juices and more at honest prices. Add to cart in a tap and pay securely with Stripe.</Lead>
              <Ctas>
                <ButtonLink href={'/products'} primary={1} size={'l'}>
                  Shop all products <ArrowRightIcon />
                </ButtonLink>
                <ButtonLink href={'/categories'} primary={1} outline={1} size={'l'}>
                  Browse categories
                </ButtonLink>
              </Ctas>
            </div>
          </RevealWrapper>
          {product && (
            <RevealWrapper delay={100}>
              <PickCard>
                <PickBadge>Today&apos;s pick</PickBadge>
                <PickImage>
                  <img src={product.images?.[0]} alt={product.title}/>
                </PickImage>
                <PickTitle>{product.title}</PickTitle>
                <PickDesc>{product.description}</PickDesc>
                <PickRow>
                  <strong>₹{product.price}</strong>
                  <div style={{display: 'flex', gap: 8}}>
                    <ButtonLink href={'/product/'+product._id} black={1} outline={1}>Details</ButtonLink>
                    <FlyingButton main _id={product._id} src={product.images?.[0]}>
                      <CartIcon /> Add
                    </FlyingButton>
                  </div>
                </PickRow>
              </PickCard>
            </RevealWrapper>
          )}
        </Hero>
      </Center>
    </Section>
  );
}
