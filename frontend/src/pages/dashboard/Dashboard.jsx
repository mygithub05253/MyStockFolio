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
    // [모바일 최적화 반영] - max-w-md와 mx-auto를 사용하여 모바일 뷰에서 중앙 정렬 및 너비 제한
    <div className="container mx-auto p-4 max-w-md"> 
        <h1 className="text-2xl font-bold mb-4">대시보드</h1>
        <p className="mb-6 text-gray-600">
            안녕하세요, 사용자님! 포트폴리오 현황을 확인하세요.
        </p>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">총 자산 가치</p>
                <p className="text-xl font-bold text-indigo-600">₩ 12,345,678</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">총 수익률</p>
                <p className="text-xl font-bold text-green-500">+15.5%</p>
            </div>
        </div>

        {/* 자산 배분 차트 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-3">자산 배분</h2>
            <div className="h-64 flex justify-center items-center">
                <p className="text-gray-400">자산 배분 Pie Chart</p>
            </div>
        </div>

        {/* 자산 추이 차트 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
             <h2 className="text-xl font-semibold mb-3">자산 추이</h2>
            <div className="h-64 flex justify-center items-center">
                <p className="text-gray-400">자산 추이 Line Chart</p>
            </div>
        </div>

        {/* 개발자 모드 버튼 (요청 사항 반영) */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">개발자 모드</p>
             <button 
                onClick={() => alert('개발자 모드 ON/OFF 로직 구현 예정')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
             >
                DEV MODE
             </button>
        </div>
    </div>
  );
};

export default Dashboard;