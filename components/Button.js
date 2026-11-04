import styled, {css} from "styled-components";
import {ink, primary, primaryDark, primarySoft} from "@/lib/colors";

export const ButtonStyle = css`
  border: 1px solid transparent;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-family: inherit;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  transition: background-color .15s, border-color .15s, color .15s, transform .05s;
  svg{
    height: 18px;
  }
  &:active:not(:disabled){
    transform: translateY(1px);
  }
  &:disabled{
    opacity: .6;
    cursor: not-allowed;
  }
  ${props => props.block && css`
    display: flex;
    width: 100%;
  `}
  ${props => props.white && !props.outline && css`
    background-color: #fff;
    color: ${ink};
    &:hover{ background-color: #f1f5f9; }
  `}
  ${props => props.white && props.outline && css`
    background-color: transparent;
    color: #fff;
    border-color: rgba(255,255,255,.7);
    &:hover{ background-color: rgba(255,255,255,.12); }
  `}
  ${props => props.black && !props.outline && css`
    background-color: ${ink};
    color: #fff;
    &:hover{ background-color: #1e293b; }
  `}
  ${props => props.black && props.outline && css`
    background-color: transparent;
    color: ${ink};
    border-color: ${ink};
    &:hover{ background-color: #f1f5f9; }
  `}
  ${props => props.primary && !props.outline && css`
    background-color: ${primary};
    color: #fff;
    &:hover:not(:disabled){ background-color: ${primaryDark}; }
  `}
  ${props => props.primary && props.outline && css`
    background-color: #fff;
    border-color: ${primary};
    color: ${primary};
    &:hover:not(:disabled){ background-color: ${primarySoft}; }
  `}
  ${props => props.size === 'l' && css`
    font-size: 1.05rem;
    padding: 14px 24px;
    svg{
      height: 20px;
    }
  `}
  ${props => props.size === 's' && css`
    font-size: 14px;
    padding: 7px 12px;
  `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({children,...rest}) {
  return (
    <StyledButton {...rest}>{children}</StyledButton>
  );
}
