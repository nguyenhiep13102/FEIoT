import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/Buttoncomponent/Buttoncomponent';
import { useDispatch, useSelector } from 'react-redux';
import UserService from '../../services/UserServices.jsx';
import * as useMutationHook from '../../hooks/useMutationHook.js';
import Loadingcom from '../../components/LoadingComponent/loading.jsx';
import { Button, message, Upload,Image, Avatar } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import env from '../../../env.js'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const ProfilePages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log('user', user);

   
 const updateAvatar = useMutationHook.useMutationHooks(
        (data) => UserService.updateAvatar(data.id,data.formData),{
            onSuccess: (data) => {
         if (data?.data?.avatar) {
        dispatch(updateUsers({ avatar: data.data.avatar }));
    }
  }
        }
    );
    const [avatar, setAvatar] = useState('');
  
 const [formedit, setFormedit] = useState({
     name: '',
     email : '',
     phone: '',
     addres: '',
   });

   
    const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const handlePreview = file =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (!file.url && !file.preview) {
        file.preview = yield getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    });
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>tải avatar</div>
    </button>
  );  
const handleUpload = async () => {
  if (!fileList.length) {
    message.warning("Vui lòng chọn một ảnh.");
    return;
  }

  const formData = new FormData();
  formData.append('avatar', fileList[0].originFileObj); 

  updateAvatar.mutate({
    id: user._id,
    formData: formData,
  },{
    onSuccess: () => {
    setFileList([]); 
    message.success("Cập nhật avatar thành công");
    window.location.reload(); 

  },
  onError: () => {
    message.error("Upload avatar thất bại");
  }
  }
)


};
//-----------------------------uodate'
 const updateUsers = useMutationHook.useMutationHooks(
        ( {id , data ,accessToken}  ) => UserService.updateUser(id, data, accessToken),
        {
          onSuccess: (response) => {
          if (response?.status === "success") {
        console.log('Update thành công:', response.data);
        message.success("Cập nhật thông tin thành công!");
        window.location.reload(); 
      }
           
        },
        onError: (error) => {
          message.error(error.message || "Cập nhật thông tin thất bại. Vui lòng thử lại!");
          }

        },
       
    );

    
useEffect(() => {
  if (user) {
    setFormedit({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      addres: user.addres || '',
    });
  }
}, [user]); 
const handleOnChange = (field) => (e) => {
  const { name, value } = e.target;
 
  console.log(`Trường "${name}" vừa được thay đổi:`, value);
    setFormedit((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const handleUpdate = () => {
        console.log('Chạy cập nhật với data:', formedit);
console.log('Chạy cập nhật với data:', user._id);
console.log('Chạy cập nhật với data:', user.access_token);

        updateUsers.mutate(
          {
            id: user._id,
            data : formedit,
            accessToken: user.access_token,  
        }
    )
   
    };



//-----------------------------uodate



   const image = `${env.API_AV}${user.avatar}`
    return (
        <div style={{ width: '1200px', margin: '0 auto' }}>
            <WrapperHeader>Thông tin người dùng </WrapperHeader>
           
            <Loadingcom isloading={false}>
                <WrapperContentProfile>
                    <WrapperIput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm
                             name="email"
                            style={{ with: '300px' }}
                            value={formedit.email}
                            id="email"
                           onChange={handleOnChange('email')}
                           
                        />
                        <ButtonComponent
                            size={40}
                            textButton={'Cập Nhật '}
                            bgColor="#1523c2"
                            textColor="#fff"
                            height="30px"
                            width="fit-content"
                            borderRadius="4px"
                            style={{ margin: '26px 0 10px' }}
                            border="1px solid rgb(26 , 148, 255)"
                            onClick={handleUpdate}
                        />
                    </WrapperIput>
                    <WrapperIput>
                        <WrapperLabel htmlFor="name">Họ và tên </WrapperLabel>
                        <InputForm
                         name="name"
                            style={{ with: '300px' }}
                            value={formedit.name}
                            id="name"
                          onChange={handleOnChange('name')}
                            
                        />
                        <ButtonComponent
                            size={40}
                            textButton={'Cập Nhật '}
                            bgColor="#1523c2"
                            textColor="#fff"
                            height="30px"
                            width="fit-content"
                            borderRadius="4px"
                            style={{ margin: '26px 0 10px' }}
                            border="1px solid rgb(26 , 148, 255)"
                            onClick={handleUpdate}
                        />
                    </WrapperIput>
                    <WrapperIput>
                        <WrapperLabel htmlFor="phone">Số điện thoại </WrapperLabel>
                        <InputForm
                            name="phone"
                            style={{ with: '300px' }}
                            value={formedit.phone}
                            id="phone"
                            onChange={handleOnChange('phone')}
                            
                        />
                        <ButtonComponent
                            size={40}
                            textButton={'Cập Nhật '}
                            bgColor="#1523c2"
                            textColor="#fff"
                            height="30px"
                            width="fit-content"
                            borderRadius="4px"
                            style={{ margin: '26px 0 10px' }}
                            border="1px solid rgb(26 , 148, 255)"
                            onClick={handleUpdate}
                        />
                    </WrapperIput>
                    <WrapperIput>
                        <WrapperLabel htmlFor="addres">Địa chỉ </WrapperLabel>
                        <InputForm
                         name="addres"
                            style={{ with: '300px' }}
                            value={formedit.addres}
                            id="addres"
                            onChange={handleOnChange('addres')}
                            
                        />
                        <ButtonComponent
                            size={40}
                            textButton={'Cập Nhật '}
                            bgColor="#1523c2"
                            textColor="#fff"
                            height="30px"
                            width="fit-content"
                            borderRadius="4px"
                            style={{ margin: '26px 0 10px' }}
                            border="1px solid rgb(26 , 148, 255)"
                            onClick={handleUpdate}
                        />
                    </WrapperIput>
                    <WrapperIput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <Avatar size={64} src= {image}/>
                        <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
         beforeUpload={(file) => {
         setFileList([file]); 
          return false; 
  }}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}                                           
                        <ButtonComponent
                            size={40}
                            textButton={'lưu'}
                            bgColor="#1523c2"
                            textColor="#fff"
                            height="30px"
                            width="fit-content"
                            borderRadius="4px"
                            style={{ margin: '26px 0 10px' }}
                            border="1px solid rgb(26 , 148, 255)"
                            onClick={handleUpload}
                        />
                    </WrapperIput>
                </WrapperContentProfile>
            </Loadingcom>
        </div>
    );
};

export default ProfilePages;

const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    margin: 4px 0;
`;

const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 700px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
`;


const WrapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
    width: 200px;
`;

const WrapperIput = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
