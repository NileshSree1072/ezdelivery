import styled from "styled-components";
import {border, radius, shadow} from "@/lib/colors";

const WhiteBox = styled.div`
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: ${radius};
  box-shadow: ${shadow};
  padding: 20px;
  @media screen and (min-width: 768px) {
    padding: 28px;
  }
`;

export default WhiteBox;
