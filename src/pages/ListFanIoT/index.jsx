import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Card,
  Breadcrumb,
} from "antd";

import {
  RightOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import IoTServices from "../../services/IoTServices";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const TableContainer = styled.div`
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .ant-table-row {
    cursor: pointer;

    &:hover {
      background-color: #f6ffed !important;
    }
  }
`;

const ListFanIoT = () => {
  const navigate = useNavigate();

  const [iotData, setIotData] = useState([]);

  const user = useSelector((state) => state.user);

  console.log("user", user);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      const res = await IoTServices.getMyIoT(
        user._id
      );

      console.log("IoT Data:", res);

      // FIX
      if (res?.data?.data) {
        setIotData(res.data.data);
      }
    };

    fetchData();
  }, []);

  // ================= COLUMNS =================
  const columns = [
    {
      title: "Tên cơ sở",
      dataIndex: "name",
      key: "name",

      render: (text) => (
        <Space>
          <EnvironmentOutlined
            style={{ color: "#52c41a" }}
          />

          <Text strong>{text}</Text>
        </Space>
      ),
    },

    {
      title: "Vị trí địa lý",
      dataIndex: "location",
      key: "location",
      responsive: ["md"],
    },

    {
      title: "Thiết bị",
      dataIndex: "deviceCount",
      key: "deviceCount",
      align: "center",

      render: (count) => (
        <Tag color="blue">{count} Nodes</Tag>
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag
          color={
            status === "Online"
              ? "green"
              : "volcano"
          }
          style={{ borderRadius: "10px" }}
        >
          ● {status}
        </Tag>
      ),
    },

    {
      title: "Hành động",
      key: "action",
      align: "right",

      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<RightOutlined />}
          onClick={(e) => {
            e.stopPropagation();

            handleGoToDetail(record.id);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // ================= HANDLE =================
  const handleGoToDetail = (id) => {
    console.log(
      "Chuyển đến trang chi tiết hệ thống:",
      id
    );

    navigate(`/detailDevIoT/${id}`);
  };

  return (
    <TableContainer>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            Dự án
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            Danh sách hệ thống
          </Breadcrumb.Item>
        </Breadcrumb>

        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Space
            direction="vertical"
            style={{ width: "100%" }}
            size="large"
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Title
                  level={2}
                  style={{ margin: 0 }}
                >
                  <GlobalOutlined /> Trạm giám
                  sát IoT
                </Title>

                <Text type="secondary">
                  Danh sách các điểm lắp đặt hệ
                  thống tưới cây thông minh
                </Text>
              </div>

              <Button
                type="primary"
                icon={<ContainerOutlined />}
                size="large"
              >
                Báo cáo tổng hợp
              </Button>
            </div>

            {/* ================= TABLE ================= */}

            <Table
              columns={columns}
              dataSource={
                iotData?.map((item) => ({
                  key: item._id,

                  id: item._id,

                  name: item.namecty,

                  location: `${item.district}, ${item.address}`,

                  deviceCount: 1,

                  status: "Online",
                })) || []
              }
              pagination={{ pageSize: 5 }}
              onRow={(record) => ({
                onClick: () =>
                  handleGoToDetail(record.id),
              })}
            />
          </Space>
        </Card>
      </div>
    </TableContainer>
  );
};

export default ListFanIoT;