import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";
import {BagIcon, CloseIcon, LeafIcon, UserIcon} from "@/components/icons/StoreIcons";
import {border, ink, muted, primary, primaryDark, primarySoft} from "@/lib/colors";

const StyledHeader = styled.header`
  background-color: rgba(255,255,255,.95);
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid ${border};
  position: sticky;
  top: 0;
  z-index: 10;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 68px;
  @media screen and (min-width: 768px) {
    gap: 24px;
  }
`;
const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${ink};
  text-decoration: none;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -.02em;
  white-space: nowrap;
  span.mark{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: ${primary};
    color: #fff;
    svg{ width: 20px; height: 20px; }
  }
  span.accent{ color: ${primary}; }
`;
const SearchPill = styled(Link)`
  display: none;
  flex: 1;
  max-width: 420px;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid ${border};
  border-radius: 999px;
  background-color: #f8fafc;
  color: ${muted};
  text-decoration: none;
  font-size: 15px;
  svg{ width: 16px; height: 16px; }
  &:hover{ border-color: ${primary}; }
  @media screen and (min-width: 900px) {
    display: flex;
  }
`;
const DesktopNav = styled.nav`
  display: none;
  gap: 4px;
  margin-left: auto;
  @media screen and (min-width: 768px) {
    display: flex;
  }
`;
const NavLink = styled(Link)`
  color: ${props => props.$active ? primary : ink};
  background-color: ${props => props.$active ? primarySoft : 'transparent'};
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  &:hover{ background-color: ${primarySoft}; color: ${primaryDark}; }
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  @media screen and (min-width: 768px) {
    margin-left: 0;
  }
`;
const IconLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: ${ink};
  svg{ width: 20px; height: 20px; }
  &:hover{ background-color: #f1f5f9; }
`;
const SearchIconLink = styled(IconLink)`
  @media screen and (min-width: 900px) {
    display: none;
  }
`;
const CartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 10px;
  background-color: ${primary};
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  svg{ width: 18px; height: 18px; }
  &:hover{ background-color: ${primaryDark}; }
  span.count{
    min-width: 22px;
    padding: 1px 7px;
    border-radius: 999px;
    background-color: #fff;
    color: ${primary};
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  span.label{
    display: none;
    @media screen and (min-width: 480px) {
      display: inline;
    }
  }
`;
const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 10px;
  background-color: transparent;
  color: ${ink};
  cursor: pointer;
  svg{ width: 22px; height: 22px; }
  &:hover{ background-color: #f1f5f9; }
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const MobileNav = styled.nav`
  display: ${props => props.$open ? 'flex' : 'none'};
  flex-direction: column;
  gap: 4px;
  padding: 8px 0 16px;
  border-top: 1px solid ${border};
  a{
    padding: 12px;
    font-size: 16px;
  }
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const links = [
  {href: '/', label: 'Home'},
  {href: '/products', label: 'All products'},
  {href: '/categories', label: 'Categories'},
];

export default function Header() {
  const {cartProducts} = useContext(CartContext);
  const [mobileNavActive,setMobileNavActive] = useState(false);
  const router = useRouter();

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMobileNavActive(false);
  }, [router.asPath]);

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <MenuButton
            aria-label={mobileNavActive ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavActive}
            aria-controls="mobile-menu"
            onClick={() => setMobileNavActive(prev => !prev)}>
            {mobileNavActive ? <CloseIcon /> : <BarsIcon />}
          </MenuButton>
          <Logo href={'/'} aria-label="EzDelivery home">
            <span className="mark"><LeafIcon /></span>
            <span>Ez<span className="accent">Delivery</span></span>
          </Logo>
          <SearchPill href={'/search'}>
            <SearchIcon /> Search fruits, rice, juices…
          </SearchPill>
          <DesktopNav>
            {links.map(l => (
              <NavLink key={l.href} href={l.href} $active={router.pathname === l.href}>{l.label}</NavLink>
            ))}
          </DesktopNav>
          <Actions>
            <SearchIconLink href={'/search'} aria-label="Search"><SearchIcon /></SearchIconLink>
            <IconLink href={'/account'} aria-label="Account"><UserIcon /></IconLink>
            <CartButton href={'/cart'} aria-label={`Cart, ${cartProducts.length} items`}>
              <BagIcon />
              <span className="label">Cart</span>
              <span className="count">{cartProducts.length}</span>
            </CartButton>
          </Actions>
        </Wrapper>
        <MobileNav id="mobile-menu" aria-label="Main menu" $open={mobileNavActive}>
          {links.map(l => (
            <NavLink key={l.href} href={l.href} $active={router.pathname === l.href}>{l.label}</NavLink>
          ))}
          <NavLink href={'/account'} $active={router.pathname === '/account'}>Account</NavLink>
        </MobileNav>
      </Center>
    </StyledHeader>
  );
}
