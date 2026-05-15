import { Image } from "antd";
import ButtonComponent from "../../components/Buttoncomponent/Buttoncomponent";
import InputForm from "../../components/InputForm/InputForm";
import styled from "styled-components";
import { useFetcher, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {
  EyeTwoTone,
 EyeInvisibleTwoTone
} from '@ant-design/icons';
import UserServices from "../../services/UserServices";
import { useMutationHooks } from '../../hooks/useMutationHook.js';
import Loadingcom from '../../components/LoadingComponent/loading.jsx'
import  message from '../../components/Message/Message.jsx';
export const SignUpPage = () => {
  
  
const [isShowPassword, setIsShowPassword] = useState(false);
const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

const [email , setEmail] = useState('');
const [password , setPassWord] = useState('');
const [confirmPassword , setConfirmPassWord] = useState('');
const [name , setfullName] = useState('');
const [phone , setPhone] = useState('');

const handleTogglePassword = () => {
    setIsShowPassword((prev) => !prev);
  };
const handleOnchangeEmail = (e) => {
  setEmail(e.target.value);
  console.log(e.target.value);
}
const handleOnchangeName = (e) => {
  setfullName(e.target.value);
  console.log(e.target.value);
}
const handleOnchangePhone = (e) => {
  setPhone(e.target.value);
  console.log(e.target.value);
}
const handleOnchangePassword = (e) => {
  setPassWord(e.target.value);
  console.log(e.target.value);
}
const handleOnchangeConfirmPassWord = (e) => {
  setConfirmPassWord(e.target.value);
  console.log(e.target.value);
}
  const navigatorSignin = () =>{
    navigate('/sign-in');
  }
 
   const navigate = useNavigate();
  const handleNavigateSignUp= () =>{
       navigate('/sign-up')
  }
 const mutation = useMutationHooks((data) => UserServices.SignUpUser(data)); 
   console.log('mutation', mutation);
 const {data , isLoading , isError , isSuccess} = mutation;

 useEffect(()=>{
   if(isSuccess){
    navigatorSignin()
    message.success('Đăng ký thành công!');
  
  }
else if(isError){
  message.error();
}
 },[isError , isSuccess ])
 
 const handleSignUp = () => {
    console.log('signUp', email, password , confirmPassword, name,phone);
    mutation.mutate({
        email,
        password,
        confirmPassword,
        name,
        phone,
        isAdmin: false,
       
      })
      console.log('signUp', { email, password, confirmPassword, name, phone });
  }
 
  
  return (
    <div style={{display:'flex' , alignItems: 'center', justifyContent:'center', background : 'rgba(0,0,0,0.53)' , height: '100vh'}}>
      <div style={{width: '800px' , height: '700px' , borderRadius:'6px',background:'#fff' ,display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin chào</h1>
        <p1 style={{marginBottom: '20px' }}>Đăng Kí Tài Khoan </p1>
 
        <InputForm style={{marginBottom: '20px' }} placeholder = 'abc@gmail.com' value = {email}  onChange ={handleOnchangeEmail} />
         
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative'  }} >
        <InputForm  visibilityToggle={false}  placeholder='Password' type={isShowPassword ? 'text' : 'password'} style={{ paddingRight: '30px', flex: 1 ,marginBottom: '20px'}} 
        value = {password}  onChange ={handleOnchangePassword} 
        />
        <span onClick={() => setIsShowPassword(prev => !prev)}>
       {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleTwoTone />}
        </span>
        </div>


   <div style={{ display: 'flex', alignItems: 'center', position: 'relative'  }} >
      <InputForm    visibilityToggle={false} placeholder='Confirm Password' type={isShowConfirmPassword ? 'text' : 'password'} style={{ paddingRight: '30px', flex: 1 ,marginBottom: '20px' }} 
      value = {confirmPassword}  onChange ={handleOnchangeConfirmPassWord} 
       />
  
  <span onClick={() => setIsShowConfirmPassword(prev => !prev)}>
    {isShowConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleTwoTone />}
  </span>
</div>

<InputForm style={{marginBottom: '20px' }} placeholder = 'tên đầy đủ  ' value = {name}  onChange ={handleOnchangeName} />

<InputForm style={{marginBottom: '20px' }} placeholder = 'số điện thoại ' value = {phone}  onChange ={handleOnchangePhone} />
        
        
        
        {
          data?.status ==='ERR' &&  <span style={{color : 'red'}} >{data?.message}</span>
        }
         {
          data?.status ==='success' &&  <span style={{color : 'green'}} >{data?.message}</span>
        }
        <Loadingcom isloading={isLoading}>
        <ButtonComponent 
        disabled = {!email.length|| !password.length ||!confirmPassword.length ||!name.length ||!phone.length}
                 onClick={handleSignUp}
                  size={40}
                  textButton={'Đăng nhập'}
                  bgColor="#ff4d4f"
                   textColor="#fff" 
                   height='30px'
                   width='100%'
                   style={{margin:'26px 0 10px'}}
        
                  >
                  </ButtonComponent>
                  </Loadingcom>
                  <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
                  <p>Bạn đã có tài khoản<WrapperTextLight  onClick={navigatorSignin}>Đăng Nhập </WrapperTextLight></p>

      </WrapperContainerLeft>
      <WrapperContainerRight>
        <div>
          <Image src='/src/assets/images/b4d225f471fe06887284e1341751b36e.png' preview={false}  alt='image-logo ' height={203} width={203}/>
          <h4>Mua sắm tại Thành Huệ Shop</h4>
        </div>
      </WrapperContainerRight>

    
    </div>
    </div>
  )
}
export default SignUpPage; 
const WrapperContainerLeft = styled.div`
 padding: 40px 45px 24px ;
 display: flex;
 flex-direction: column;

 flex:1 ;

`;
 const WrapperContainerRight = styled.div`
 width: 300px;
 background: linear-gradient(136deg, rgb(240, 248,255)  -1% ,rgb(219,238,255) 85%);
 display: flex;
 justify-content: center;
 flex-direction: column;
 align-items: center;
 gap: 4px;
`;
const WrapperTextLight= styled.span`
  color: rgb(13,92,182);
  font-size: 13px;
`;