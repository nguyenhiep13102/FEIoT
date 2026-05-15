/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import HeaderComponent  from "../HeaderComponent/HeaderComponent";
 const DefaultComponent = ({children}) => {
  return (
    <div>
   <HeaderComponent/>
   {children}; 

   </div>
  )
}
export default DefaultComponent ;

