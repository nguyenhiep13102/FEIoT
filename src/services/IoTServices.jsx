import axios from "axios"
import env from '../../env'



 export const getMyIoT = async (id )=> {
  try {
    console.log('id user', id);
    const res = await axios.get(`${env.API_URL}/systeamlocation/getDetailbyiduser/${id}`);
    console.log('res service', res.data);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
 export const careplantbyid = async (id )=> {
  try {
    
    const res = await axios.get(`http://localhost:5001/api/careplant/getDetail/${id}`);
   
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

 export const careplantupdate = async (id, data )=> {
  try {
    
    const res = await axios.put(`http://localhost:5001/api/careplant/update/${id}`, data);
   
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}


 export const controllerIoT = async (id , data)=> {
  try {
    
    const res = await axios.post(`http://localhost:5001/api/careplant/controllerIoT/${id}`, data);
    
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const getNotificationByUserId = async (userId) => {
  console.log('userId trong service=============', userId);
    const res = await axios.get(
        `http://localhost:5001/api/nocationmessage/getDetail/${userId}`
    );

    return res.data;
};


export default {
    getMyIoT,
    careplantbyid,
    controllerIoT,
    getNotificationByUserId,
    careplantupdate
}