import styled from "styled-components";
import Link from "next/link";
import {useState} from "react";
import FlyingButton from "@/components/FlyingButton";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import {border, ink, muted, radius} from "@/lib/colors";
import axios from "axios";

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: ${radius};
  overflow: hidden;
  transition: box-shadow .2s, transform .2s;
  &:hover{
    box-shadow: 0 8px 24px rgba(15, 23, 42, .08);
    transform: translateY(-2px);
  }
`;
const ImageLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #f1f5f9;
  img{
    max-width: 100%;
    max-height: 110px;
    object-fit: contain;
    transition: transform .2s;
  }
  ${Card}:hover & img{
    transform: scale(1.05);
  }
  @media screen and (min-width: 768px) {
    height: 180px;
    img{ max-height: 140px; }
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  padding: 12px 14px 14px;
`;
const Title = styled(Link)`
  color: ${ink};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.35;
  min-height: 2.7em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &:hover{ text-decoration: underline; }
`;
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
`;
const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${ink};
  small{
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: ${muted};
  }
`;
const WishlistButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid ${border};
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  color: ${props => props.$wished ? '#e11d48' : muted};
  svg{ width: 16px; }
  &:hover{ color: #e11d48; }
`;

export default function ProductBox({
  _id,title,price,images,wished=false,
  onRemoveFromWishlist=()=>{},
}) {
  const url = '/product/'+_id;
  const [isWished,setIsWished] = useState(wished);
  function addToWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios.post('/api/wishlist', {
      product: _id,
    }).then(() => {});
    setIsWished(nextValue);
  }
  return (
    <Card>
      <WishlistButton
        $wished={isWished}
        onClick={addToWishlist}
        aria-label={isWished ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
        aria-pressed={isWished}>
        {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
      </WishlistButton>
      <ImageLink href={url} tabIndex={-1} aria-hidden="true">
        <img src={images?.[0]} alt=""/>
      </ImageLink>
      <Info>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>₹{price}</Price>
          <FlyingButton _id={_id} src={images?.[0]} aria-label={`Add ${title} to cart`}>+ Add</FlyingButton>
        </PriceRow>
      </Info>
    </Card>
  );
}
