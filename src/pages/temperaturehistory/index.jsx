import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Card, Spin } from "antd";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TemperatureChartDirect() {
  const { id } = useParams();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ref để theo dõi ID bản ghi mới nhất, tránh chèn lặp dữ liệu tĩnh khi quét realtime
  const lastDataIdRef = useRef(null);

  useEffect(() => {
    // 1. Lấy dữ liệu nền ban đầu (200 bản ghi)
    const initChartData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/temperaturehistory/getDetail200/6a057f4ae5d0b8db8e4d1586`);
        
        if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
          const rawData = res.data.data;
          
          // Lưu ID bản ghi mới nhất hiện tại (vị trí số 0)
          lastDataIdRef.current = rawData[0]._id;

          const formattedData = rawData.map((item) => {
            const time = new Date(item.createdAt);
            return {
              id: item._id,
              timeLabel: time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
              "Nhiệt độ (°C)": parseFloat(item.cambienNhietdo.toFixed(1)) // Làm tròn 1 chữ số thập phân cho đẹp mắt
            };
          });

          // Đảo ngược mảng để dòng thời gian chạy chuẩn từ Cũ -> Mới (Trái sang Phải)
          setChartData(formattedData.reverse());
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu nhiệt độ ban đầu:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Định kỳ check bản ghi mới từ thiết bị chèn tiếp vào đuôi
    const fetchRealtimeData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/temperaturehistory/getDetail200/6a057f4ae5d0b8db8e4d1586`);
        
        if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
          const latestItem = res.data.data[0];

          // Nếu phát hiện có gói tin mới vừa được ghi xuống DB
          if (latestItem._id !== lastDataIdRef.current) {
            lastDataIdRef.current = latestItem._id;

            const time = new Date(latestItem.createdAt);
            const newNode = {
              id: latestItem._id,
              timeLabel: time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
              "Nhiệt độ (°C)": parseFloat(latestItem.cambienNhietdo.toFixed(1))
            };

            setChartData((prevData) => {
              const updated = [...prevData, newNode];
              if (updated.length > 200) {
                updated.shift(); // Giữ tối đa 200 điểm trên biểu đồ
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Lỗi cập nhật realtime nhiệt độ:", error);
      }
    };

    initChartData();

    // Polling nhẹ nhàng mỗi 1.5 giây để cập nhật realtime
    const interval = setInterval(() => {
      fetchRealtimeData();
    }, 1500);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Spin size="large" tip="Đang kết nối dữ liệu cảm biến nhiệt độ..." />
      </LoadingWrapper>
    );
  }

  return (
    <ChartContainer>
      <Card title="🌡️ Biểu đồ nhiệt độ thời gian thực (Direct API)">
        <div style={{ width: "100%", height: 400, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Gradient màu đỏ cam dịu đặc trưng cho nhiệt độ */}
                <linearGradient id="colorTempDirect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

              <XAxis 
                dataKey="timeLabel" 
                tick={{ fontSize: 11, fill: "#8c8c8c" }}
                minTickGap={40}
              />

              <YAxis 
                tick={{ fontSize: 12, fill: "#8c8c8c" }}
                domain={['dataMin - 2', 'dataMax + 2']} // Tự động căn chỉnh trục Y vừa vặn theo giải nhiệt độ thực tế
                label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
              />

              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, borderColor: "#e8e8e8" }}
              />

              <Area
                type="monotone"
                dataKey="Nhiệt độ (°C)"
                stroke="#ff4d4f"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTempDirect)"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </ChartContainer>
  );
}

// ================= STYLES =================
const ChartContainer = styled.div`
  margin-top: 24px;
  .ant-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  .ant-card-head-title {
    font-weight: bold;
    color: #262626;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;