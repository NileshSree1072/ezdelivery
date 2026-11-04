import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import Center from "@/components/Center";
import {signIn, signOut, useSession} from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import {RevealWrapper} from "next-reveal";
import Input from "@/components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";
import {UserIcon} from "@/components/icons/StoreIcons";
import {muted, primary, primarySoft} from "@/lib/colors";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 40px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1.4fr 1fr;
    align-items: start;
  }
  h2{
    margin: 0 0 16px;
    font-size: 1.2rem;
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 10px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const Muted = styled.p`
  color: ${muted};
  margin: 0;
`;

const SignIn = styled.div`
  text-align: center;
  padding: 8px 0;
  span.avatar{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 999px;
    background-color: ${primarySoft};
    color: ${primary};
    svg{ width: 28px; height: 28px; }
  }
  p{
    color: ${muted};
    margin: 12px 0 20px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  img{
    width: 44px;
    height: 44px;
    border-radius: 999px;
  }
  strong{ display: block; }
  span{ color: ${muted}; font-size: 14px; }
`;

export default function AccountPage() {
  const {data:session} = useSession();
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [addressLoaded,setAddressLoaded] = useState(true);
  const [wishlistLoaded,setWishlistLoaded] = useState(true);
  const [orderLoaded,setOrderLoaded] = useState(true);
  const [wishedProducts,setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [saved, setSaved] = useState(false);

  async function logout() {
    await signOut({
      callbackUrl: '/',
    });
  }
  async function login() {
    await signIn('google');
  }
  function saveAddress() {
    const data = {name,email,city,streetAddress,postalCode,country};
    axios.put('/api/address', data).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }
  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);
    axios.get('/api/address').then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
      setAddressLoaded(true);
    });
    axios.get('/api/wishlist').then(response => {
      setWishedProducts(response.data.map(wp => wp.product));
      setWishlistLoaded(true);
    });
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);
  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(products => {
      return [...products.filter(p => p._id.toString() !== idToRemove)];
    });
  }
  return (
    <>
      <Header />
      <main>
        <Center>
          <Title>My account</Title>
          <ColsWrapper>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={['Orders','Wishlist']}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === 'Orders' && (
                  <>
                    {!orderLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <Muted>{session ? 'You have no orders yet.' : 'Sign in to see your orders.'}</Muted>
                        )}
                        {orders.length > 0 && orders.map(o => (
                          <SingleOrder key={o._id} {...o} />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'Wishlist' && (
                  <>
                    {!wishlistLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {wishlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 && wishedProducts.map(wp => (
                            <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} />
                          ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <Muted>
                            {session ? 'Your wishlist is empty. Tap the heart on any product to save it.' : 'Sign in to add products to your wishlist.'}
                          </Muted>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
            <RevealWrapper delay={100}>
              <WhiteBox>
                {!session && (
                  <SignIn>
                    <span className="avatar"><UserIcon /></span>
                    <h2>Sign in to EzDelivery</h2>
                    <p>Track your orders, save addresses and keep a wishlist.</p>
                    <Button primary block size="l" onClick={login}>Continue with Google</Button>
                  </SignIn>
                )}
                {session && (
                  <>
                    <Profile>
                      {session.user?.image && <img src={session.user.image} alt=""/>}
                      <div>
                        <strong>{session.user?.name}</strong>
                        <span>{session.user?.email}</span>
                      </div>
                    </Profile>
                    <h2>Delivery address</h2>
                    {!addressLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {addressLoaded && (
                      <>
                        <Input type="text"
                               placeholder="Full name"
                               aria-label="Full name"
                               value={name}
                               name="name"
                               onChange={ev => setName(ev.target.value)} />
                        <Input type="email"
                               placeholder="Email"
                               aria-label="Email"
                               value={email}
                               name="email"
                               onChange={ev => setEmail(ev.target.value)}/>
                        <Input type="text"
                               placeholder="Street address"
                               aria-label="Street address"
                               value={streetAddress}
                               name="streetAddress"
                               onChange={ev => setStreetAddress(ev.target.value)}/>
                        <FieldRow>
                          <Input type="text"
                                 placeholder="City"
                                 aria-label="City"
                                 value={city}
                                 name="city"
                                 onChange={ev => setCity(ev.target.value)}/>
                          <Input type="text"
                                 placeholder="Postal code"
                                 aria-label="Postal code"
                                 value={postalCode}
                                 name="postalCode"
                                 onChange={ev => setPostalCode(ev.target.value)}/>
                        </FieldRow>
                        <Input type="text"
                               placeholder="Country"
                               aria-label="Country"
                               value={country}
                               name="country"
                               onChange={ev => setCountry(ev.target.value)}/>
                        <Button primary block onClick={saveAddress}>
                          {saved ? 'Saved ✓' : 'Save address'}
                        </Button>
                      </>
                    )}
                    <hr/>
                    <Button black outline block onClick={logout}>Log out</Button>
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </ColsWrapper>
        </Center>
      </main>
      <Footer />
    </>
  );
}
