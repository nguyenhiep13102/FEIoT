import { Button } from "antd";
import styled from "styled-components";
/* eslint-disable react/prop-types */
const StyledButton = styled(Button)`
  background-color: ${(props) => props.bgColor || "#1890ff"}; /* Mặc định xanh dương */
  color: ${(props) => props.textColor || "#fafafa"}; /* Mặc định trắng */
  font-size: ${(props) => props.fontSize || "14px"};
  border-radius: ${(props) => props.borderRadius || "5px"};
  padding: ${(props) => props.padding || "8px 16px"};
  border: ${(props) => props.border || "none"}; /* Hỗ trợ border */

  transition: 0.3s;
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
  &:hover {
    background-color: ${(props) => props.hoverBg || "#40a9ff"};
  }
`;

export const ButtonComponent = ({ textButton, bgColor, textColor, fontSize, borderRadius, padding, hoverBg, size,width,height,border, ...rest }) => {
  const disabled = rest.disabled;

  return (
    

    <StyledButton 



      bgColor={disabled ? "#d2e951" : bgColor}
      textColor={textColor} 
      fontSize={fontSize} 
      borderRadius={borderRadius} 
      padding={padding}
      hoverBg={hoverBg}
      width={width} 
      height={height}
      size={size}
      border={border}
      {...rest}
    >
      {textButton}
      
    </StyledButton>
  );
};

export default ButtonComponent;
