import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '',
};

export const ProductSide = createSlice({
  name: 'product',
  initialState,
  reducers: {
    SearchProduct: (state, action) => {
      state.search = action.payload;
    },
  },
});
// Action creators are generated for each case reducer function
export const {  SearchProduct } = ProductSide.actions

export default ProductSide.reducer