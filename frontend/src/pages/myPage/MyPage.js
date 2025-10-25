import React from 'react';
import { useSelector } from "react-redux";
import { useSearchParams, Navigate } from 'react-router-dom';

const MyPage = () => {

  const [searchParams] = useSearchParams();
  const login = searchParams.get("login");

  const previousUrl = useSelector((state) => state.user.previousUrl);
  const isLogin = useSelector((state) => state.user.isLogin);

  if(login) {
    return (
      <div>
        관리자 페이지
      </div>
    )
  }

  // Navigate to={보낼 경로} replace={} 왔던 기록을 없애게 만듬 => history에서 사라짐
  return <Navigate to={previousUrl} replace={true} />
};

export default MyPage;