import React from 'react';
import { Link } from 'react-router-dom';
import BasicButton from '../../components/button/BasicButton';

const Main = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow flex items-center justify-center">
        <img src={process.env.PUBLIC_URL + "/images/main/penguin.png"} alt="펭귄" />
      </div>
      <div className="w-full h-[110px] flex flex-col justify-between mb-24">
        <Link to={"/signIn"}>
          <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>로그인</BasicButton>
        </Link>
        <Link to={"/signUp"}>
        <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>
        </Link>
      </div>
    </div>
  );
};

export default Main;