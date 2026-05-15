import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Card, Tag, Switch } from "antd";

import {
  PoweroffOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CloudOutlined,
  SunOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { useParams } from "react-router-dom";
import IoTServices from "../../services/IoTServices";

// ============ MAIN COMPONENT ============
export default function DetailIoTdev() {
  const { id } = useParams();

  const [iotData, setIotData] = useState(null);

  const [autoMode, setAutoMode] = useState(false);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // ================= FETCH DATA =================
useEffect(() => {
  const fetchData = async () => {
    const res =
      await IoTServices.careplantbyid(id);

    console.log("CAREPLANT:", res);

    if (res?.data?.length > 0) {
      setIotData(res.data[0]);
    }
  };

  // gọi lần đầu
  fetchData();

  // gọi realtime mỗi 2 giây
  const interval = setInterval(() => {
    fetchData();
  }, 1000);

  // clear interval khi unmount
  return () => clearInterval(interval);

}, [id]);

  // ================= REFRESH TIME =================
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ================= HANDLE TOGGLE =================
  const handleTogglePump = () => {
    setIotData((prev) => ({
      ...prev,
      trangthaiMaybom:
        prev.trangthaiMaybom === 1 ? 0 : 1,
    }));
  };

  const handleToggleLight = () => {
    setIotData((prev) => ({
      ...prev,
      trangthaiDen:
        prev.trangthaiDen === 1 ? 0 : 1,
    }));
  };

  // ================= SENSOR DATA =================
  const sensorData = [
    {
      label: "Temperature",
      value:
        iotData?.cambienNhietdo?.toFixed(1) ||
        0,
      unit: "°C",
      icon: <ExperimentOutlined />,
      borderColor: "#ff4d4f",
      color: "#ff4d4f",
    },

    {
      label: "Soil Moisture",
      value:
        iotData?.cambienDoam_Mat_Dat?.toFixed(
          1
        ) || 0,
      unit: "%",
      icon: <CloudOutlined />,
      borderColor: "#1890ff",
      color: "#1890ff",
    },

    {
      label: "Light Intensity",
      value: iotData?.cambienAnhSang || 0,
      unit: "lux",
      icon: <SunOutlined />,
      borderColor: "#52c41a",
      color: "#52c41a",
    },

    {
      label: "Pump Speed",
      value: iotData?.tocdoMaybom || 0,
      unit: "%",
      icon: <PoweroffOutlined />,
      borderColor: "#722ed1",
      color: "#722ed1",
    },
  ];

  return (
    <Container>
      <MainWrapper>
        {/* HEADER */}
        <HeaderSection>
          <Title>Smart Irrigation System</Title>

          <SubTitle>
            Region: {iotData?.IdStyemLocation}
            {" | "}
            Pump ID: {iotData?.IDmaybom}
            {" | "}
            Last Update:
            {" "}
            {lastUpdate.toLocaleTimeString()}
          </SubTitle>
        </HeaderSection>

        {/* SENSOR DASHBOARD */}
        <MetricsGrid>
          {sensorData.map((sensor, index) => (
            <MetricCard
              key={index}
              borderColor={sensor.borderColor}
            >
              <MetricIcon color={sensor.color}>
                {sensor.icon}
              </MetricIcon>

              <MetricLabel>
                {sensor.label}
              </MetricLabel>

              <MetricValue>
                {sensor.value}
                <MetricUnit>
                  {" "}
                  {sensor.unit}
                </MetricUnit>
              </MetricValue>
            </MetricCard>
          ))}
        </MetricsGrid>

        {/* CONTROL PANEL */}
        <ControlPanel>
          <PanelTitle>
            Device Control
          </PanelTitle>

          {/* LIGHT */}
          <DeviceRow>
            <DeviceInfo>
              <DeviceIcon
                bgColor="#f6ffed"
                iconColor="#52c41a"
              >
                <BulbOutlined />
              </DeviceIcon>

              <div>
                <DeviceName>
                  {iotData?.loaiden}
                </DeviceName>

                <DeviceStatus>
                  ID: {iotData?.IDden}
                </DeviceStatus>
              </div>
            </DeviceInfo>

            <ControlGroup>
              <Tag
                color={
                  iotData?.trangthaiDen === 1
                    ? "green"
                    : "red"
                }
              >
                {iotData?.trangthaiDen === 1
                  ? "ON"
                  : "OFF"}
              </Tag>

              <ControlButton
                className={
                  iotData?.trangthaiDen === 1
                    ? "on"
                    : "off"
                }
                onClick={handleToggleLight}
              >
                {iotData?.trangthaiDen === 1
                  ? "TURN OFF"
                  : "TURN ON"}
              </ControlButton>
            </ControlGroup>
          </DeviceRow>

          {/* PUMP */}
          <DeviceRow>
            <DeviceInfo>
              <DeviceIcon
                bgColor="#e6f7ff"
                iconColor="#1890ff"
              >
                <PoweroffOutlined />
              </DeviceIcon>

              <div>
                <DeviceName>
                  {iotData?.loaimaybom}
                </DeviceName>

                <DeviceStatus>
                  ID: {iotData?.IDmaybom}
                </DeviceStatus>
              </div>
            </DeviceInfo>

            <ControlGroup>
              <Tag
                color={
                  iotData?.trangthaiMaybom === 1
                    ? "green"
                    : "red"
                }
              >
                {iotData?.trangthaiMaybom === 1
                  ? "ON"
                  : "OFF"}
              </Tag>

              <ControlButton
                className={
                  iotData?.trangthaiMaybom === 1
                    ? "on"
                    : "off"
                }
                onClick={handleTogglePump}
              >
                {iotData?.trangthaiMaybom === 1
                  ? "TURN OFF"
                  : "TURN ON"}
              </ControlButton>
            </ControlGroup>
          </DeviceRow>
        </ControlPanel>

        {/* AUTO MODE */}
        <AutoModeSection>
          <AutoModeHeader>
            <AutoModeTitle>
              Automatic Control Mode
            </AutoModeTitle>

            <Switch
              checked={autoMode}
              onChange={setAutoMode}
              size="large"
            />
          </AutoModeHeader>

          {autoMode ? (
            <NoticeBox success>
              <CheckCircleOutlined />
              Automatic mode enabled
            </NoticeBox>
          ) : (
            <NoticeBox>
              <SettingOutlined />
              Manual mode enabled
            </NoticeBox>
          )}
        </AutoModeSection>

        {/* ACTION BAR */}
        <ActionBar>
          <ActionButton
            icon={<ReloadOutlined />}
            onClick={() =>
              window.location.reload()
            }
          >
            Refresh
          </ActionButton>

          <ActionButton
            icon={<EyeOutlined />}
            type="primary"
          >
            View Charts
          </ActionButton>

          <ActionButton
            icon={<DownloadOutlined />}
          >
            Export
          </ActionButton>
        </ActionBar>
      </MainWrapper>
    </Container>
  );
}

// ================= STYLES =================

const Container = styled.div`
  min-height: 100vh;
  background: #f5f6fa;
  padding: 24px;
`;

const MainWrapper = styled.div`
  max-width: 1400px;
  margin: auto;
`;

const HeaderSection = styled.div`
  background: linear-gradient(
    135deg,
    #1e3c72 0%,
    #2a5298 100%
  );

  padding: 40px;
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
`;

const SubTitle = styled.p`
  margin-top: 10px;
  opacity: 0.8;
`;

const MetricsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(240px, 1fr)
  );

  gap: 20px;

  margin-bottom: 24px;
