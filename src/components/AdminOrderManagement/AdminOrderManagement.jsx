import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Space, Button, Tabs, Modal, Descriptions, message } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import OrderService from '../../services/OrderService'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import InvoicePDF from '../InvoicePDF/InvoicePDF'
import Inputcomponent from '../InputComponent/Inputcomponent';
const AdminOrderManagement = () => {
const { TabPane } = Tabs;
const invoiceRef = useRef();
const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'cyan',
  shipping: 'gold',
  delivered: 'green',
  cancelled: 'red',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã huỷ',
};


 const user = useSelector((state) => state.user);
 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');


 const [searchTexts, setSearchTexts] = useState({});
 const [searchedColumns, setSearchedColumns] = useState({}); 
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
  const fetchOrders = async (status = '') => {
  setLoading(true);
  try {
    let res;

    // ✅ Gọi service khác khi status là "cancelled"
    if (status === 'cancelled') {
      res = await OrderService.getCancelledOrders(user.access_token);
    } else {
      res = await OrderService.getOrder(
        status !== 'all' && status !== 'unpaid' ? status : '',
        user.access_token
      );

      if (status === 'unpaid') {
        res.data = res.data.filter(order => order.isPaid === false);
      }
      console.log(res)
    }

    setOrders(res?.data || []);
  } catch (error) {
    message.error('Lỗi khi lấy danh sách đơn hàng');
  }
  setLoading(false);
};
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try{ 
        const UpdateStatus = await OrderService.updateOrderStatus(id, user.access_token,status )
         console.log('cap nhat don hang thanh cong ',UpdateStatus )
    }catch(error){
        message.error('Lỗi khi lấy danh sách đơn hàng');
    }
    message.success(`Cập nhật đơn ${id} sang trạng thái ${statusLabels[status]}`);
    setOrders(prev =>
      prev.map(order =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

    const exportToExcel = () => {
      const data = [];
  
      orders.forEach((order) => {
        order.oderItems.forEach((item) => {
          const discount = item.discount || 0;
          const totalLine = item.price * item.amount * (1 - discount / 100);
  
          data.push({
            'Mã đơn': order._id,
            'Ngày đặt': new Date(order.createdAt).toLocaleDateString('vi-VN'),
            'Khách hàng': order.shippingAddress.fullName,
            'SĐT': order.shippingAddress.phone,
            'Địa chỉ': `${order.shippingAddress.adress}, ${order.shippingAddress.city}`,
            'Tên SP': item.name,
            'SL': item.amount,
            'Đơn giá': item.price,
            'Giảm giá (%)': discount,
            'Tổng': order.totalPrice,
            'PT thanh toán': order.paymentMethod,
            'Trạng thái': statusLabels[order.status],
          });
        });
      });
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'DonHang');
  
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      saveAs(blob, `DonHang_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
        sorter: (a, b) => a._id.localeCompare(b._id),
    ...getColumnSearchProps('_id'),
    render: text => <a>{text}</a>,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['shippingAddress', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'confirmed')}>Xác nhận</Button>
          )}
          {record.status === 'confirmed' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'shipping')}>Giao hàng</Button>
          )}
          {record.status === 'shipping' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'delivered')}>Hoàn tất</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chưa xác nhận" key="pending" />
        <TabPane tab="Đã xác nhận" key="confirmed" />
        <TabPane tab="Đã thanh toán" key="paid" />
        <TabPane tab="Chưa thanh toán" key="unpaid" />
        <TabPane tab="Đang giao" key="shipping" />
        <TabPane tab="Đã giao" key="delivered" />
        <TabPane tab="Đã huỷ" key="cancelled" />
      </Tabs>
 <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={exportToExcel}
        disabled={orders.length === 0}
      >
        Xuất Excel
      </Button>
      <Table columns={columns} dataSource={orders} loading={loading} rowKey="_id" />

      <Modal
  title="Chi tiết đơn hàng"
  open={openModal}
  onCancel={() => setOpenModal(false)}
  footer={[
    <Button key="close" onClick={() => setOpenModal(false)}>Đóng</Button>,
    <Button key="pdf" type="primary" onClick={() => invoiceRef.current?.exportPDF()}>
      Xuất hóa đơn (PDF)
    </Button>
  ]}
>
  {selectedOrder && <InvoicePDF ref={invoiceRef} order={selectedOrder} />}
</Modal>
    </>
  );
};

export default AdminOrderManagement;
