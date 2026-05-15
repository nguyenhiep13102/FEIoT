import { Table, Button } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/loading';

export const Tablecomponent = ({
  selectionType = 'checkbox',
  product = [],
  dataSource = [],
  isLoading = false,
  columns = [],
  onRow = () => {},
  rowKey = 'key',
  nametable='',
  handleDeleteMany
}) => {
  const [rowselectionkey, setrowselectionkey] = useState([]);

  const rowSelection = {
    type: selectionType, 
    onChange: (selectedRowKeys, selectedRows) => {
      setrowselectionkey(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    console.log('Xóa các người dùng đã chọn:', rowselectionkey);
    handleDeleteMany(rowselectionkey);
    setrowselectionkey([])
    
  };

  return (
    <div>
      <Loading isloading={isLoading}>
        {rowselectionkey.length > 0 && (
          <div>
            <Button onClick={handleDeleteAll}>
              {nametable} 
            </Button>
          </div>
        )}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          loading={isLoading}
          dataSource={dataSource}
          onRow={onRow}
          rowKey={rowKey}
          product={product}
        />
      </Loading>
    </div>
  );
};
export default  Tablecomponent ;