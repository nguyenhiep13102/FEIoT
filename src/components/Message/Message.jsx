import {message} from "antd"
const success= ( mes = 'success') =>{
     message.success(mes);

}
const error= ( mes = 'ERR') =>{
     message.error(mes);
     
}
const warning= ( mes = 'Warning') =>{
     message.warning(mes);
     
}
export default {
success ,
error,
warning
};