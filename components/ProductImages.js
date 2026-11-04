import styled from "styled-components";
import {useState} from "react";
import {border, primary} from "@/lib/colors";

const BigImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  @media screen and (min-width: 768px) {
    height: 400px;
  }
`;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
const ImageButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;
const ImageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  padding: 6px;
  background-color: #fff;
  border: 2px solid ${props => props.$active ? primary : border};
  border-radius: 10px;
  cursor: pointer;
  img{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export default function ProductImages({images = [], title = ''}) {
  const [activeImage,setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} alt={title} />
      </BigImageWrapper>
      {images.length > 1 && (
        <ImageButtons>
          {images.map((image, index) => (
            <ImageButton
              key={image}
              type="button"
              aria-label={`Show image ${index + 1}`}
              $active={image===activeImage}
              onClick={() => setActiveImage(image)}>
              <img src={image} alt=""/>
            </ImageButton>
          ))}
        </ImageButtons>
      )}
    </>
  );
}
