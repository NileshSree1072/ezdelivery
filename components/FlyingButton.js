import styled from "styled-components";
import {ButtonStyle} from "@/components/Button";
import {primary, primaryDark, primarySoft} from "@/lib/colors";
import {CartContext} from "@/components/CartContext";
import {useContext, useEffect, useRef} from "react";

const FlyingButtonWrapper = styled.div`
  ${props => props.$block && 'width: 100%;'}
  button{
    ${ButtonStyle};
    ${props => props.$block && 'width: 100%;'}
    ${props => props.$main ? `
      background-color: ${primary};
      color: #fff;
      &:hover{ background-color: ${primaryDark}; }
    ` : `
      background-color: ${primarySoft};
      border-color: transparent;
      color: ${primaryDark};
      padding: 8px 14px;
      &:hover{ background-color: ${primary}; color: #fff; }
    `}
    ${props => props.$white && `
      background-color: #fff;
      color: ${primaryDark};
      &:hover{ background-color: #f1f5f9; color: ${primaryDark}; }
    `}
  }
  @keyframes fly{
    100%{
      top: 10px;
      left: calc(100% - 90px);
      opacity: 0;
      max-width: 40px;
      max-height: 40px;
    }
  }
  img{
    display: none;
    max-width: 100px;
    max-height: 100px;
    opacity: 1;
    position: fixed;
    z-index: 20;
    animation: fly 1s;
    border-radius: 10px;
    pointer-events: none;
  }
`;

// "Add to cart" button that animates the product image towards the cart.
export default function FlyingButton({_id, src, main, white, block, size, ...buttonProps}) {
  const {addProduct} = useContext(CartContext);
  const imgRef = useRef();
  function sendImageToCart(ev) {
    imgRef.current.style.display = 'inline-block';
    imgRef.current.style.left = (ev.clientX-50) + 'px';
    imgRef.current.style.top = (ev.clientY-50) + 'px';
    setTimeout(() => {
      if (imgRef.current) {
        imgRef.current.style.display = 'none';
      }
    }, 1000);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imgRef.current?.closest('div[data-sr-id]');
      if (reveal?.style.opacity === '1') {
        reveal.style.transform = 'none';
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <FlyingButtonWrapper
      $white={white}
      $main={main}
      $block={block}
      size={size}
      onClick={() => addProduct(_id)}>
      <img src={src} alt="" ref={imgRef} />
      <button type="button" onClick={ev => sendImageToCart(ev)} {...buttonProps} />
    </FlyingButtonWrapper>
  );
}
