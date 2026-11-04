import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styled from "styled-components";
import Link from "next/link";
import Center from "@/components/Center";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import Title from "@/components/Title";
import {useContext, useEffect, useRef, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Input from "@/components/Input";
import {RevealWrapper} from "next-reveal";
import {useSession} from "next-auth/react";
import {BagIcon, CheckCircleIcon, ShieldIcon} from "@/components/icons/StoreIcons";
import {border, danger, ink, muted, primary, primarySoft, radius, shadow} from "@/lib/colors";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 40px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1.4fr 1fr;
    align-items: start;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: ${radius};
  box-shadow: ${shadow};
  padding: 20px;
  @media screen and (min-width: 768px) {
    padding: 24px;
  }
  h2{
    margin: 0 0 16px;
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const StickyBox = styled(Box)`
  @media screen and (min-width: 900px) {
    position: sticky;
    top: 88px;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid ${border};
  &:first-child{ border-top: 0; padding-top: 0; }
  @media screen and (min-width: 768px) {
    grid-template-columns: 88px 1fr auto auto;
    gap: 18px;
  }
`;

const ItemImage = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${border};
  border-radius: 12px;
  background-color: #fff;
  img{
    max-width: 58px;
    max-height: 58px;
    object-fit: contain;
  }
  @media screen and (min-width: 768px) {
    width: 88px;
    height: 88px;
    img{ max-width: 70px; max-height: 70px; }
  }
`;

const ItemInfo = styled.div`
  min-width: 0;
  a{
    color: ${ink};
    font-weight: 600;
    text-decoration: none;
    &:hover{ text-decoration: underline; }
  }
  span{
    display: block;
    color: ${muted};
    font-size: 14px;
  }
`;

const Stepper = styled.div`
  grid-column: 2 / 3;
  display: inline-flex;
  align-items: center;
  width: max-content;
  border: 1px solid ${border};
  border-radius: 10px;
  overflow: hidden;
  button{
    width: 36px;
    height: 36px;
    border: 0;
    background-color: #fff;
    color: ${primary};
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    &:hover{ background-color: ${primarySoft}; }
  }
  span{
    min-width: 36px;
    text-align: center;
    font-weight: 600;
  }
  @media screen and (min-width: 768px) {
    grid-column: auto;
  }
`;

const LineTotal = styled.div`
  grid-column: 3 / 4;
  grid-row: 1 / 3;
  font-weight: 700;
  text-align: right;
  @media screen and (min-width: 768px) {
    grid-column: auto;
    grid-row: auto;
    min-width: 72px;
  }
`;

const Summary = styled.dl`
  margin: 16px 0 0;
  padding-top: 16px;
  border-top: 1px dashed ${border};
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 8px;
  dt{ color: ${muted}; }
  dd{ margin: 0; text-align: right; font-weight: 600; }
  dt.total, dd.total{
    padding-top: 10px;
    border-top: 1px solid ${border};
    color: ${ink};
    font-size: 1.15rem;
    font-weight: 800;
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Note = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 0;
  color: ${muted};
  font-size: 13px;
  svg{ width: 16px; height: 16px; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 12px;
  svg{
    width: 48px;
    height: 48px;
    color: ${primary};
  }
  h2{ margin: 12px 0 6px; }
  p{ color: ${muted}; margin: 0 0 20px; }
`;

const SuccessBox = styled(Box)`
  max-width: 560px;
  margin: 48px auto;
  text-align: center;
  padding: 40px 24px;
  svg{
    width: 64px;
    height: 64px;
    color: ${primary};
  }
  h1{
    margin: 12px 0 8px;
    font-size: 1.75rem;
    font-weight: 800;
  }
  p{ color: ${muted}; margin: 0 0 24px; }
`;

export default function CartPage() {
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const {data:session} = useSession();
  const [products,setProducts] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const checkoutInFlight = useRef(false);
  useEffect(() => {
    // Coming back from Stripe with the Back button can restore this page from the browser
    // cache with the button still locked, so unlock it.
    function onPageShow(event) {
      if (event.persisted) {
        checkoutInFlight.current = false;
        setIsRedirecting(false);
      }
    }
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (sessionId) {
        axios.post('/api/confirm-payment', {sessionId}).catch(() => {
          // The Stripe webhook, if configured, will still mark the order as paid.
        });
      }
    }
    axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data.value);
    })
  }, []);
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get('/api/address').then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
    });
  }, [session]);
  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  async function goToPayment() {
    // Each call creates an order and a Stripe session, so ignore clicks while one is in flight.
    if (checkoutInFlight.current) {
      return;
    }
    checkoutInFlight.current = true;
    setIsRedirecting(true);
    setCheckoutError('');
    try {
      const response = await axios.post('/api/checkout', {
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        cartProducts,
      });

      if (response.data.url) {
        window.location = response.data.url;
        return;   // keep the button locked while the browser leaves for Stripe
      }
      throw new Error('No payment URL returned');
    } catch (error) {
      console.error("Error:", error);
      setCheckoutError('Could not start the payment. Please try again.');
      checkoutInFlight.current = false;
      setIsRedirecting(false);
    }
  }
  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    productsTotal += price;
  }
  const itemCount = cartProducts.length;

  if (isSuccess) {
    return (
      <>
        <Header />
        <main>
          <Center>
            <SuccessBox>
              <CheckCircleIcon />
              <h1>Thanks for your order!</h1>
              <p>Your payment was received. We&apos;ll email you when your order is on its way.</p>
              <ButtonLink href="/products" primary={1} size="l">Continue shopping</ButtonLink>
            </SuccessBox>
          </Center>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <main>
        <Center>
          <Title>Your cart</Title>
          {!itemCount && (
            <Box>
              <EmptyState>
                <BagIcon />
                <h2>Your cart is empty</h2>
                <p>Fresh fruits, rice, juices and more are waiting for you.</p>
                <ButtonLink href="/products" primary={1} size="l">Start shopping</ButtonLink>
              </EmptyState>
            </Box>
          )}
          {!!itemCount && (
            <ColumnsWrapper>
              <RevealWrapper delay={0}>
                <Box>
                  <h2>{itemCount} {itemCount === 1 ? 'item' : 'items'}</h2>
                  <ItemList>
                    {products.map(product => {
                      const quantity = cartProducts.filter(id => id === product._id).length;
                      return (
                        <Item key={product._id}>
                          <ItemImage>
                            <img src={product.images[0]} alt=""/>
                          </ItemImage>
                          <ItemInfo>
                            <Link href={'/product/'+product._id}>{product.title}</Link>
                            <span>₹{product.price} each</span>
                          </ItemInfo>
                          <Stepper>
                            <button type="button" aria-label={`Remove one ${product.title}`}
                                    onClick={() => lessOfThisProduct(product._id)}>−</button>
                            <span aria-live="polite">{quantity}</span>
                            <button type="button" aria-label={`Add one ${product.title}`}
                                    onClick={() => moreOfThisProduct(product._id)}>+</button>
                          </Stepper>
                          <LineTotal>₹{quantity * product.price}</LineTotal>
                        </Item>
                      );
                    })}
                  </ItemList>
                </Box>
              </RevealWrapper>
              <RevealWrapper delay={100}>
                <StickyBox>
                  <h2>Delivery details</h2>
                  <Input type="text"
                         placeholder="Full name"
                         aria-label="Full name"
                         autoComplete="name"
                         value={name}
                         name="name"
                         onChange={ev => setName(ev.target.value)} />
                  <Input type="email"
                         placeholder="Email"
                         aria-label="Email"
                         autoComplete="email"
                         value={email}
                         name="email"
                         onChange={ev => setEmail(ev.target.value)}/>
                  <Input type="text"
                         placeholder="Street address"
                         aria-label="Street address"
                         autoComplete="street-address"
                         value={streetAddress}
                         name="streetAddress"
                         onChange={ev => setStreetAddress(ev.target.value)}/>
                  <FieldRow>
                    <Input type="text"
                           placeholder="City"
                           aria-label="City"
                           autoComplete="address-level2"
                           value={city}
                           name="city"
                           onChange={ev => setCity(ev.target.value)}/>
                    <Input type="text"
                           placeholder="Postal code"
                           aria-label="Postal code"
                           autoComplete="postal-code"
                           value={postalCode}
                           name="postalCode"
                           onChange={ev => setPostalCode(ev.target.value)}/>
                  </FieldRow>
                  <Input type="text"
                         placeholder="Country"
                         aria-label="Country"
                         autoComplete="country-name"
                         value={country}
                         name="country"
                         onChange={ev => setCountry(ev.target.value)}/>
                  <Summary>
                    <dt>Subtotal</dt>
                    <dd>₹{productsTotal}</dd>
                    <dt>Delivery</dt>
                    <dd>₹{shippingFee ?? 0}</dd>
                    <dt className="total">Total</dt>
                    <dd className="total">₹{productsTotal + parseInt(shippingFee || 0)}</dd>
                  </Summary>
                  <div style={{marginTop: 20}}>
                    <Button primary block size="l"
                            disabled={isRedirecting}
                            onClick={goToPayment}>
                      {isRedirecting ? 'Redirecting to payment…' : 'Continue to payment'}
                    </Button>
                  </div>
                  {checkoutError && (
                    <p role="alert" style={{color: danger, marginTop: '10px', marginBottom: 0}}>{checkoutError}</p>
                  )}
                  <Note><ShieldIcon /> Secure payment with Stripe</Note>
                </StickyBox>
              </RevealWrapper>
            </ColumnsWrapper>
          )}
        </Center>
      </main>
      <Footer />
    </>
  );
}
