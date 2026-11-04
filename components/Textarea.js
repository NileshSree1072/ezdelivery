import styled from "styled-components";
import {fieldStyle} from "@/components/Input";

const StyledArea = styled.textarea`
  ${fieldStyle}
  min-height: 100px;
  resize: vertical;
`;

export default function Textarea(props) {
  return <StyledArea {...props} />;
}
