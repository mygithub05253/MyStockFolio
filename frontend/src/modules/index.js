// root reducer 생성
import { combineReducers } from "redux";
import user from "./user";
import todo from "./todo";
import portfolio from './portfolio';
import dashboard from './dashboard';

const rootReducer = combineReducers({
  user,
  todo,
  portfolio,
  dashboard
});

export default rootReducer;