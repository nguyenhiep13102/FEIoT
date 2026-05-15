import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  phone: '',
  addres: '',
  avatar : '', 
  access_token: '',
  _id: '',
  isloading: true ,
  isAdmin : false,
  city : '', 

};

export const userSlice = createSlice({ 
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name='', email='', access_token='' ,phone='', avatar='',addres='', _id='' , isAdmin='', city='' } = action.payload;
      state.name = name;
      state.email = email;
      state.access_token = access_token;
      state.phone = phone
      state.avatar = avatar;
      state.addres = addres;
      state._id = _id; 
       state.isAdmin= isAdmin; 
        state.city= city; 
      
    },
    resetUser: (state, action) => {
      
      state.name = '';
      state.email ='' ;
      state.access_token = '';
      state.phone = '';
      state.addres = '';
      state._id = '';
      state.avatar = '';
      state.isAdmin= '';
      localStorage.removeItem('name'); 
      localStorage.removeItem('phone'); 
      localStorage.removeItem('avatar'); 
      localStorage.removeItem('addres'); 
      localStorage.removeItem('email');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('_id');
      localStorage.removeItem('isAdmin');

     
    }
  }
});

export const { updateUser ,resetUser} = userSlice.actions;

export default userSlice.reducer;
