/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Col, Image, InputNumber, message, Row, Tag, Space, Tooltip, Badge } from 'antd';
import styled from 'styled-components';
import {
  StarFilled,
  PlusOutlined,
  MinusOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import ButtonComponent from '../Buttoncomponent/Buttoncomponent';
import ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import env from '../../../env'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderProduct } from '../../redux/slides/Oderslice'
import { converPrice } from '../../utlis';

export const ProductDetailComponent = ({isProduct}) => {
    const { id } = useParams();
     const [numProduct , setnumProduct] = useState(1);
     const [selectedImage, setSelectedImage] = useState(0);
     const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

  if (!id) {
    return <div>Không có ID sản phẩm!</div>;
  }

  const fetchGetDetailsProduct = async (productId) => {
    const res = await ProductService.getProductDetail(productId);
     if (res.status === 'error') {
     throw new Error(res.message || 'Lỗi không xác định từ server');
  }
    return res;
  };

  const { isLoading, data: productDetail, error } = useQuery(
    ['product-detail', id],
    ({ queryKey }) => fetchGetDetailsProduct(queryKey[1]),
    {
      enabled: !!id,
      retry: false,
    }
  );

const   imageproduct = `${env.API_AV}${productDetail?.image}`;
const thumbnailImages = productDetail?.images || [imageproduct, imageproduct, imageproduct, imageproduct, imageproduct];

  if (isLoading) return (
    <LoadingContainer>
      <div className="loading-spinner"></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </LoadingContainer>
  );
  if (error) return <ErrorContainer>Lỗi: {error.message}</ErrorContainer>;
  if (!productDetail) return <ErrorContainer>Không tìm thấy sản phẩm</ErrorContainer>;

  const renderStar = (num, max = 5) => {
  return Array.from({ length: max }, (_, index) =>
    index < num ? (
      <StarFilled key={index} style={{ color: '#faad14', fontSize: '14px' }} />
    ) : (
      <StarOutlined key={index} style={{ color: '#d9d9d9', fontSize: '14px' }} />
    )
  );
};

 const onChange = (value) => {
    if (value >= 1 && value <= productDetail?.countInStock) {
      setnumProduct(value);
    }
  };

 const handleChangeCount = (type) => {
    setnumProduct((prev) => {
      if (type === 'increase' && prev < productDetail?.countInStock) return prev + 1;
      if (type === 'decrease') return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

 const handleAddOderProduct = (type = 'buy') => {
  if(!user?._id){
    navigate('/sign-in',{state :location?.pathname});
    return;
  }
  if(productDetail?.countInStock === 0){
      message.warning('Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác');
       navigate('/');
       return;
  }

  const orderData = {
    orderItems: {
      name: productDetail?.name,
      amount: numProduct,
      image: productDetail?.image,
      price: productDetail?.price,
      Product: productDetail?._id,
      discount: productDetail?.discount,
    }
  };

  dispatch(addOrderProduct(orderData));

  if (type === 'buy') {
    message.success('Đã thêm vào giỏ hàng, đang chuyển đến thanh toán...');
    setTimeout(() => navigate('/order'), 500);
  } else {
    message.success('Đã thêm sản phẩm vào giỏ hàng!');
  }
 };

  return (
    <Container>
      <Row gutter={[32, 32]} style={{padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
        <Col span={10}>
          <ImageContainer>
            <Badge.Ribbon text={productDetail?.discount > 0 ? `-${productDetail?.discount}%` : null} color="#ff4d4f" style={{ display: productDetail?.discount > 0 ? 'block' : 'none' }}>
              <MainImage
                src={thumbnailImages[selectedImage] || imageproduct}
                alt={productDetail?.name}
                preview={{
                  mask: <div style={{fontSize: '14px'}}>Xem ảnh lớn</div>
                }}
              />
            </Badge.Ribbon>
          </ImageContainer>

          <ThumbnailContainer>
            {thumbnailImages.map((img, index) => (
              <ThumbnailWrapper
                key={index}
                active={selectedImage === index}
                onClick={() => setSelectedImage(index)}
              >
                <ThumbnailImage
                  src={img}
                  alt={`thumbnail-${index}`}
                  preview={false}
                />
              </ThumbnailWrapper>
            ))}
          </ThumbnailContainer>

          <ActionRow>
            <ActionButton>
              <HeartOutlined style={{fontSize: '18px'}} />
              <span>Yêu thích</span>
            </ActionButton>
            <ActionButton>
              <ShareAltOutlined style={{fontSize: '18px'}} />
              <span>Chia sẻ</span>
            </ActionButton>
          </ActionRow>
        </Col>

        <Col span={14}>
          <ProductInfo>
            <ProductName>{productDetail?.name}</ProductName>

            <RatingRow>
              <RatingSection>
                {renderStar(productDetail?.rating)}
                <RatingText>{productDetail?.rating}/5</RatingText>
              </RatingSection>
              <Divider>|</Divider>
              <SellText>Đã bán {productDetail?.selled || 0}+</SellText>
            </RatingRow>

            <PriceSection>
              <CurrentPrice>
                {converPrice(productDetail?.price * (1 - productDetail?.discount/100))}
              </CurrentPrice>
              {productDetail?.discount > 0 && (
                <>
                  <OriginalPrice>{converPrice(productDetail?.price)}</OriginalPrice>
                  <DiscountTag>-{productDetail?.discount}%</DiscountTag>
                </>
              )}
            </PriceSection>

            <StockInfo>
              {productDetail?.countInStock === 0 ? (
                <OutOfStockTag color="red">Hết hàng</OutOfStockTag>
              ) : (
                <InStockTag color="green">Còn hàng: {productDetail?.countInStock} sản phẩm</InStockTag>
              )}
            </StockInfo>

            <InfoSection>
              <InfoRow>
                <InfoLabel>Giao đến:</InfoLabel>
                <InfoValue>
                  <span className='address'>{user?.addres || 'Chưa cập nhật địa chỉ'}</span>
                  <ChangeAddress>| Đổi địa chỉ</ChangeAddress>
                </InfoValue>
              </InfoRow>
            </InfoSection>

            <QuantitySection>
              <QuantityLabel>Số lượng:</QuantityLabel>
              <QuantityControl>
                <QuantityButton
                  onClick={() => handleChangeCount('decrease')}
                  disabled={numProduct <= 1}
                >
                  <MinusOutlined />
                </QuantityButton>

                <QuantityInput
                  controls={false}
                  onChange={onChange}
                  value={numProduct}
                  min={1}
                  max={productDetail?.countInStock}
                />

                <QuantityButton
                  onClick={() => handleChangeCount('increase')}
                  disabled={numProduct >= productDetail?.countInStock}
                >
                  <PlusOutlined />
                </QuantityButton>
              </QuantityControl>
              <StockHint>{productDetail?.countInStock} sản phẩm có sẵn</StockHint>
            </QuantitySection>

            <TotalSection>
              <TotalLabel>Tổng cộng:</TotalLabel>
              <TotalPrice>
                {converPrice(productDetail?.price * (1 - productDetail?.discount/100) * numProduct)}
              </TotalPrice>
            </TotalSection>

            <ButtonGroup>
              <BuyNowButton
                onClick={() => handleAddOderProduct('buy')}
                disabled={productDetail?.countInStock === 0}
                icon={<ThunderboltOutlined />}
              >
                Mua ngay
              </BuyNowButton>

              <AddToCartButton
                onClick={() => handleAddOderProduct('cart')}
                disabled={productDetail?.countInStock === 0}
                icon={<ShoppingCartOutlined />}
              >
                Thêm vào giỏ hàng
              </AddToCartButton>
            </ButtonGroup>

            <GuaranteeSection>
              <GuaranteeItem>
                <SafetyCertificateOutlined style={{color: '#52c41a', fontSize: '20px'}} />
                <span>Bảo hành chính hãng</span>
              </GuaranteeItem>
              <GuaranteeItem>
                <SwapOutlined style={{color: '#1890ff', fontSize: '20px'}} />
                <span>Đổi trả trong 7 ngày</span>
              </GuaranteeItem>
            </GuaranteeSection>
          </ProductInfo>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailComponent;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 12px;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  p {
    margin-top: 16px;
    color: #666;
    font-size: 16px;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 12px;
  color: #ff4d4f;
  font-size: 18px;
  font-weight: 500;
`;

const ImageContainer = styled.div`
  position: relative;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

const MainImage = styled(Image)`
  width: 100% !important;
  height: 500px !important;
  object-fit: contain;
  padding: 20px;
  background: #fff;

  img {
    max-height: 460px;
    object-fit: contain;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;
  }
`;

const ThumbnailWrapper = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border: 2px solid ${props => props.active ? '#1890ff' : '#f0f0f0'};
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;

  &:hover {
    border-color: #1890ff;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }
`;

const ThumbnailImage = styled(Image)`
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
`;

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    color: #1890ff;
    transform: translateY(-1px);
  }
`;

const ProductInfo = styled.div`
  padding: 0 16px;
`;

const ProductName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingText = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: #faad14;
  font-weight: 500;
`;

const Divider = styled.span`
  color: #d9d9d9;
  font-size: 16px;
`;

const SellText = styled.span`
  font-size: 14px;
  color: #666;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  border-radius: 8px;
  margin-bottom: 20px;
`;

const CurrentPrice = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #ff4d4f;
  line-height: 1;
`;

const OriginalPrice = styled.div`
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountTag = styled(Tag)`
  background: #ff4d4f;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
`;

const StockInfo = styled.div`
  margin-bottom: 16px;
`;

const OutOfStockTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 12px;
`;

const InStockTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 12px;
`;

const InfoSection = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 80px;
`;

const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .address {
    color: #1890ff;
    font-weight: 500;
    text-decoration: underline;
  }
`;

const ChangeAddress = styled.span`
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
`;

const QuantityLabel = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 80px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  height: 40px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 100%;
  border: none;
  background: ${props => props.disabled ? '#f5f5f5' : '#fff'};
  color: ${props => props.disabled ? '#d9d9d9' : '#333'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #e6f7ff;
    color: #1890ff;
  }

  &:first-child {
    border-right: 1px solid #d9d9d9;
  }

  &:last-child {
    border-left: 1px solid #d9d9d9;
  }
`;

const QuantityInput = styled(InputNumber)`
  width: 60px !important;
  height: 100%;

  input {
    text-align: center;
    border: none;
    height: 100%;
    font-size: 16px;
    font-weight: 500;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }
`;

const StockHint = styled.span`
  font-size: 13px;
  color: #999;
`;

const TotalSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f6ffed;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;

const TotalPrice = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #ff4d4f;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const BuyNowButton = styled.button`
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  height: 52px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  background: #fff;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #e6f7ff;
    border-color: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    border-color: #d9d9d9;
    color: #d9d9d9;
    cursor: not-allowed;
  }
`;

const GuaranteeSection = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`;

const GuaranteeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;

  span {
    font-weight: 500;
  }
`;