import React, { forwardRef, useImperativeHandle } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Descriptions, Table } from 'antd';
import dayjs from 'dayjs';
const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã huỷ',
};

const InvoicePDF = forwardRef(({ order }, ref) => {
  useImperativeHandle(ref, () => ({
    exportPDF,
  }));

  const exportPDF = () => {
    const input = document.getElementById('invoice-content');
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`HoaDon_${order?._id || 'donhang'}.pdf`);
    });
  };

  if (!order) return null;

  // Cột cho bảng sản phẩm
  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount) => discount || 0,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => {
        const discount = record.discount || 0;
        const total = record.price * record.amount * (1 - discount / 100);
        return `${total.toLocaleString()}₫`;
      },
    },
  ];

  return (
    <div id="invoice-content" style={{ padding: 16, background: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>HÓA ĐƠN BÁN HÀNG</h2>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Mã đơn hàng">{order._id}</Descriptions.Item>
        <Descriptions.Item label="Khách hàng">{order.shippingAddress.fullName}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{order.shippingAddress.phone}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {order.shippingAddress.adress}, {order.shippingAddress.city}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">{order.paymentMethod} </Descriptions.Item>
        <Descriptions.Item label="Ngày thanh toán">
             {order.paidAt ? dayjs(order.paidAt).format('HH:mm   DD/MM/YYYY') : 'Chưa thanh toán'}
          </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{statusLabels[order.status]}</Descriptions.Item>
        <Descriptions.Item label="tiền thuế">{order.taxiPrice.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="tiền ship">{order.shippingPrice.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Thời điểm xuất hóa đơn">
           {dayjs().format('HH:mm   DD/MM/YYYY')}
          </Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: 24 }}>Danh sách sản phẩm</h3>
      <Table
        columns={productColumns}
        dataSource={order.oderItems}
        pagination={false}
        rowKey={(item, idx) => idx}
        size="small"
        bordered
      />
         <div style={{ textAlign: 'right', marginTop: 16, fontWeight: 'bold', fontSize: 16 }}>
  Tổng cộng: {order.totalPrice.toLocaleString()}₫
</div>
    </div>
  );
});

export default InvoicePDF;
