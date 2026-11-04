import {createGlobalStyle} from "styled-components";
import {CartContextProvider} from "@/components/CartContext";
import {SessionProvider} from "next-auth/react";
import {background, ink, primary} from "@/lib/colors";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after{
    box-sizing: border-box;
  }
  body{
    background-color: ${background};
    color: ${ink};
    padding:0;
    margin:0;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }
  a{
    color: ${primary};
  }
  img{
    max-width: 100%;
  }
  /* Keep the footer at the bottom of the window on short pages. */
  #__next{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  #__next > main{
    flex: 1;
  }
  hr{
    display: block;
    border:0;
    border-top:1px solid #e5e7eb;
    margin: 20px 0;
  }
  button, input, select, textarea{
    font-family: inherit;
  }
  :focus-visible{
    outline: 2px solid ${primary};
    outline-offset: 2px;
  }
`;

export default function App({ Component, pageProps: {session, ...pageProps } }) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
