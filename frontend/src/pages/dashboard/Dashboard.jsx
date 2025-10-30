import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { setDashboardStats, setLoading, setError } from '../../modules/dashboard'; 
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from 'chart.js';

// Chart.js 컴포넌트 등록
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

// 숫자 포맷팅 유틸리티 (로컬 함수로 구현)
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₩ 0';
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatPercentage = (rate) => {
    if (rate === undefined || rate === null) return '0.00%';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(2)}%`;
};

// 수익률 색상 클래스 반환
const getReturnColorClass = (rate) => {
    if (rate === undefined || rate === null) return 'text-gray-600';
    return rate > 0 ? 'text-green-500' : rate < 0 ? 'text-red-500' : 'text-gray-600';
};


const Dashboard = () => {
    const dispatch = useDispatch();
    // [★★★ 수정: 모든 useSelector 호출을 최상단으로 이동 ★★★]
    const { stats, isLoading, error } = useSelector(state => state.dashboard);
    const { isLoggedIn, userInfo } = useSelector(state => state.user); 
    // [★★★ 수정 완료 ★★★]

    // [API 호출 및 데이터 로드 로직]
    useEffect(() => {
        if (!isLoggedIn) return; 
        
        // 임시로 테스트 데이터 사용 (API 문제 해결 전까지)
        const testStats = {
            totalMarketValue: 1500000,
            totalReturnRate: 12.5,
            totalGainLoss: 150000,
            totalInitialInvestment: 1350000,
            assetAllocations: [
                { assetType: 'STOCK', value: 800000, percentage: 53.3 },
                { assetType: 'COIN', value: 500000, percentage: 33.3 },
                { assetType: 'STABLECOIN', value: 200000, percentage: 13.4 }
            ]
        };
        
        console.log('📊 테스트 데이터 사용:', testStats);
        dispatch(setDashboardStats(testStats));
        
        // API 호출은 일시적으로 비활성화
        /*
        const fetchDashboardStats = async () => {
            dispatch(setLoading(true));
            try {
                const response = await axiosInstance.get('/api/dashboard/stats');
                console.log('✅ 대시보드 API 응답:', response.data);
                dispatch(setDashboardStats(response.data));
            } catch (err) {
                console.error("대시보드 통계 로드 실패:", err);
                if (err.response?.status !== 401) {
                    dispatch(setError(err.message));
                }
            }
        };
        fetchDashboardStats();
        */
    }, [dispatch, isLoggedIn]);

    // [실제 통계 데이터 사용 - API에서 받아온 데이터 우선]
    // stats 객체가 비어있지 않으면 실제 데이터, 비어있으면 기본값 0
    const hasData = stats && (stats.totalMarketValue !== undefined || stats.totalInitialInvestment !== undefined);
    
    const displayData = {
        totalMarketValue: hasData ? (stats.totalMarketValue ?? 0) : 0,
        totalReturnRate: hasData ? (stats.totalReturnRate ?? 0) : 0,
        totalGainLoss: hasData ? (stats.totalGainLoss ?? 0) : 0,
        totalInitialInvestment: hasData ? (stats.totalInitialInvestment ?? 0) : 0,
        assetAllocations: (stats.assetAllocations && stats.assetAllocations.length > 0) ? stats.assetAllocations : []
    };
    
    console.log('📊 대시보드 표시 데이터:', displayData); // 디버깅용

    // 로딩 및 오류 처리 UI (Hook 호출 후에 Early Return)
    if (isLoading) {
        return <div className="container mx-auto p-4 max-w-md text-center mt-10">데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 max-w-md text-center mt-10 text-red-600">오류 발생: {error}</div>;
    }

    // Pie Chart 데이터 준비
    const pieChartData = {
        labels: displayData.assetAllocations.map(item => {
            const typeLabels = {
                'STOCK': '주식',
                'COIN': '코인',
                'STABLECOIN': '스테이블코인',
                'DEFI': 'DeFi',
                'NFT': 'NFT',
                'OTHER': '기타'
            };
            return typeLabels[item.assetType] || item.assetType;
        }),
        datasets: [{
            label: '자산 배분',
            data: displayData.assetAllocations.map(item => item.value),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = displayData.assetAllocations[context.dataIndex]?.percentage || 0;
                        return `${label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;
                    }
                }
            }
        }
    };

    // Line Chart 데이터 준비 (임시 데이터 - 추후 백엔드에서 시계열 데이터 받아올 예정)
    const generateMockTimeSeriesData = () => {
        const days = 30;
        const baseValue = displayData.totalInitialInvestment || 1000000;
        const currentValue = displayData.totalMarketValue || baseValue;
        const dates = [];
        const values = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
            
            // 선형 증가/감소를 시뮬레이션
            const progress = (days - i) / days;
            const value = baseValue + (currentValue - baseValue) * progress;
            values.push(value);
        }
        
        return { dates, values };
    };

    const timeSeriesData = generateMockTimeSeriesData();

    const lineChartData = {
        labels: timeSeriesData.dates,
        datasets: [{
            label: '총 자산 가치',
            data: timeSeriesData.values,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.3,
            fill: true,
        }]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return formatCurrency(context.parsed.y);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };
    

    return (
        <div className="container mx-auto p-4 max-w-md"> 
            <h1 className="text-2xl font-bold mb-4">대시보드</h1>
            <p className="mb-6 text-gray-600">
                안녕하세요, {userInfo?.nickname || '사용자'}님! 포트폴리오 현황을 확인하세요.
            </p>

            {/* 주요 통계 카드 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* 총 자산 가치 */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">총 자산 가치</p>
                    <p className="text-xl font-bold text-indigo-600">
                        {formatCurrency(displayData.totalMarketValue)}
                    </p>
                </div>
                {/* 총 수익률 */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">총 수익률</p>
                    <p className={`text-xl font-bold ${getReturnColorClass(displayData.totalReturnRate)}`}>
                        {formatPercentage(displayData.totalReturnRate)}
                    </p>
                </div>
                {/* 총 손익 */}
                 <div className="bg-white p-4 rounded-lg shadow col-span-2">
                    <p className="text-sm text-gray-500">총 손익</p>
                    <p className={`text-xl font-bold ${getReturnColorClass(displayData.totalGainLoss)}`}>
                         {formatCurrency(displayData.totalGainLoss)}
                    </p>
                </div>
            </div>

            {/* 자산 배분 차트 */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-3">자산 배분</h2>
                <div className="h-64">
                    {displayData.assetAllocations.length > 0 ? (
                        <Pie data={pieChartData} options={pieChartOptions} />
                    ) : (
                        <div className="h-full flex justify-center items-center">
                            <p className="text-gray-400">자산 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 자산 추이 차트 */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                 <h2 className="text-xl font-semibold mb-3">자산 추이 (최근 30일)</h2>
                <div className="h-64">
                    {displayData.totalMarketValue > 0 ? (
                        <Line data={lineChartData} options={lineChartOptions} />
                    ) : (
                        <div className="h-full flex justify-center items-center">
                            <p className="text-gray-400">자산 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;