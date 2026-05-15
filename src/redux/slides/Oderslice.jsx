import { createSlice } from '@reduxjs/toolkit'


const initialState = {
   orderItems:[
    
    ],
    shippingAddress : {
        
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice:0 ,
    taxiPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid : false,
    isDelivered: false,
    deliveredAt :'',

};

export const OderSlide = createSlice({
  name: 'Order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
       const orderItem = action.payload.orderItems;
       console.log('action.payload', action.payload);
       console.log('orderItem', orderItem);
  const existingItem = state?.orderItems?.find(
    item => item?.Product === orderItem.Product
  );

  if (existingItem) {
    existingItem.amount += orderItem?.amount; 
  } else {
    state.orderItems = [...state.orderItems, orderItem]; 
    
 console.log("Danh sách sản phẩm sau khi thêm:", state.orderItems);
}},
increaseAmount: (state, action) => {
  const orderItem = action.payload.orderItems;
  console.log('orderItem', orderItem);
   const existingItem = state?.orderItems?.find(
    item => item?.Product === orderItem.Product
  );
   if (existingItem) {
    existingItem.amount++;
  }
  
},
decreaseAmount: (state, action) => {
 const orderItem = action.payload.orderItems;
  const existingItem = state?.orderItems?.find(
    item => item?.Product === orderItem.Product
  );
  if (existingItem && existingItem.amount > 1) {
    existingItem.amount--;
  }

},
removeOrderProduct: (state, action) => {
  // Lấy Product ID từ action.payload
  const orderItem = action.payload.orderItems;
  
  const updatedOrderItems = state.orderItems.filter(item => item.Product !==orderItem.Product );
  if (updatedOrderItems.length === state.orderItems.length) {
    console.warn(`removeOrderProduct: Không tìm thấy sản phẩm với Product ID ${orderItem.Product} để xóa`);
  } else {
    console.info(`removeOrderProduct: Đã xóa sản phẩm với Product ID ${orderItem.Product}`);
  }
  state.orderItems = updatedOrderItems;
console.log("Danh sách sản phẩm sau khi xóa:", state.orderItems);
}
  },
});
// Action creators are generated for each case reducer function
export const {  addOrderProduct,increaseAmount,decreaseAmount,removeOrderProduct } = OderSlide.actions

export default OderSlide.reducer