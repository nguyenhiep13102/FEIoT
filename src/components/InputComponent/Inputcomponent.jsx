/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Input } from "antd";


export const Inputcomponent = ({size ,placeholder,bordered,style,...rests}) => {
  return (
   <>
   <Input 
        placeholder={placeholder}
        size={size}  
        bordered= {bordered}
        style={style} 
        {...rests}
        />
       
   </>
  )
}
export default Inputcomponent ;
