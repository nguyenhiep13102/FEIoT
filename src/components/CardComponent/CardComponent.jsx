/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Card, Image } from "antd";
import styled from "styled-components";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/vn-11134258-7ra0g-m65cso7t85xf99.png";
import env from '../../../env'
import { useNavigate } from "react-router-dom";
import { converPrice } from "../../utlis";
export const CardComponent = ({data}) => {
  const {countInStock , description ,image , name ,price , rating , type, discount,  selled, _id} = data;  
  const   imageproduct = `${env.API_AV}${image}`;
    
     const navigate = useNavigate();
     const handleDetailProduct = (id) =>{
      navigate(`/product-detail/${id}`)

     }
   const giakhigiam = (price, discount) => {
  return price - (price * (discount / 100));
};
  return (
    <WrapperCardContainer
    onClick= {()=>{
      handleDetailProduct(_id)
    }}

    
    >


      <WrapperCardStyle
        hoverable
        style={{ width: 200, height: 300 }}
        bodyStyle={{ padding: "10px" }}
        cover={
          <div style={{ position: "relative" }}>
            <WrapperImageStyle src={logo} alt="Logo" />
            <CoverImage
              src={imageproduct}
              alt="Product"
            />
          </div>
        }
      >

        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReporText>
          <span>
            <span>{rating}</span>
            <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
          </span>
          <span> |da ban {selled}+ </span>
        </WrapperReporText>
        <WrapperPriceText>
           {converPrice(price)}
          {/* {converPrice((price-( price*(discount/100))))} */}
         <WrapperDiscountText>-{discount}%</WrapperDiscountText>
        
        </WrapperPriceText>
        {/* <StrikethroughText>
         
        </StrikethroughText> */}
           {Number(countInStock) === 0 ? (
  <WrapperDiscountText>Hết hàng</WrapperDiscountText>
) : (
  <WrappercountInStockText>còn {countInStock} sản phẩm </WrappercountInStockText>
)}

      </WrapperCardStyle>
    </WrapperCardContainer>
  );
};

export default CardComponent;
const StrikethroughText = styled.div`
  /* text-decoration: line-through; */
`;
// Styled Components
const WrapperCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 300px;
  overflow: hidden; /* Ngăn tràn layout */
`;

const WrapperCardStyle = styled(Card)`
  width: 100%;
  height: 100%;
  overflow: hidden; /* Giữ nội dung trong thẻ */
  position: relative;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const WrapperImageStyle = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 68px;
  height: 14px;
  border-top-left-radius: 3px;
`;

const StyleNameProduct = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
  font-weight: 400;
  text-align: center;
`;

const WrapperReporText = styled.div`
  font-size: 10px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
`;

const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const WrapperDiscountText = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 500;
  margin-left: 5px;
`;
const WrappercountInStockText = styled.span`
  color: rgb(60, 168, 211);
  font-size: 12px;
  font-weight: 500;
  margin-left: 5px;
`;