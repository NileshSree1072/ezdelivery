import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import {debounce} from "lodash";
import Spinner from "@/components/Spinner";
import SearchIcon from "@/components/icons/SearchIcon";
import {background, muted} from "@/lib/colors";

const InputWrapper = styled.div`
  position: sticky;
  top: 69px;
  z-index: 5;
  margin: 0 -16px 20px;
  padding: 20px 16px 12px;
  background-color: ${background};
  @media screen and (min-width: 768px) {
    margin: 0 0 24px;
    padding: 28px 0 12px;
  }
`;
const SearchField = styled.div`
  position: relative;
  svg{
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${muted};
    pointer-events: none;
  }
  input{
    margin: 0;
    padding: 16px 18px 16px 50px;
    font-size: 1.1rem;
    border-radius: 14px;
  }
`;
const Message = styled.p`
  text-align: center;
  color: ${muted};
  font-size: 1.05rem;
  margin: 32px 0;
`;

export default function SearchPage() {
  const [phrase,setPhrase] = useState('');
  const [products,setProducts] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const debouncedSearch = useCallback(
    debounce(searchProducts, 500), []
  );
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios.get('/api/products?phrase='+encodeURIComponent(phrase))
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Header />
      <main>
        <Center>
          <InputWrapper>
            <SearchField>
              <SearchIcon />
              <Input
                autoFocus
                type="search"
                aria-label="Search products"
                value={phrase}
                onChange={ev => setPhrase(ev.target.value)}
                placeholder="Search fruits, rice, juices…" />
            </SearchField>
          </InputWrapper>
          {phrase === '' && (
            <Message>Start typing to find products.</Message>
          )}
          {!isLoading && phrase !== '' && products.length === 0 && (
            <Message>No products found for &quot;{phrase}&quot;.</Message>
          )}
          {isLoading && (
            <Spinner fullWidth={true} />
          )}
          {!isLoading && products.length > 0 && (
            <ProductsGrid products={products} />
          )}
        </Center>
      </main>
      <Footer />
    </>
  );
}
