import styled from "styled-components";
import {border, ink, primary} from "@/lib/colors";

export const fieldStyle = `
  width: 100%;
  padding: 11px 14px;
  margin-bottom: 10px;
  border: 1px solid ${border};
  border-radius: 10px;
  background-color: #fff;
  color: ${ink};
  font-size: 15px;
  transition: border-color .15s, box-shadow .15s;
  &::placeholder{
    color: #94a3b8;
  }
  &:focus{
    outline: none;
    border-color: ${primary};
    box-shadow: 0 0 0 3px rgba(21, 128, 61, .15);
  }
`;

const StyledInput = styled.input`
  ${fieldStyle}
`;

export default function Input(props) {
  return <StyledInput {...props} />
}
