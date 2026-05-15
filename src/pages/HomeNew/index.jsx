import React from "react";
import { Typography, Card, Col, Row, Timeline, Tag, Divider, Avatar, Space } from "antd";
import { 
  RocketOutlined, 
  UserOutlined, 
  CheckCircleOutlined, 
  SettingOutlined, 
  MonitorOutlined, 
  DatabaseOutlined 
} from "@ant-design/icons";
import styled from "styled-components";
import hiepavatar from "../../assets/images/anhcangquan.jpg";
const { Title, Paragraph, Text } = Typography;

// --- Styled Components ---
const IntroWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #fff;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
              url('https://www.transparenttextures.com/patterns/leaf.png');
  border-radius: 20px;
  margin-bottom: 40px;
`;

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  height: 100%;
`;

const MemberTag = styled(Tag)`
  padding: 8px 16px;
  font-size: 15px;
  border-radius: 50px;
  margin: 5px;
`;

export default function ProjectIntroduction() {
  return (
    <IntroWrapper>
      {/* 1. Header & Tên Đề Tài */}
      <HeroSection>
        <RocketOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 20 }} />
        <Title level={1} style={{ margin: 0, color: '#1b5e20', textTransform: 'uppercase' }}>
          Hệ thống tưới cây thông minh
        </Title>
        <Text type="secondary" style={{ fontSize: 18 }}>Dự án IoT kết hợp giám sát và tự động hóa nông nghiệp</Text>
      </HeroSection>

      <Row gutter={[32, 32]}>
        {/* 2. Thành viên nhóm */}
        <Col span={24}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Divider><Title level={3}>👥 Đội ngũ thực hiện</Title></Divider>
            <Space size="large" wrap>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                <div style={{ marginTop: 8 }}><Text strong>Tiêu Công Trường</Text></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#108ee9' }} />
                <div style={{ marginTop: 8 }}><Text strong>Đặng Văn Vinh</Text></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={64} src={hiepavatar} />
                <div style={{ marginTop: 8 }}><Text strong>Nguyễn Hữu Hiệp</Text></div>
              </div>
            </Space>
          </div>
        </Col>

        {/* 3. Mục tiêu đề tài */}
        <Col span={24}>
          <StyledCard style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={4}><CheckCircleOutlined /> Mục tiêu đề tài</Title>
            <Paragraph style={{ fontSize: 16, lineHeight: '1.8' }}>
              Xây dựng một hệ thống <strong>IoT (Internet of Things)</strong> giúp giám sát và tự động tưới cây thông minh. 
              Giải pháp hướng tới việc <strong>tối ưu hóa lượng nước sử dụng</strong>, giảm thiểu công sức lao động và nâng cao 
              hiệu quả chăm sóc cây trồng dựa trên dữ liệu môi trường chính xác.
            </Paragraph>
          </StyledCard>
        </Col>

        {/* 4. Mục tiêu cụ thể (Timeline Style) */}
        <Col span={24}>
          <Divider orientation="left"><Title level={3}>🌱 Mục tiêu cụ thể</Title></Divider>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Timeline
                mode="left"
                items={[
                  {
                    color: 'green',
                    label: 'Giai đoạn 1',
                    children: (
                      <>
                        <Text strong>Giám sát môi trường</Text>
                        <ul style={{ paddingLeft: 16 }}>
                          <li>Đo độ ẩm đất thời gian thực</li>
                          <li>Cảm biến nhiệt độ, độ ẩm không khí</li>
                          <li>Theo dõi cường độ ánh sáng</li>
                        </ul>
                      </>
                    ),
                    dot: <MonitorOutlined />
                  },
                  {
                    color: 'blue',
                    label: 'Giai đoạn 2',
                    children: (
                      <>
                        <Text strong>Tự động hóa & Điều khiển</Text>
                        <ul style={{ paddingLeft: 16 }}>
                          <li>Bật/tắt bơm dựa trên ngưỡng độ ẩm</li>
                          <li>Điều khiển từ xa qua Web/App</li>
                          <li>Cơ chế bảo vệ bơm khi quá tải</li>
                        </ul>
                      </>
                    ),
                    dot: <SettingOutlined />
                  }
                ]}
              />
            </Col>
            <Col xs={24} md={12}>
               <Timeline
                mode="left"
                items={[
                  {
                    color: 'gold',
                    label: 'Giai đoạn 3',
                    children: (
                      <>
                        <Text strong>Xử lý dữ liệu</Text>
                        <ul style={{ paddingLeft: 16 }}>
                          <li>Đẩy dữ liệu lên Cloud Server</li>
                          <li>Lưu trữ lịch sử biểu đồ</li>
                          <li>Phân tích xu hướng phát triển</li>
                        </ul>
                      </>
                    ),
                    dot: <DatabaseOutlined />
                  }
                ]}
              />
              <StyledCard style={{ background: '#e6f7ff' }}>
                 <Text italic>"Công nghệ mang lại sự sống xanh, giải pháp bền vững cho nông nghiệp tương lai."</Text>
              </StyledCard>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />
      <div style={{ textAlign: 'center', color: '#bfbfbf', paddingBottom: 20 }}>
        Dự án Đồ án IoT - Đại học [Tên Trường Của Bạn] - 2024
      </div>
    </IntroWrapper>
  );
}