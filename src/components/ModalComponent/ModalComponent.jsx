import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({title='modal', isOpen=false, children , ...rests}) => {
  return (
    <div> 
        <Modal
        title={title}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isOpen}
        {...rests}      
      >
        {children}
       
      </Modal></div>
  )
}

export default ModalComponent