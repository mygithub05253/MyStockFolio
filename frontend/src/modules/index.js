// root reducer 생성
import { combineReducers } from "redux";
import user from "./user";
import todo from "./todo";

const rootReducer = combineReducers({
  user,
  todo
});

export default rootReducer;