`;

const MetricCard = styled(Card)`
  border-left: 4px solid
    ${(props) => props.borderColor};
`;

const MetricIcon = styled.div`
  font-size: 24px;
  color: ${(props) => props.color};
`;

const MetricLabel = styled.div`
  margin-top: 10px;
  color: #666;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
`;

const MetricUnit = styled.span`
  font-size: 14px;
  color: #999;
`;

const ControlPanel = styled(Card)`
  margin-bottom: 24px;
`;

const PanelTitle = styled.h2`
  margin-bottom: 20px;
`;

const DeviceRow = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 16px 0;

  border-bottom: 1px solid #f0f0f0;
`;

const DeviceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeviceIcon = styled.div`
  width: 45px;
  height: 45px;

  border-radius: 50%;

  background: ${(props) => props.bgColor};

  display: flex;

  align-items: center;

  justify-content: center;

  color: ${(props) => props.iconColor};

  font-size: 20px;
`;

const DeviceName = styled.div`
  font-weight: bold;
`;

const DeviceStatus = styled.div`
  color: #777;
  font-size: 13px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ControlButton = styled(Button)`
  &.on {
    background: #52c41a !important;
    color: white !important;
  }

  &.off {
    background: #f5222d !important;
    color: white !important;
  }
`;

const AutoModeSection = styled(Card)`
  margin-bottom: 24px;
`;

const AutoModeHeader = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;
`;

const AutoModeTitle = styled.h3`
  margin: 0;
`;

const NoticeBox = styled.div`
  margin-top: 20px;

  padding: 12px;

  border-radius: 6px;

  background: ${(props) =>
    props.success ? "#f6ffed" : "#fff7e6"};

  color: ${(props) =>
    props.success ? "#389e0d" : "#d48806"};
`;

const ActionBar = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 12px;
`;

const ActionButton = styled(Button)`
  height: 36px;
`;