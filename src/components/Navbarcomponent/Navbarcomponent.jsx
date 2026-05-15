/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Checkbox, Rate } from "antd";
import styled from "styled-components";

export const Navbarcomponent = () => {
  const onChange = () => {};

  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => (
          <WrapperTextValue key={index}>{option}</WrapperTextValue>
        ));

      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <Checkbox key={index} style={{ marginLeft: "0" }} value={option.value}>
                {option.lable}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case "star":
        return options.map((option, index) => (
          <div key={index} style={{ display: "flex", gap: "4px" }}>
            <Rate style={{ fontSize: "12px" }} disabled defaultValue={option} />
            <span>từ {option} sao</span>
          </div>
        ));

      case "price":
        return options.map((option, index) => (
          <div
            key={index}
            style={{
              borderRadius: "10px",
              color: "rgb(56,56,61)",
              backgroundColor: "rgb(238,238,238)",
              width: "fit-content",
              padding: "4px",
            }}
          >
            {option}
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div>
      <WrapperCardStyle>Danh sách</WrapperCardStyle>

      <WrapperValue>
        {renderContent("text", ["tulanh", "tv", "maygiat"])}
        {renderContent("checkbox", [
          { value: "a", lable: "A" },
          { value: "b", lable: "B" },
          { value: "c", lable: "C" },
        ])}
      </WrapperValue>

      <WrapperValue>{renderContent("star", [3, 4, 5])}</WrapperValue>

      <WrapperValue>{renderContent("price", ["dưới 40", "trên 50"])}</WrapperValue>
    </div>
  );
};

export default Navbarcomponent;

// Styled Components
const WrapperCardStyle = styled.h4`
  color: rgb(56, 56, 61);
  font-size: 14px;
  font-weight: 500;
`;

const WrapperTextValue = styled.span`
  color: rgb(56, 56, 61);
  font-size: 12px;
  font-weight: 400;
`;

const WrapperValue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
