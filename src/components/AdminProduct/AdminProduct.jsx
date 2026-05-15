import { Button, Form, Input, message, Modal, Select, Space, Upload } from 'antd';
import React, { use, useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import {  DeleteTwoTone, EditOutlined, PlusCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Tablecomponent } from '../TableComponent/Tablecomponent';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent';
import Inputcomponent from '../InputComponent/Inputcomponent';
import * as useMutationHook from '../../hooks/useMutationHook';
import ProductService from '../../services/ProductService'
import {  useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../LoadingComponent/loading'

import env from '../../../env'
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
import Highlighter from 'react-highlight-words';
import ExportExcelButton from '../ExportExcelButton/ExportExcelButton.jsx'
import Productsevice from '../../services/ProductService.jsx'
export const AdminProduct = () => {    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [RowSelected, setRowSelected] = useState('');
  const [form] = Form.useForm(); 
  const [formchitiet] = Form.useForm(); 
   const [isOpenDrawer ,setIsOpenDrawer ] = useState(false); 
   const [isLoadingUpdate ,setisLoadingUpdate ] = useState(false); 
   const [isModalOpenDelete ,setisModalOpenDelete ] = useState(false); 

  const showModal = () => {
    setIsModalOpen(true);
  };
 const user = useSelector((state) => state.user)
 console.log('thong tin ' , user.access_token)
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();  // reset form khi đóng modal
    setFile(null);
    setPreviewImage(null);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (info) => {
    const fileList = info.fileList;
    if (fileList && fileList.length > 0) {
      const latestFile = fileList[fileList.length - 1];
      const file = latestFile.originFileObj;
      setFile(file); // lưu file thật để gửi API
      const base64 = await getBase64(file); // lấy base64 để preview
      setPreviewImage(base64);
    } else {
      setFile(null);
      setPreviewImage(null);
    }
  };

  const creatProduct = useMutationHook.useMutationHooks(
    (formData) => ProductService.creatProduct(formData)       
  );
//---------------------------------------DeleteProduct------------------------------


useEffect(()=>{
  if(isSuccessDeleted && datadeleted?.status ==='OK')
    {
      message.success();
      handleCancel()
  }else if(isErrorDeleted){
    message.error();

  }
})

 const mutationDeleted = useMutationHook.useMutationHooks(
  ({ id, accessToken }) => ProductService.DeleteProduct(id, accessToken) 

);
const {data:datadeleted, isLoading : isLoadingDeleted, isSuccessDeleted, isError : isErrorDeleted} = mutationDeleted;

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
      queryClient.invalidateQueries(['products']);
    },
  }
);


   setisModalOpenDelete(false)
}
//---------------------------------------DeleteProduct----------------------------
const getAllProduct =  async () => {
  try{
    const res = await ProductService.getAllProduct();
    
    console.log('res', res)
    return res.data ;
  }catch{
   return  ;
  }
}
const queryClient = useQueryClient();
const { isLoading, data: products, isError } = useQuery(['products'], getAllProduct);
  const handleSubmit = (values) => {
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('type', values.type);
    formData.append('price', values.price);
    formData.append('countInStock', values.countInStock);
    formData.append('rating', values.rating);
    formData.append('description', values.description);
    formData.append('discount', values.discount);
    formData.append('selled', 0);

    if(file) {
      formData.append('productimage', file); 
    }

    creatProduct.mutate(formData, {
      onSuccess: (data) => {
        if(data?.status==='error'){
           message.warning( data?.message);
        }
         if(data?.status==='success'){
           message.success( ' thêm sản phảm thành công ');
        }
        
        setIsModalOpen(false);
        form.resetFields();
        setFile(null);
        setPreviewImage(null);
        queryClient.invalidateQueries(['products']);
      },
      onError: () => {
        message.error("Thêm sản phẩm thất bại");
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
   const [formedit, setFormedit] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    countInStock: '',
    rating: '',
    type: '',
    selled: '',
    discount: '',

  });


 const getFetailsProduct = async (id) => {
  try {
    const res = await ProductService.getProductDetail(id);
    const formValues = {
      name: res.name,
      price: res.price,
      description: res.description,
      image: res.image,
      countInStock: res.countInStock,
      rating: res.rating,
      type: res.type,
      selled : res.selled,
      discount: res.discount,
    };
    setFormedit(formValues);
    formchitiet.setFieldsValue(formValues);
   setisLoadingUpdate(false)

  } catch (error) {
    console.error('Lỗi lấy chi tiết sản phẩm:', error);
  }
};
// useEffect(() => {
//   if (RowSelected) {
//     getFetailsProduct(RowSelected); 
//   }
// }, [RowSelected]);

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

  const handleSelectChange = (value) => {
    if (value === 'NewTypeProduct') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }

    // Cập nhật giá trị vào formedit
    handleChange({ target: { name: 'type', value } });
  };


const onUpdateProduct = () => {
  if (!RowSelected) return;

  const formData = new FormData();
  Object.entries(formedit).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (file) {
    formData.append('productimage', file);
  }

  updateProduct.mutate(
    {
      id: RowSelected,
      data: formData,
      accessToken: user.access_token,
    },
    {
      onSuccess: () => {
        message.success("Cập nhật sản phẩm thành công!");
        setIsOpenDrawer(false);
        setFile(null);
        setPreviewImage(null);
        formchitiet.resetFields();
        queryClient.invalidateQueries(['products']);
      },
      onError: () => {
        message.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại!");
      },
    }
  );
};

 const handleRowClick = (record) => {
     setIsOpenDrawer(true)
     getFetailsProduct(record.key)
     console.log('id san pham  record.key' , record.key)
     setRowSelected(record.key)

     
     setisLoadingUpdate(true)    
  };

  const updateProduct = useMutationHook.useMutationHooks(
  ({ id, data, accessToken }) => ProductService.updateProduct(id, data, accessToken) 

);
 const [searchTexts, setSearchTexts] = useState({});  // Lưu text tìm kiếm cho từng cột
const [searchedColumns, setSearchedColumns] = useState({}); // Lưu trạng thái cột nào đang tìm

  const searchInput = useRef(null);
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchTexts(prev => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  setSearchedColumns(prev => ({ ...prev, [dataIndex]: true }));
};
const handleResetAll = (clearFilters) => {
  clearFilters();
  setSearchTexts({});      // Xóa hết searchText của tất cả cột
  setSearchedColumns({});  // Xóa hết trạng thái searched của tất cả cột
};
const handleReset = (clearFilters, dataIndex) => {
  clearFilters();
  setSearchTexts(prev => ({ ...prev, [dataIndex]: '' }));
  setSearchedColumns(prev => ({ ...prev, [dataIndex]: false }));
};

 const renderAction = (record) => {
  
  return (
    <div>
      <DeleteTwoTone style={{ color: 'red', fontSize: '30px', cursor: 'pointer' 
        
      }} 
      onClick={(e) => {
        e.stopPropagation(); 
        console.log('Xóa:', record.key);
        setRowSelected(record.key)
        setisModalOpenDelete(true) 
        }}/>
      {' | '}
      <EditOutlined 
        style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}  
        onClick={(e) => {
            e.stopPropagation(); 
            console.log('Sửa:', record.key);
            formedit.image='';
            handleRowClick(record); 

          }}
      />
    </div>
  );
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
const [typeOptions, setTypeOptions] = useState([]);
const [showInput, setShowInput] = useState(false);
  const [newType, setNewType] = useState('');
 const [formtype] = Form.useForm();

 const fetChAllTypeProduct = async () => {
  try {
    const response = await Productsevice.getTypeProduct();
    
  const options = response.data.map((item) => ({
      label: item,
      value: item,
    }));
    setTypeOptions(options);
    setTypeOptions((prev) => [...prev, { label: 'Thêm Loại mới', value: 'NewTypeProduct' }]);


  } catch (error) {
    console.error('Error fetching product types:', error);
  }
};
useEffect(() => {
  fetChAllTypeProduct();
}, []);
 const handleChangenewTypeProduct = (value) => {
    if (value === 'NewTypeProduct') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };
  const handleAddType = () => {
    if (!newType.trim()) return;
    const formatted = newType.trim();
   const updatedOptions = [
      ...typeOptions.slice(0, -1),
      { label: formatted, value: formatted },
      typeOptions[typeOptions.length - 1], 
    ];
    setTypeOptions(updatedOptions);
    setShowInput(false);
    setNewType('');
    formtype.setFieldsValue({ type: formatted });
  };


const columns = [
  {
    title: 'Tên Sản Phẩm ',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Loại Sản Phẩm ',
    dataIndex: 'type',
    ...getColumnSearchProps('type'),
  },
  {
    title: 'Giá ',
    dataIndex: 'price',
     sorter: (a, b) => a.price - b.price,
       filters: [
      {
        text: '>= 50k',
        value: '>=',
      },
      {
        text: '<= 50k',
        value: '<=',      
      },
      
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => {
      console.log('value ',value,record);
      if(value === '>='){
         return record.price >=50
      } 
      return record.price <=50
    }
   
  },
  {
    title: 'Mô tả ',
    dataIndex: 'description',
  },
  {
    title: 'Tồn Kho ',
    dataIndex: 'countInStock',
  },
  //  {
  //   title: 'giảm giá',
  //   dataIndex: 'discount',
  // },
  // {
  //   title: 'đã bán  ',
  //   dataIndex: 'selled',
  // },
   
  {
    title: 'đánh giá ',
    dataIndex: 'rating',
    export: false,
     sorter: (a, b) => a.rating - b.rating,
      filters: [
      {
        text: '>= 3k',
        value: '>=',
      },
      {
        text: '<= 3',
        value: '<=',      
      },
      
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => {
      console.log('value ',value,record);
      if(value === '>='){
         return Number(record.rating) >= 3
      } 
      return record.rating <=3


    }
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
 const dataSource = products?.data.map((item) => ({
    key: item._id,
    name: item.name,
    type: item.type,
    price: item.price,
    description: item.description,
    countInStock: item.countInStock,
    rating: item.rating,
    image: item.image,
    discount:item.discount,
    selled:item.selled,

  }));
const image =  `${env.API_AV}${formedit.image}`

//-------------------------delete many product---------
const deletemanyProduct = useMutationHook.useMutationHooks(
  ({  data, accessToken }) => ProductService.DeleteManyProduct( data, accessToken) 
);

const handleDeleteManyProduct = (ids)=> {
  console.log('in ra danh sach id ' , ids)
 deletemanyProduct.mutate({
  data : ids,
  accessToken: user.access_token,
 },{
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
        queryClient.invalidateQueries(['products']);
      },
 }
)
}


//-------------------------delete many product---------

  return (
    <div>
      <WrapperHeader>Quản Lý sản phẩm</WrapperHeader>
      <Button 
        style={{
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
        <PlusCircleOutlined style={{ fontSize: '24px' }} /> Thêm Sản Phẩm
      </Button>

      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
       <Loading isloading={isLoading}>
        <Form
          form={form}
          name="productForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <WrapperFormItem
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Inputcomponent placeholder="Nhập tên sản phẩm" />
          </WrapperFormItem>

          <WrapperFormItem
           label="Loại Sản Phẩm"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
          >
            
               <Select

      placeholder="Chọn loại sản phẩm"
      options={typeOptions}
      onChange={handleChangenewTypeProduct}

    />
    {showInput && (
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập loại sản phẩm mới"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
          <Button type="primary" onClick={handleAddType}>
            Thêm
          </Button>
        </Space>
      )}
    

          </WrapperFormItem>

          <WrapperFormItem
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Inputcomponent placeholder="Nhập giá" />
          </WrapperFormItem>

          <WrapperFormItem
            label="Tồn Kho"
            name="countInStock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
          >
            <Inputcomponent placeholder="Nhập tồn kho" />
          </WrapperFormItem>

          <WrapperFormItem
            label="Đánh Giá"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
          >
            <Inputcomponent placeholder="Nhập đánh giá" />
          </WrapperFormItem>

          <WrapperFormItem
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Inputcomponent placeholder="Nhập mô tả" />
          </WrapperFormItem>

          <WrapperFormItem
            label="giảm giá"
            name="discount"
            rules={[{ required: true, message: 'Vui lòng nhập % giảm!' }]}
          >
            <Inputcomponent placeholder="Nhập mô tả" />
          </WrapperFormItem>

          <WrapperFormItem label="Ảnh" required>
            <Upload
              beforeUpload={() => false}
              showUploadList={false}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                style={{ marginTop: 10, maxWidth: "50px", height: "50px" }}
              />
            )}
          </WrapperFormItem>

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
        </Loading>
      </Modal>
      <ExportExcelButton data={dataSource} columns={columns} fileName="ProductList" />
    <Tablecomponent   product = {products?.data}  isLoading= {isLoading}  nametable ='xóa các sản phẩm đã chọn ' 
    handleDeleteMany = {handleDeleteManyProduct}
    dataSource={dataSource}
    columns= {columns}
    rowKey="key"
    onRow={(record, rowIndex) => {
    return {
      onClick: (event) => {
       setRowSelected(record.key);
     
      },
     
    };
  }}
    />
    <DrawerComponent title='chi tiết sản phẩm ' isOpen={isOpenDrawer} onCancel={handleCancel} onClose={() => {setIsOpenDrawer(false) , setFile(null) ,  setPreviewImage(null)  }  } width='70%' >
     <Loading isloading={isLoadingUpdate}>
        <Form
          form={formchitiet}
          name="productForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 800 }}
          onFinish={onUpdateProduct}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          
        >
          <WrapperFormItem
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Inputcomponent name="name" placeholder="Nhập tên sản phẩm"  value={formedit.name} onChange={handleChange}/>
          </WrapperFormItem>

          {/* <WrapperFormItem
            label="Loại Sản Phẩm"
            name="type"
            rules={[{ required: true, message: 'Vui lòng nhập loại sản phẩm!' }]}
          >
            <Inputcomponent  name="type" placeholder="Nhập loại sản phẩm"  value={formedit.type} onChange={handleChange}/>
          </WrapperFormItem> */}

          <WrapperFormItem
           label="Loại Sản Phẩm"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
          >
            
               <Select

            placeholder="Chọn loại sản phẩm"
             options={typeOptions}
             value={formedit.type}
             onChange={handleSelectChange}
     

    />
    {showInput && (
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập loại sản phẩm mới"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
          <Button type="primary" onClick={handleAddType}>
            Thêm
          </Button>
        </Space>
      )}
    

          </WrapperFormItem>

          <WrapperFormItem
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Inputcomponent  name="price" placeholder="Nhập giá" value={formedit.price} onChange={handleChange} />
          </WrapperFormItem>

          <WrapperFormItem
            label="Tồn Kho"
            name="countInStock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
          >
            <Inputcomponent  name="countInStock" placeholder="Nhập tồn kho" value={formedit.countInStock} onChange={handleChange} />
          </WrapperFormItem>

          <WrapperFormItem
            label="Đánh Giá"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
          >
            <Inputcomponent placeholder="Nhập đánh giá"  name="rating" value={formedit.rating} onChange={handleChange}/>
          </WrapperFormItem>

          <WrapperFormItem
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Inputcomponent placeholder="Nhập mô tả"  name="description"  value={formedit.description} onChange={handleChange}/>
          </WrapperFormItem>

            <WrapperFormItem
            label="Giảm giá"
            name="discount"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Inputcomponent placeholder="Nhập mô tả"  name="discount"  value={formedit.discount} onChange={handleChange}/>
          </WrapperFormItem>
          <WrapperFormItem
            label="Đã Bán "
            name="selled"
           
          >
            <Inputcomponent placeholder="Nhập mô tả"  name="selled"  value={formedit.selled}  disabled  />
          </WrapperFormItem>

          <WrapperFormItem label="Ảnh" required>
            
            <img src={image} alt=""  width={300}  height={200}/>
            <Upload
              beforeUpload={() => false}
              showUploadList={false}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                style={{ marginTop: 10, maxWidth: "50px", height: "50px" }}
              />
            )}
            
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
             bạn có chắc xóa sản phẩm này không
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default AdminProduct;

const WrapperHeader = styled.h1`
  color: #000;
  font-size: 20px;
`;

const WrapperFormItem = styled(Form.Item)`
  .ant-form-item-label {
    text-align: left;
  }
  .ant-form-item-control {
    width: 100%;
  }
`;
