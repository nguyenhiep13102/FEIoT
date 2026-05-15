// redux/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/slides/counterSlice';
import userReducer from '../redux/slides/userSide';
import productReducer from '../redux/slides/ProductSide';
import OderReducer from '../redux/slides/Oderslice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // lưu ở localStorage

// Cấu hình persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['product', 'Oder'], 
};

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  product: productReducer,
  Oder: OderReducer,
});

// Áp dụng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
  reducer: persistedReducer, // ✅ key đúng là `reducer`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo persistor
export const persistor = persistStore(store);
