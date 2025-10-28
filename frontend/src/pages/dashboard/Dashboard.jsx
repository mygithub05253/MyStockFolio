import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { setDashboardStats, setLoading, setError } from '../../modules/dashboard'; 

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
        
        const fetchDashboardStats = async () => {
            dispatch(setLoading(true));
            try {
                // GET /api/dashboard/stats API 호출
                const response = await axiosInstance.get('/api/dashboard/stats');
                console.log('✅ 대시보드 API 응답:', response.data); // 디버깅용
                dispatch(setDashboardStats(response.data));
            } catch (err) {
                console.error("대시보드 통계 로드 실패:", err);
                // 401은 인터셉터에서 처리되므로, 그 외 오류만 Redux에 저장
                if (err.response?.status !== 401) {
                    dispatch(setError(err.message));
                }
            }
        };

        fetchDashboardStats();
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
                <div className="h-64 flex justify-center items-center">
                    <p className="text-gray-400">자산 배분 Pie Chart (데이터 준비됨)</p>
                </div>
            </div>

            {/* 자산 추이 차트 */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                 <h2 className="text-xl font-semibold mb-3">자산 추이</h2>
                <div className="h-64 flex justify-center items-center">
                    <p className="text-gray-400">자산 추이 Line Chart (데이터 연동 예정)</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;