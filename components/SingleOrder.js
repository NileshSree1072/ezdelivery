import styled from "styled-components";
import {border, muted} from "@/lib/colors";

const StyledOrder = styled.div`
  padding: 16px 0;
  border-top: 1px solid ${border};
  &:first-child{ border-top: 0; padding-top: 0; }
`;
const OrderHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  time{
    font-weight: 600;
  }
`;
const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  ${props => props.$paid ? `
    background-color: #dcfce7;
    color: #166534;
  ` : `
    background-color: #fef3c7;
    color: #92400e;
  `}
`;
const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  @media screen and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const ProductRow = styled.div`
  font-size: 15px;
  span{
    color: ${muted};
  }
`;
const Address = styled.div`
  font-size: 14px;
  color: ${muted};
`;

export default function SingleOrder({line_items,createdAt,paid,...rest}) {
  return (
    <StyledOrder>
      <OrderHeader>
        <time dateTime={createdAt}>
          {(new Date(createdAt)).toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short'})}
        </time>
        <StatusBadge $paid={paid}>{paid ? 'Paid' : 'Payment pending'}</StatusBadge>
      </OrderHeader>
      <Body>
        <div>
          {line_items.map(item => (
            <ProductRow key={item.price_data.product_data.name} >
              <span>{item.quantity} × </span>
              {item.price_data.product_data.name}
            </ProductRow>
          ))}
        </div>
        <Address>
          {rest.name}<br />
          {rest.streetAddress}<br />
          {rest.postalCode} {rest.city}, {rest.country}
        </Address>
      </Body>
    </StyledOrder>
  );
}
