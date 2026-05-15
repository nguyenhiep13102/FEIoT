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
    console.log('id user', id);
    const res = await axios.get(`http://localhost:5001/api/careplant/getDetail/${id}`);
    console.log('res service', res.data);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

export default {
    getMyIoT,
    careplantbyid,
}