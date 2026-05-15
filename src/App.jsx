import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { routes } from './Routes/index';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import env from '../env.js'
// import { isJsonString } from './utlis.js';
import { jwtDecode } from 'jwt-decode';
import UserServices from './services/UserServices.jsx';
import {useDispatch, useSelector} from 'react-redux'
import { updateUser } from './redux/slides/userSide.jsx';
 /* eslint-disable no-unused-vars */
import Loading from '../src/components/LoadingComponent/loading.jsx'

function App() {
  const dispatch = useDispatch();

useEffect(() => {
  const init = async () => { 
    const refeshtoken = async () => {
      try {const res = await UserServices.refreshToken();        
        if (res?.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);     
          return res.accessToken;
        } else {
          console.log('Không nhận được accessToken từ refreshToken');
        }
      } catch (error) {      
        console.log('Chi tiết lỗi:', error.response?.data || error.message);
      }
    };
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
      

        if (decoded?.exp < Date.now() / 1000) {
          const newAccessToken = await refeshtoken();
          await handleGetDetailsUser(decoded.id, newAccessToken);
        } else if (decoded?.id) {
          await handleGetDetailsUser(decoded.id, token);
        }
      } catch (error) {
        console.error('Token decode lỗi:', error);
      }
    }
    setIsAppReady(true);
  };
  init(); // call the async function
}, []);

const handleGetDetailsUser = async (id, accessToken) => {
  try {
    const res = await UserServices.getDetailsUser(id, accessToken);
    const userData = {
      ...res.data,
      access_token: accessToken,
    };
    dispatch(updateUser(userData));    
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin user:', error);
  }
}

 const user = useSelector((state) => state.user); 
 console.log('app', user );
  const [isAppReady, setIsAppReady] = useState(false); 
    if (!isAppReady) {
    return <Loading></Loading>;
  }
 
  return (<div>
   
   <Router>
  <Routes>
    {routes.map((route) => {
      const Page = route.page;
      const Layout = route.isShowHeader ? DefaultComponent : Fragment;
      const ischeckAuth = !route.isPrivate || (user && user.isAdmin);

      return (
        
        <Route
          key={route.path}
          path={route.path}
          element={
            ischeckAuth ? (
              <Layout>
                <Page />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      );
    })}
  </Routes>
</Router>

    </div>
  );
}

export default App;
