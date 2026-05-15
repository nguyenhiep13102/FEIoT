import { Alert, Spin } from 'antd';
import React from 'react'

export const loading = ({ children , isloading , delay = 200}) => {
  return (
    <Spin spinning= {isloading} delay={delay} tip="Loading...">
      {children}
    </Spin>
  )
}
export default loading;