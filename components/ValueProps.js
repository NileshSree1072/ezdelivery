import styled from "styled-components";
import Center from "@/components/Center";
import {LeafIcon, ShieldIcon, TruckIcon} from "@/components/icons/StoreIcons";
import {border, muted, primary, primarySoft} from "@/lib/colors";

const Grid = styled.ul`
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;
const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: 14px;
  span.icon{
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background-color: ${primarySoft};
    color: ${primary};
    svg{ width: 22px; height: 22px; }
  }
  strong{
    display: block;
    font-size: 15px;
  }
  span.text{
    color: ${muted};
    font-size: 14px;
  }
`;

const items = [
  {icon: <TruckIcon />, title: 'Doorstep delivery', text: 'Order online, we bring it to you'},
  {icon: <LeafIcon />, title: 'Fresh produce', text: 'Fruits, vegetables and pantry staples'},
  {icon: <ShieldIcon />, title: 'Secure payments', text: 'Checkout powered by Stripe'},
];

export default function ValueProps() {
  return (
    <Center>
      <Grid>
        {items.map(item => (
          <Item key={item.title}>
            <span className="icon">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <span className="text">{item.text}</span>
            </div>
          </Item>
        ))}
      </Grid>
    </Center>
  );
}
