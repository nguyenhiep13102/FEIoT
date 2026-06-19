import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Card, Spin } from "antd";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LightChartDirect() {
  const { id } = useParams();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Gọi TRỰC TIẾP URL endpoint của bạn ở backend bằng axios
        const res = await axios.get(`http://localhost:5001/api/historyline/getDetail200/6a057f4ae5d0b8db8e4d1586`);
        console.log("API Response for Light Chart:", res.data);
        
        if (res.data && res.data.success && res.data.data) {
          // Định dạng cấu trúc dữ liệu cho biểu đồ Recharts
          const formattedData = res.data.data.map((item) => {
            const time = new Date(item.createdAt);
            return {
              // SỬA TẠI ĐÂY: Định dạng giờ chuẩn Việt Nam (24h) không lo bị lệch múi giờ hay sai định dạng
              timeLabel: time.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }),
              "Cường độ ánh sáng (lux)": item.cambienAnhSang,
              "Trạng thái đèn": item.trangthaiDen === 1 ? "BẬT" : "TẮT"
            };
          });

          // .reverse() để lật ngược mảng giúp dòng thời gian chạy xuôi từ trái (cũ) sang phải (mới)
          setChartData(formattedData.reverse());
        }
      } catch (error) {
        console.error("Lỗi khi fetch trực tiếp API lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    // Chạy lần đầu ngay khi mount component
    fetchChartData();

    // SỬA TẠI ĐÂY: Đổi từ 200ms lên 1500ms (1.5 giây) để tránh spam API làm đảo lộn thứ tự dữ liệu trả về
    const interval = setInterval(() => {
      fetchChartData();
    }, 1500);

    // Dọn dẹp interval khi chuyển trang/unmount component
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Spin size="large" tip="Đang tải dữ liệu biểu đồ..." />
      </LoadingWrapper>
    );
  }

  return (
    <ChartContainer>
      <Card title="📈 Biểu đồ cường độ ánh sáng thời gian thực (Direct API)">
        {/* Đã thêm minWidth và cố định kích thước cha để Recharts không bị lỗi tính toán width/height */}
        <div style={{ width: "100%", height: 400, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Đổ màu gradient vàng nắng dịu mờ dần cho vùng biểu đồ ánh sáng */}
                <linearGradient id="colorLightDirect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#faad14" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#faad14" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

              <XAxis 
                dataKey="timeLabel" 
                tick={{ fontSize: 11, fill: "#8c8c8c" }}
                minTickGap={40} // Tăng khoảng cách tối thiểu giữa các nhãn trục X để chữ không dính vào nhau
              />

              <YAxis 
                tick={{ fontSize: 12, fill: "#8c8c8c" }}
                label={{ value: 'Lux', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
              />

              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, borderColor: "#e8e8e8" }}
              />

              <Area
                type="monotone"
                dataKey="Cường độ ánh sáng (lux)"
                stroke="#faad14"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLightDirect)"
                dot={false} // Tắt các chấm tròn để biểu đồ mượt hơn khi tải 200 records sát nhau
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