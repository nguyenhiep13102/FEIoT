/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Input } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

export const InputForm = (props) => {
 const {placeholder = 'nhập text' , ...rests} = props;


  

  return (
    <div style={{width :'100%'}}>
      <WrapperInputStyle
      placeholder={placeholder}
        value={props.value}
      
       
        {...rests} 
      >
        

      </WrapperInputStyle>
      
    </div>
  );
};

export default InputForm;
const WrapperInputStyle= styled(Input)`
  border-top: none;
  border-left: none;
  border-right: none;
 
  outline: none;
  &:focus{
    background-color: rgb(232,240,254);
  }
`