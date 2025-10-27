import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  // TODO: 나중에 백엔드(/api/portfolio/stats)에서 실제 데이터 가져오기
  const [stats, setStats] = useState({
    totalValue: 12345.67,
    totalProfitLoss: 1500.23,
    totalProfitLossRate: 13.8,
    allocation: [
      { name: '주식', value: 60 },
      { name: '코인', value: 30 },
      { name: '현금', value: 10 },
    ],
    history: [
      { date: '2025-10-01', value: 10000 },
      { date: '2025-10-08', value: 10500 },
      { date: '2025-10-15', value: 11000 },
      { date: '2025-10-22', value: 11500 },
      { date: '2025-10-27', value: 12345.67 },
    ]
  });

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await fetch('/api/portfolio/stats');
  //       if (!response.ok) throw new Error('Network response was not ok');
  //       const data = await response.json();
  //       setStats(data);
  //     } catch (error) {
  //       console.error("Failed to fetch dashboard stats:", error);
  //       // TODO: 에러 처리 UI
  //     }
  //   };
  //   fetchStats();
  // }, []);

  // --- 임시 차트 데이터 및 옵션 (나중에 실제 데이터로 교체) ---
  const pieChartData = {
    labels: stats.allocation.map(item => item.name),
    datasets: [{
      label: '자산 배분 (%)',
      data: stats.allocation.map(item => item.value),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(255, 255, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const lineChartData = {
    labels: stats.history.map(item => item.date.substring(5)),
    datasets: [{
      label: '총 자산 추이 ($)',
      data: stats.history.map(item => item.value),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };


  return (
    <div className="p-4 space-y-6">
      {/* 1. 총 자산 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">총 자산 현황</h2>
        <p className="text-3xl font-bold text-gray-900">
          ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-lg mt-2 ${stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.totalProfitLoss >= 0 ? '+' : ''}
          ${stats.totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          ({stats.totalProfitLossRate.toFixed(1)}%)
        </p>
      </div>

      {/* 2. 자산 배분 (Pie Chart 영역) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">자산 배분</h2>
        <div className="w-full max-w-xs mx-auto">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* 3. 자산 추이 (Line Chart 영역) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">자산 추이</h2>
        <div className="w-full">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;