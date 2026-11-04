import styled from "styled-components";
import {ink, muted} from "@/lib/colors";

const StyledTabs = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 20px;
  background-color: #f1f5f9;
  border-radius: 12px;
`;
const StyledTab = styled.button`
  border: 0;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  ${props => props.$active ? `
    background-color: #fff;
    color: ${ink};
    box-shadow: 0 1px 3px rgba(15,23,42,.12);
  ` : `
    background-color: transparent;
    color: ${muted};
  `}
`;

export default function Tabs({tabs,active,onChange}) {
  return (
    <StyledTabs role="tablist">
      {tabs.map(tabName => (
        <StyledTab
          key={tabName}
          role="tab"
          aria-selected={tabName === active}
          onClick={() => { onChange(tabName) }}
          $active={tabName === active}
        >{tabName}</StyledTab>
      ))}
    </StyledTabs>
  );
}
