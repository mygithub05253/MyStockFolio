// 액션 타입 정의
const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
const LOGOUT = 'user/LOGOUT';
// const SET_USER_INFO = 'user/SET_USER_INFO'; // 필요시 사용자 정보 업데이트 액션 추가

// 액션 생성 함수
export const loginSuccess = (userData) => ({
    type: LOGIN_SUCCESS,
    payload: userData // 예: { userId, email, nickname }
});

export const logout = () => ({
    type: LOGOUT
});

// export const setUserInfo = (userInfo) => ({ type: SET_USER_INFO, payload: userInfo });

// 초기 상태
const initialState = {
    isLoggedIn: false, // 로그인 상태
    userInfo: null,   // 사용자 정보 (예: { userId, email, nickname })
};

// 리듀서
function user(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.payload // 로그인 시 받은 사용자 정보 저장
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null // 로그아웃 시 사용자 정보 초기화
            };
        // case SET_USER_INFO:
        //     return { ...state, userInfo: { ...state.userInfo, ...action.payload } };
        default:
            return state;
    }
}

export default user;