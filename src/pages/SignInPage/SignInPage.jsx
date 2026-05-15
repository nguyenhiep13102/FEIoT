import styled from 'styled-components';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/Buttoncomponent/Buttoncomponent';
import { Image } from 'antd';
import {
  EyeTwoTone,
  EyeInvisibleTwoTone
} from '@ant-design/icons';
import { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as useMutationHook from '../../hooks/useMutationHook.js';
import UserService from '../../services/UserServices.jsx';
import Loadingcom from '../../components/LoadingComponent/loading.jsx';
import  message from '../../components/Message/Message.jsx';
import { jwtDecode } from "jwt-decode";
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slides/userSide.jsx';
export const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
const loacation = useLocation();
  const handleTogglePassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const handleNavigateSignUp = () => {
    navigate('/sign-up');
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const mutation = useMutationHook.useMutationHooks((data) =>
    UserService.loginUser(data)
  );

   const { data, isLoading, isSuccess } = mutation;
 
  const handleSignIn = () => {
     console.log("Email:", email);
  console.log("Password:", password);
    mutation.mutate({
      email,
      password
    });
  };
  useEffect(() => {
    
  if (isSuccess && data?.status === 'success') {
   
    message.success(data.message);
    localStorage.setItem('accessToken',data?.accessToken);
     if(loacation?.state){
      navigate(loacation?.state);
    }
    else{
      navigate('/');
    }
    if(data?.accessToken){
      const decoded = jwtDecode(data?.accessToken);
      
      if(decoded?.id){
        handleGetDetailsUser(decoded?.id , data?.accessToken)     
      }

    }
  }
}, [isSuccess, data]);
  const handleGetDetailsUser = async (id , accessToken) => {
    const res = await UserService.getDetailsUser(id, accessToken);
    
      const userData= {
        ...res.data,
        access_token: accessToken,
      }
    dispatch(updateUser(userData));
  console.log('đã dispatch updateUser với:',userData );
  }



  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.53)',
        height: '100vh'
      }}
    >
      <div
        style={{
          width: '800px',
          height: '445px',
          borderRadius: '6px',
          background: '#fff',
          display: 'flex'
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: '20px' }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <InputForm
              placeholder="Password"
              type={isShowPassword ? 'text' : 'password'}
              style={{ paddingRight: '30px', flex: 1 }}
              value={password}
              onChange={handleOnchangePassword}
            />
            <span
              onClick={handleTogglePassword}
              style={{
                position: 'absolute',
                right: '10px',
                cursor: 'pointer'
              }}
            >
              {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleTwoTone />}
            </span>
          </div>

          {data?.status === 'ERR' && (
            <span style={{ color: 'red' }}>{data?.message}</span>
          )}

          <Loadingcom isloading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              textButton={'Đăng nhập'}
              bgColor="#ff4d4f"
              textColor="#fff"
              height="48px"
              width="100%"
              style={{ margin: '26px 0 10px' }}
            />
          </Loadingcom>

          <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          <p>
            Chưa có tài khoản?{' '}
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <div>
            <Image
              src="/src/assets/images/b4d225f471fe06887284e1341751b36e.png"
              preview={false}
              alt="image-logo"
              height={203}
              width={203}
            />
            <h4>Mua sắm tại Thành Huệ Shop</h4>
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;

const WrapperContainerLeft = styled.div`
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const WrapperContainerRight = styled.div`
  width: 300px;
  background: linear-gradient(
    136deg,
    rgb(240, 248, 255) -1%,
    rgb(219, 238, 255) 85%
  );
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  cursor: pointer;
`;
