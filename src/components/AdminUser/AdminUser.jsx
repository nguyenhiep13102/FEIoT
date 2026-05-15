import { Button, Form, message, Modal, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { DeleteTwoTone, EditOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Tablecomponent } from '../TableComponent/Tablecomponent';
import Inputcomponent from '../InputComponent/Inputcomponent.jsx';
import { useSelector } from 'react-redux';
import UserService from '../../services/UserServices.jsx'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../LoadingComponent/loading'
import ModalComponent from '../ModalComponent/ModalComponent.jsx';
import * as useMutationHook from '../../hooks/useMutationHook';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent';
import Highlighter from 'react-highlight-words';
import ExportExcelButton from '../ExportExcelButton/ExportExcelButton.jsx'
export const AdminUser = () => {
  const [RowSelected, setRowSelected] = useState(''); 
   const [namedelete, setnamedelete] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpenDelete ,setisModalOpenDelete ] = useState(false); 
  const queryClient = useQueryClient();
  const [isOpenDrawer ,setIsOpenDrawer ] = useState(false); 
  const [isLoadingUpdate ,setisLoadingUpdate ] = useState(false); 
    const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const user = useSelector((state) => state.user)
 console.log('thong tin ' , user.access_token)

 const getAlluser =  async () => {
   try{
     const res = await UserService.getAllUser(user.access_token);
     
     console.log('res', res)
     return res.data ;
   }catch{
    return  ;
   }
 }

 const { isLoading, data: AllUser, isError: isErronAllUser } = useQuery(['AllUser'], getAlluser);
//------------------------creart user ----------------------


//------------------------creart user ---------------------- end

//------------------------update user ----------------------
  const [formedit, setFormedit] = useState({
     name: '',
     email : '',
     phone: '',
     addres: '',
   });
  const updateUser = useMutationHook.useMutationHooks(
  ({ id, data, accessToken }) => UserService.updateUser(id, data, accessToken) 
);

const onUpdateUser = () => {
  console.log('an vao luu du lieu',RowSelected )
  if (!RowSelected) return;
  
  const formData = new FormData();
  Object.entries(formedit).forEach(([key, value]) => {
    formData.append(key, value);
  });

  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }
  updateUser.mutate(
      {
        id: RowSelected,
        data: formData,
        accessToken: user.access_token,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật người dùng thành công!");
          setIsOpenDrawer(false);
         
          form.resetFields();
          queryClient.invalidateQueries(['AllUser']);
        },
        onError: () => {
          message.error("Cập nhật người dùng thất bại. Vui lòng thử lại!");
        },
      }
    );
}
const handleRowClick = (record) => {
     setIsOpenDrawer(true)
     getdetailsUser(record.key)
 }

 const handleChange = (e) => {
  const { name, value } = e.target;
 
  console.log(`Trường "${name}" vừa được thay đổi:`, value); // In giá trị vừa đổi

  setFormedit((prev) => ({
    ...prev,
    [name]: value,
  }));
};
useEffect(() => {
  console.log("Giá trị formEdit mới nhất:", formedit);
}, [formedit]);
const getdetailsUser = async (id) => {
  try {
    const res = await UserService.getDetailsUser(id, user.access_token);
    console.log('du lieu form ', res)
    const formValues = {
      name: res.data.name,
      email :res.data.email,
      phone :res.data.phone,
      addres :res.data.addres,
    };
    setFormedit(formValues);
    form.setFieldsValue(formValues);
    setisLoadingUpdate(false)

  } catch (error) {
    console.error('Lỗi lấy chi tiết sản phẩm:', error);
  }
};


//------------------------update user ---------------------- end



//------------------------delete user ----------------------

 const mutationDeleted = useMutationHook.useMutationHooks(
  ({ id, accessToken }) => UserService.deleteUser(id, accessToken) 
);
const {data:datadeleted, isLoading : isLoadingDeleted, isSuccessDeleted, isError : isErrorDeleted} = mutationDeleted;

