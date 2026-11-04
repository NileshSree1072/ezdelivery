import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {LeafIcon} from "@/components/icons/StoreIcons";

const StyledFooter = styled.footer`
  margin-top: 64px;
  background-color: #14532d;
  color: #d1fae5;
  padding: 40px 0 24px;
`;
const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
  h3{
    margin: 0 0 12px;
    color: #fff;
    font-size: 15px;
  }
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  a{
    color: #d1fae5;
    text-decoration: none;
    &:hover{ color: #fff; text-decoration: underline; }
  }
`;
const Brand = styled.div`
  p{
    margin: 10px 0 0;
    max-width: 340px;
    color: #a7f3d0;
    font-size: 15px;
  }
  div{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-weight: 800;
    font-size: 1.2rem;
    svg{ width: 22px; height: 22px; }
  }
`;
const Bottom = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid rgba(209, 250, 229, .2);
  font-size: 14px;
  color: #a7f3d0;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <Center>
        <Columns>
          <Brand>
            <div><LeafIcon /> EzDelivery</div>
            <p>Fresh fruits, vegetables, rice, juices and everyday groceries, delivered to your door.</p>
          </Brand>
          <nav aria-label="Shop">
            <h3>Shop</h3>
            <ul>
              <li><Link href="/products">All products</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/search">Search</Link></li>
            </ul>
          </nav>
          <nav aria-label="Your account">
            <h3>Your account</h3>
            <ul>
              <li><Link href="/account">Orders &amp; wishlist</Link></li>
              <li><Link href="/cart">Cart</Link></li>
            </ul>
          </nav>
        </Columns>
        <Bottom>© {new Date().getFullYear()} EzDelivery. Payments are processed securely by Stripe.</Bottom>
      </Center>
    </StyledFooter>
  );
}
