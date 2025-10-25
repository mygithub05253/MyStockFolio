import { createAction, handleActions } from "redux-actions";

// 유저에 대한 타입을 생성
const SET_PREVIOUS_URL = "user/SET_PREVIOUS_URL";
const SET_USER = "user/SET_USER";
const SET_USER_STATUS = "user/SET_USER_STATUS";

// 유저 관련 액션을 생성
export const setPreviousUrl = createAction(SET_PREVIOUS_URL, (previousUrl) => previousUrl);
export const setUser = createAction(SET_USER, (currentUser) => currentUser);
export const setUserStatus = createAction(SET_USER_STATUS, (isLogin) => isLogin);

const intitialValue = {
  currentUser : {},
  isLogin : false,
  previousUrl : ""
};

// reducer 부분
const user = handleActions({
  [SET_PREVIOUS_URL] : (state = intitialValue, action) => ({...state, previousUrl : action.payload}),
  [SET_USER] : (state = intitialValue, action) => ({...state, currentUser : action.payload}),
  [SET_USER_STATUS] : (state = intitialValue, action) => ({...state, isLogin : action.payload}),
}, intitialValue);

export default user;