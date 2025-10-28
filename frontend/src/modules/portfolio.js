// frontend/src/modules/portfolio.js

// 액션 타입 정의
const SET_PORTFOLIOS = 'portfolio/SET_PORTFOLIOS';
const ADD_PORTFOLIO = 'portfolio/ADD_PORTFOLIO';
const REMOVE_PORTFOLIO = 'portfolio/REMOVE_PORTFOLIO';
// 자산 관련 액션 추가
const ADD_ASSET = 'portfolio/ADD_ASSET';
const UPDATE_ASSET = 'portfolio/UPDATE_ASSET';
const DELETE_ASSET = 'portfolio/DELETE_ASSET';

// 액션 생성 함수
export const setPortfolios = (portfolios) => ({
    type: SET_PORTFOLIOS,
    payload: portfolios
});

export const addPortfolio = (portfolio) => ({
    type: ADD_PORTFOLIO,
    payload: portfolio
});

export const removePortfolio = (portfolioId) => ({
    type: REMOVE_PORTFOLIO,
    payload: portfolioId
});

// 자산 액션 생성 함수
export const addAsset = (portfolioId, asset) => ({
    type: ADD_ASSET,
    payload: { portfolioId, asset }
});

export const updateAsset = (portfolioId, asset) => ({
    type: UPDATE_ASSET,
    payload: { portfolioId, asset }
});

export const deleteAsset = (portfolioId, assetId) => ({
    type: DELETE_ASSET,
    payload: { portfolioId, assetId }
});


// 초기 상태
const initialState = {
    list: [], // 포트폴리오 목록
    isLoading: false, // 로딩 상태
    error: null, // 오류 상태
    selectedPortfolioId: null, // 현재 선택된 포트폴리오 ID
};

// 리듀서
function portfolio(state = initialState, action) {
    switch (action.type) {
        case SET_PORTFOLIOS:
            return {
                ...state,
                list: action.payload,
                isLoading: false,
                error: null,
                selectedPortfolioId: action.payload.length > 0 
                    ? action.payload[0].id 
                    : null
            };
        case ADD_PORTFOLIO:
            return {
                ...state,
                list: [action.payload, ...state.list], 
                selectedPortfolioId: action.payload.id 
            };
        case REMOVE_PORTFOLIO:
            // ... (로직 생략)
            return state; 
        
        // [★★★ 자산 CRUD 리듀서 로직 ★★★]
        case ADD_ASSET:
        case UPDATE_ASSET:
        case DELETE_ASSET: {
            const { portfolioId, asset, assetId } = action.payload;
            
            // list 내에서 해당 portfolio를 찾아 assets 업데이트
            const newPortfolioList = state.list.map(p => {
                if (p.id !== portfolioId) {
                    return p;
                }
                
                let newAssets = [...p.assets];

                if (action.type === ADD_ASSET) {
                    newAssets = [...newAssets, asset]; // 목록에 추가
                } else if (action.type === UPDATE_ASSET) {
                    newAssets = newAssets.map(a => a.id === asset.id ? asset : a); // 업데이트
                } else if (action.type === DELETE_ASSET) {
                    newAssets = newAssets.filter(a => a.id !== assetId); // 삭제
                }
                
                return {
                    ...p,
                    assets: newAssets // assets 목록 업데이트
                };
            });

            return {
                ...state,
                list: newPortfolioList
            };
        }
        
        default:
            return state;
    }
}

export default portfolio;