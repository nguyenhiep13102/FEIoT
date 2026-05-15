import { Table } from 'antd'
import React from 'react'

const Odercomponent = (
    { selectionType = 'checkbox', 
        columns = [],dataSource=[],

         rowKey = 'key',
    }) => {
 
   const rowSelection = {
    type: selectionType, 
    onChange: (selectedRowKeys, selectedRows) => {
     
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    
    
    
  };
    return (
    <div>
      
         <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />


       </div>
  )
}

export default Odercomponent