import React from 'react'; // useState, useEffect 제거 (임시 데이터만 사용)
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, PointElement, LineElement, Title
} from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title
);

// 임시 데이터 (실제로는 API에서 받아와야 함)
const dashboardStats = {
  totalValue: 12345.67, // 총 평가 금액
  totalInvestment: 10000.00, // 총 투자 원금
  totalProfitLoss: 2345.67, // 총 평가 손익
  totalProfitLossRate: 23.46, // 총 수익률 (%)
  todayProfitLoss: 150.23, // 오늘 손익
  todayProfitLossRate: 1.23, // 오늘 수익률 (%)
  allocation: [
    { name: '국내 주식', value: 45 },
    { name: '해외 주식', value: 25 },
    { name: '코인', value: 20 },
    { name: '현금', value: 10 },
  ],
  history: [
    { date: '2025-10-01', value: 10000 },
    { date: '2025-10-08', value: 10500 },
    { date: '2025-10-15', value: 11000 },
    { date: '2025-10-22', value: 11500 },
    { date: '2025-10-27', value: 12345.67 },
  ]
};

// 숫자 포맷 함수 (옵션)
const formatCurrency = (value) => {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const formatPercent = (value) => {
  return value.toFixed(2); // 소수점 2자리
};
const formatProfitLoss = (value) => {
  return `${value >= 0 ? '+' : ''}${formatCurrency(value)}`;
};
const formatProfitLossRate = (value) => {
  return `${value >= 0 ? '+' : ''}${formatPercent(value)}%`;
};


const Dashboard = () => {
  // useEffect로 API 호출하는 부분은 백엔드 구현 후 추가

  // --- 차트 데이터 가공 ---
  const pieChartData = {
    labels: dashboardStats.allocation.map(item => item.name),
    datasets: [{
      data: dashboardStats.allocation.map(item => item.value),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)', // 파랑
        'rgba(255, 99, 132, 0.8)', // 빨강
        'rgba(255, 206, 86, 0.8)', // 노랑
        'rgba(75, 192, 192, 0.8)', // 초록
        'rgba(153, 102, 255, 0.8)', // 보라
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1,
    }],
  };

  const lineChartData = {
    labels: dashboardStats.history.map(item => item.date.substring(5)),
    datasets: [{
      label: '총 자산 ($)', // 레이블 변경
      data: dashboardStats.history.map(item => item.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      pointRadius: 0, // 데이터 포인트 숨김 (선택 사항)
    }]
  };

  // --- 차트 옵션 ---
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' }, // 범례 위치 변경
      title: { display: false },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 높이 조절 가능하도록
    plugins: {
      legend: { display: false }, // 범례 숨김 (데이터셋 레이블로 충분)
      title: { display: false },
    },
    scales: { y: { beginAtZero: false } }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">대시보드</h1>

      {/* 1. 주요 통계 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 총 평가 금액 */}
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">총 평가 금액</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ${formatCurrency(dashboardStats.totalValue)}
          </p>
        </div>
        {/* 총 투자 원금 */}
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">총 투자 원금</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ${formatCurrency(dashboardStats.totalInvestment)}
          </p>
        </div>
        {/* 총 평가 손익 */}
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">총 평가 손익 (수익률)</p>
          <p className={`text-xl font-bold mt-1 ${dashboardStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatProfitLoss(dashboardStats.totalProfitLoss)}
          </p>
          <p className={`text-sm mt-1 ${dashboardStats.totalProfitLossRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({formatProfitLossRate(dashboardStats.totalProfitLossRate)})
          </p>
        </div>
        {/* 오늘 손익 */}
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">오늘 손익 (수익률)</p>
           <p className={`text-xl font-bold mt-1 ${dashboardStats.todayProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatProfitLoss(dashboardStats.todayProfitLoss)}
          </p>
           <p className={`text-sm mt-1 ${dashboardStats.todayProfitLossRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             ({formatProfitLossRate(dashboardStats.todayProfitLossRate)})
          </p>
        </div>
      </div>

      {/* 2. 자산 배분 (Pie Chart) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">자산 배분</h2>
        <div className="w-full max-w-sm mx-auto h-64"> {/* 높이 고정 */}
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* 3. 자산 추이 (Line Chart) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">자산 추이</h2>
        <div className="w-full h-64"> {/* 높이 고정 */}
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;