useEffect(()=>{
  if(isSuccessDeleted && datadeleted?.status ==='success')
    {
      message.success();
      handleCancel()
  }else if(isErrorDeleted){
    message.error();

  }
}) 
const handleCancelDelete = () => {
   setisModalOpenDelete(false)
} 
const handleDeleteProduct = () => {
  console.log('id de xoa ' , RowSelected);
   mutationDeleted.mutate( 
    { id: RowSelected, accessToken: user.access_token },
{
    onSuccess: (data) => {
      if (data?.status === 'OK') {
        message.success('Xoá sản phẩm thành công!');
      } 
      else {
        message.error('Xoá thất bại!');
      }
    },
    onError: () => {
      message.error('Có lỗi xảy ra!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['AllUser']);
    },
  }
   )
    setisModalOpenDelete(false)

}

//------------------------delete user ---------------------- end
//-------------------------delete many User---------
const deletemanyUser = useMutationHook.useMutationHooks(
  ({  data, accessToken }) => UserService.DeleteManyUser( data, accessToken) 
);

const handleDeleteManyUser = (ids)=> {
  console.log('in ra danh sach id ' , ids)
 deletemanyUser.mutate({
  data : ids,
  accessToken: user.access_token,
 },{
   onSuccess: (data) => {
        if (data?.status === 'success') {
          message.success('Xoá danh sách Người dùng thành công!');

        } 
        else {
          message.error('Xoá thất bại!');
        }
      },
      onError: () => {
        message.error('Có lỗi xảy ra!');
      },
      onSettled: () => {
        queryClient.invalidateQueries(['AllUser']);
      },
 }
)
}


//-------------------------delete many User--------- end

//------------------------table user ----------------------
const renderAction = (record) => {
  
  return (
    <div>
      <DeleteTwoTone style={{ color: 'red', fontSize: '30px', cursor: 'pointer' 
        
      }} 
      onClick={(e) => {
        e.stopPropagation(); 
        console.log('Xóa:', record.key);
        setRowSelected(record.key)
        setnamedelete(record.name)
        setisModalOpenDelete(true) 
      
        }}/>
      {' | '}
      <EditOutlined 
        style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}  
        onClick={(e) => {
            e.stopPropagation(); 
            console.log('Sửa:', record.key);
            setRowSelected(record.key)
            handleRowClick(record); 
          }}
      />
    </div>
  );
};
const dataSource = Array.isArray(AllUser) 
  ? AllUser.map((item) => ({
      key: item._id,
      name: item.name,
      email: item.email,
      password: item.password,
      isAdmin: item.isAdmin,
      phone: item.phone,
      addres: item.addres,
      avatar: item.avatar,
      access_token: item.access_token,
      refresh_token: item.refresh_token,
    }))
  : [];
 const searchInput = useRef(null);
  const [searchTexts, setSearchTexts] = useState({});  
 const [searchedColumns, setSearchedColumns] = useState({});
 const handleResetAll = (clearFilters) => {
  clearFilters();
  setSearchTexts({});      
  setSearchedColumns({});  
};
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchTexts(prev => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  setSearchedColumns(prev => ({ ...prev, [dataIndex]: true }));
};
  const getColumnSearchProps = dataIndex => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Inputcomponent
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
           onClick={() => clearFilters && handleResetAll(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => close()}
        >
          Close
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
  ),
  onFilter: (value, record) => {
    const fieldValue = record[dataIndex];
    return fieldValue ? fieldValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
  },
  filterDropdownProps: {
    onOpenChange(open) {
      if (open) {
        setTimeout(() => {
          searchInput.current?.select();
        }, 100);
      }
    },
  },
  render: text =>
    searchedColumns[dataIndex] ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchTexts[dataIndex]]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});

 
const columns = [
  {
    title: 'Tên Đầy Đủ  ',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
     ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Tên Tài Khoản ',
    dataIndex: 'email',
   
  },
  {
    title: 'Số Điện Thoại ',
    dataIndex: 'phone',
    ...getColumnSearchProps('phone'),
      
  
  },
  {
    title: 'Địa Chỉ  ',
    dataIndex: 'addres',
  },

  
  // {
  //   title: 'image',
  //   dataIndex: 'image',
  // }, 
   {
    title: 'Action',
    dataIndex: 'action',
    export: false,

    render: (_, record) => renderAction(record),
  },
];



//------------------------table  user ---------------------- end
return   (
     <div>
   <WrapperHeader>Quản Lý Người Dùng </WrapperHeader>
   {/* <Button style={{
    width: '160px',
    height: '80px',
    borderRadius: '20px',
    borderStyle: 'dashed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  }}
  onClick={showModal}
  >
    <PlusCircleOutlined style={{ fontSize: '24px' }} /> thêm Người Dùng  </Button> */}
 <ExportExcelButton data={dataSource} columns={columns} fileName="ProductList" />

  
  <div style={{marginTop :'20px'}}>
      <Tablecomponent product = {AllUser?.data} isLoading ={isLoading}   nametable =' xóa các người dùng đã chọn '
      handleDeleteMany = {handleDeleteManyUser}
      columns= {columns} 
      dataSource={dataSource}
       rowKey="key"
    onRow={(record, rowIndex) => {
    return {
      onClick: (event) => {
       
     
      },
     
    };
  } }

      />
  </div>
  <DrawerComponent title='chi tiết Người Dùng' isOpen={isOpenDrawer}  onClose={() => {setIsOpenDrawer(false)  }  } width='70%' >
     <Loading isloading={isLoadingUpdate}>
        <Form
          form={form}
          name="productForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 800 }}
          onFinish={onUpdateUser}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <WrapperFormItem
            label="Tên đầy đủ "
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Inputcomponent name="name" placeholder="Nhập tên"  value={formedit.name} onChange={handleChange}/>
          </WrapperFormItem>

          <WrapperFormItem
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại !' }]}
          >
            <Inputcomponent  name="phone" placeholder="Nhập số điện thoai " value={formedit.phone} onChange={handleChange} />
          </WrapperFormItem>

          <WrapperFormItem
            label="Địa Chỉ"
            name="addres"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ !' }]}
          >
            <Inputcomponent  name="addres" placeholder="Nhập địa chỉ" value={formedit.addres} onChange={handleChange} />
          </WrapperFormItem>

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button type="primary" htmlType="submit">
              Lưu thay đổi 
            </Button>
          </Form.Item>
        </Form>
        </Loading>
    </DrawerComponent>

      <ModalComponent
        title="Xóa Sản Phẩm "
        isOpen={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk = {handleDeleteProduct}
      >
       <Loading isloading={isLoadingDeleted}>
          <div>
             bạn có chắc xóa người dùng <h3>{namedelete} ?</h3>
          </div>
        </Loading>
      </ModalComponent>
   </div>
  )
}
 export default AdminUser ;
  
 const WrapperHeader = styled.h1`
    color : #000;
    font-size:20px ;

 `
 const WrapperFormItem = styled(Form.Item)`
  .ant-form-item-label {
    text-align: left;
  }
  .ant-form-item-control {
    width: 100%;
  }
`;