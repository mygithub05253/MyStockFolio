import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

// 임시: 외부 API 호출 함수 (나중에 market-data-svc로 이동)
const fetchAssetData = async (ticker) => {
  // TODO: 나중에 백엔드 API(/api/market/chart?ticker=...) 호출로 변경
  console.log(`Fetching data for ${ticker}... (Placeholder)`);
  // 임시 차트 데이터 반환
  return {
    currentPrice: Math.random() * 100 + 100, // 임의의 현재가
    history: [
      { date: '2025-10-01', value: Math.random() * 10 + 95 },
      { date: '2025-10-08', value: Math.random() * 10 + 100 },
      { date: '2025-10-15', value: Math.random() * 10 + 105 },
      { date: '2025-10-22', value: Math.random() * 10 + 110 },
      { date: '2025-10-27', value: Math.random() * 10 + 115 },
    ]
  };
};

const AssetDetailModal = ({ asset, isOpen, onClose }) => {
  const [chartData, setChartData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    // 모달이 열리고 asset 데이터가 있을 때만 API 호출
    if (isOpen && asset && asset.ticker) {
      const loadData = async () => {
        const data = await fetchAssetData(asset.ticker);
        setCurrentPrice(data.currentPrice);

        // 차트 데이터 가공
        setChartData({
          labels: data.history.map(item => item.date.substring(5)), // MM-DD
          datasets: [{
            label: `${asset.ticker} 가격 추이 ($)`,
            data: data.history.map(item => item.value),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        });
      };
      loadData();
    } else {
      // 모달이 닫히거나 asset이 없으면 데이터 초기화
      setChartData(null);
      setCurrentPrice(null);
    }
  }, [isOpen, asset]); // isOpen 또는 asset이 변경될 때마다 실행

  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen || !asset) {
    return null;
  }

  // 차트 옵션 (Dashboard.js와 유사)
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { y: { beginAtZero: false } }
  };

  // 외부 링크 생성 함수 (요청 2)
  const getExternalLink = (ticker) => {
    // TODO: 코인 티커 등 다른 종류 자산 링크 추가
    return `https://finance.yahoo.com/quote/${ticker}`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* 모달 컨텐츠 (배경 클릭 시 닫히지 않도록 이벤트 전파 중단) */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl" onClick={onClose}>
          &times; {/* 'x' 아이콘 */}
        </button>

        {/* 모달 헤더 */}
        <h2 className="text-2xl font-semibold mb-4">{asset.name || 'Unknown'} ({asset.ticker})</h2>

        {/* 상세 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">현재가</p>
            <p className="font-medium text-lg">
              {currentPrice !== null ? `$${currentPrice.toFixed(2)}` : '로딩 중...'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">보유 수량</p>
            <p className="font-medium">{asset.quantity}</p>
          </div>
          <div>
            <p className="text-gray-500">평균 매수 단가</p>
            <p className="font-medium">${asset.avgBuyPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">평가 금액</p>
            <p className="font-medium text-lg">
              {currentPrice !== null ? `$${(currentPrice * asset.quantity).toFixed(2)}` : '로딩 중...'}
            </p>
          </div>
        </div>

        {/* 차트 영역 (요청 1) */}
        <div className="mb-6 h-64">
          {chartData ? (
            <Line data={chartData} options={lineChartOptions} />
          ) : (
            <div className="h-full bg-gray-200 flex items-center justify-center rounded">차트 로딩 중...</div>
          )}
        </div>

        {/* 외부 링크 버튼 (요청 2) */}
        <a
          href={getExternalLink(asset.ticker)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Yahoo Finance에서 더보기
        </a>
      </div>
    </div>
  );
};

export default AssetDetailModal;