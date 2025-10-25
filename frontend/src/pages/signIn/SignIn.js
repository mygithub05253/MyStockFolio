import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/input/style';
import BasicButton from "../../components/button/BasicButton.jsx";

const SignIn = () => {
  
  // react-hook-form
  const { register, handleSubmit, getValues, formState: { isSubmitted, isSubmitting, errors } } = useForm({ mode : "onchange" });

  // 정규식 문법
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  return (
    <form className="w-full h-full" onSubmit={handleSubmit((data) => { 
        console.log(data)
      })}>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">이메일</p>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="text" 
          id="email" name="email" 
          placeholder="아이디를 입력하세요." 
          {...register("email", { required : true, pattern : { value : emailRegex } })} 
        />
        {errors?.email?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일을 입력해주세요.</p>
        )}  
        {errors?.email?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일 양식에 맞게 입력해주세요.</p>
        )}  
      </label>

      {/* ------------------- 비밀번호 ------------------- */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호</p>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="password" 
          id="password" name="password" 
          placeholder="비밀번호를 입력하세요." 
          {...register("password", { required : true, pattern : { value : passwordRegex } })} 
        />
        {errors?.password?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">비밀번호를 입력해주세요.</p>
        )}  
        {errors?.password?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">소문자, 숫자, 특수문자 각 하나씩 포함한 8자리 이상이어야 합니다.</p>
        )}  
      </label>

      <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>로그인</BasicButton>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">또는</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* 소셜 & 블록체인 로그인 버튼 */}
      <div className="flex flex-col space-y-3">
        {/* 1. MetaMask 로그인 버튼 */}
        <button 
          type="button"
          className="flex items-center justify-center w-full py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          onClick={() => {
            // ⭐️ 여기에 MetaMask 로그인 로직 구현
            // (예: 7단계에서 ethers.js 설치 후 지갑 연결)
            console.log("MetaMask 로그인 시도");
          }}
        >
          {/*  */}
          <span className="ml-2 font-semibold">MetaMask로 로그인</span>
        </button>
        
        {/* 2. 구글 로그인 버튼 */}
        <button 
          type="button"
          className="flex items-center justify-center w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
          onClick={() => {
            window.location.href = "http://localhost:8080/oauth2/authorization/google";
          }}
        >
          {/*  */}
          <span className="ml-2 font-semibold">Google로 로그인</span>
        </button>
        
        {/* 3. 카카오 로그인 버튼 */}
        <button 
          type="button"
          className="flex items-center justify-center w-full py-3 text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
          onClick={() => {
            window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
          }}
        >
          {/*  */}
          <span className="ml-2 font-semibold">Kakao로 로그인</span>
        </button>
      </div>
    </form>
  );
};

export default SignIn;