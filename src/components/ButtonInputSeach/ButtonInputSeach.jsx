/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Button, Input,  } from 'antd';
import {
  SearchOutlined
  
} from '@ant-design/icons';
import Inputcomponent from "../InputComponent/Inputcomponent";
import Buttoncomponent from  "../Buttoncomponent/Buttoncomponent";

export const ButtonInputSeach = (props) => {
    const {
        size , 
        placeholder, 
        textButton, 
        backgroundColorInput= '#f0eded',
        backgroundColorButton ='#306aad' ,
         colorButton= '#fff' 
        } = props
  return (
    <div style={{ display: 'flex', border: 'none', borderRadius: 0, width: '100%', backgroundColor: 'green' }}> 
    <Inputcomponent  
        placeholder={placeholder} 
        size={size}  
         {...props} 
        style={{
            backgroundColor: backgroundColorInput,
            border: 'none', 
            borderRadius: '0',
            
            
        }} 
    />
    <Buttoncomponent 
        size={size}
        onClick={props.onClick}
        style={{
            borderRadius: '0',
            backgroundColor: backgroundColorButton,
            color: colorButton,
            border: 'none',
            height: '40px' // Giữ cùng chiều cao với Input


        }} 
        icon={<SearchOutlined color={colorButton} style={{color : `#fff`}}/>}
        textButton={textButton}
        styleTextButton={{color: colorButton}}

    >
        
    </Buttoncomponent>
</div>

  )
}

export default ButtonInputSeach ;