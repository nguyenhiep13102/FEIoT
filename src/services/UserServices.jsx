import axios from "axios"
import env from '../../env'
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${env.API_URL}/user/sign-in`, data, {
      withCredentials: true, 
      credentials: true
    });
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};
export const SignUpUser = async (data) => {
  try {
   const res = await axios.post(`${env.API_URL}/user/sign-up`,data);
    return res.data; 
  } catch (error) {
    return error.response?.data;
  }
};

export const getDetailsUser = async (id , accessToken) => {
  try {
   const res = await axios.get(`${env.API_URL}/user/getUserDetail/${id}`,{
    headers : {
      Authorization: `Bearer ${accessToken}`,
    }
   });
   console.log(' kiem tra data',res.data)
    return res.data; 

  } catch (error) {
    return error.response?.data;
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(`${env.API_URL}/user/refresh-token`,{}, 
      {
        withCredentials: true, 
      }
    );

    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};
export const logoutUser = async () => {
  try {
    const res = await axios.post(`${env.API_URL}/user/log-out`);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}; 
export const updateUser = async (id , data,accessToken)=> {
  try {
     

    const res = await axios.put(`${env.API_URL}/user/update-user/${id}`,data,{ headers : {
      Authorization: `Bearer ${accessToken}`,
      
    }}
   );
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const updateAvatar = async (id , formData)=> {
  try { const res = await axios.put(`${env.API_URL}/user/avatar/${id}`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
 
export const getAllUser = async ( accessToken) => {
  try {
   const res = await axios.get(`${env.API_URL}/user/getAll`,{
    headers : {
      Authorization: `Bearer ${accessToken}`,
    }
   });
    return res.data; 
  } catch (error) {
    return error.response?.data;
  }
};
export const deleteUser = async ( id , accessToken) => {
  try {
   const res = await axios.delete(`${env.API_URL}/user/delete-user-admin/${id}`,{
    headers : {
      Authorization: `Bearer ${accessToken}`,
    }
   });
    return res.data; 
  } catch (error) {
    return error.response?.data;
  }
};

export const DeleteManyUser = async (data ,accessToken)=> {
  try {
    const res = await axios.post(`${env.API_URL}/user/delete-many`,{ ids: data } ,
    { headers : { 
      Authorization: `Bearer ${accessToken}`,
    }}
   )
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}


 
 
export default {
    loginUser,
    SignUpUser,
   getDetailsUser,
   refreshToken,
   logoutUser,
   updateUser,
   updateAvatar,
   getAllUser,
   deleteUser,
   DeleteManyUser,
}