import styled from "styled-components";
import Link from "next/link";
import {primary} from "@/lib/colors";

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin: 40px 0 16px;
  h2{
    margin: 0;
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -.02em;
    @media screen and (min-width: 768px) {
      font-size: 1.6rem;
    }
  }
  a{
    color: ${primary};
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    &:hover{ text-decoration: underline; }
  }
`;

export default function SectionHeader({title, href, linkLabel = 'View all →', as = 'h2'}) {
  const Heading = as;
  return (
    <Wrapper>
      <Heading>{title}</Heading>
      {href && <Link href={href}>{linkLabel}</Link>}
    </Wrapper>
  );
}
