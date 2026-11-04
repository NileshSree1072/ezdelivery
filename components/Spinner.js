import {BounceLoader} from "react-spinners";
import styled from "styled-components";
import {primary} from "@/lib/colors";

const Wrapper = styled.div`
  ${props => props.fullWidth && `
    display: flex;
    justify-content: center;
    padding: 24px 0;
  `}
`;

export default function Spinner({fullWidth}){
  return(
    <Wrapper fullWidth={fullWidth}>
      <BounceLoader speedMultiplier={3} color={primary} size={40}/>
    </Wrapper>
  );
}
