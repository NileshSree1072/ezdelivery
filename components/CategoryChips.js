import styled from "styled-components";
import Link from "next/link";
import {border, ink, primary, primaryDark, primarySoft} from "@/lib/colors";

const Row = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
`;
const Chip = styled(Link)`
  flex-shrink: 0;
  padding: 10px 18px;
  border: 1px solid ${border};
  border-radius: 999px;
  background-color: #fff;
  color: ${ink};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  &:hover{
    border-color: ${primary};
    background-color: ${primarySoft};
    color: ${primaryDark};
  }
`;

export default function CategoryChips({categories = []}) {
  if (!categories.length) {
    return null;
  }
  return (
    <Row>
      {categories.map(cat => (
        <Chip key={cat._id} href={'/category/'+cat._id}>{cat.name}</Chip>
      ))}
    </Row>
  );
}
